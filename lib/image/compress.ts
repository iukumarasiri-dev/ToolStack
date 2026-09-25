import { replaceExtension } from "@/lib/utils";
import { formatInfo, type OutputMime } from "./encode";
import { decodeHeic, isHeic } from "./heic";

export type CompressFormat = "original" | OutputMime;

export interface CompressSettings {
  /** "quality": fixed quality level. "size": aim for a maximum file size. */
  mode: "quality" | "size";
  /** 0–1, used in "quality" mode. */
  quality: number;
  /** Target maximum size in KB, used in "size" mode. */
  targetKB: number;
  /** Longest side in pixels, or null to keep the original dimensions. */
  maxDimension: number | null;
  format: CompressFormat;
}

export interface CompressResult {
  blob: Blob;
  /** The compressed file wasn't smaller, so the original is returned unchanged. */
  keptOriginal: boolean;
  /** "size" mode only: the target couldn't be reached. */
  missedTarget: boolean;
}

const MIME_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  avif: "image/avif",
};

/** The browser sometimes reports an empty type (e.g. AVIF on Windows); infer it from the extension. */
function withMimeType(file: File): File {
  if (file.type) return file;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const type = MIME_BY_EXT[ext];
  return type ? new File([file], file.name, { type, lastModified: file.lastModified }) : file;
}

/** Output type: the original when the browser can encode it, otherwise JPG. HEIC always becomes JPG. */
export function resolveOutputMime(file: File, format: CompressFormat): OutputMime {
  if (format !== "original") return format;
  if (isHeic(file)) return "image/jpeg";
  return formatInfo(withMimeType(file).type)?.mime ?? "image/jpeg";
}

/**
 * Compresses an image in a Web Worker. The library is imported on demand and its worker
 * code is served from our own domain (public/vendor, see scripts/copy-vendor.mjs).
 */
export async function compressImage(
  file: File,
  settings: CompressSettings,
  onProgress?: (percent: number) => void,
): Promise<CompressResult> {
  const { default: imageCompression } = await import("browser-image-compression");

  let input = withMimeType(file);
  if (isHeic(file)) {
    const png = await decodeHeic(file);
    input = new File([png], replaceExtension(file.name, "png"), { type: "image/png" });
  }

  const mime = resolveOutputMime(file, settings.format);
  const bySize = settings.mode === "size";
  const maxBytes = settings.targetKB * 1024;

  const output = await imageCompression(input, {
    fileType: mime,
    initialQuality: bySize ? 0.92 : settings.quality,
    maxSizeMB: bySize ? settings.targetKB / 1024 : Number.POSITIVE_INFINITY,
    maxWidthOrHeight: settings.maxDimension ?? undefined,
    // Each iteration lowers quality (and, in size mode, dimensions) by ~5%.
    maxIteration: bySize ? 30 : 10,
    useWebWorker: true,
    libURL: new URL("/vendor/browser-image-compression.js", window.location.origin).href,
    onProgress,
  });

  // Never hand back a bigger file in the same format and size as the original.
  const sameFormat = mime === withMimeType(file).type;
  if (output.size >= file.size && sameFormat && settings.maxDimension === null) {
    return { blob: file, keptOriginal: true, missedTarget: bySize && file.size > maxBytes };
  }
  return { blob: output, keptOriginal: false, missedTarget: bySize && output.size > maxBytes };
}
