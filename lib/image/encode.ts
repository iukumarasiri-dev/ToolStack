export type OutputMime = "image/jpeg" | "image/png" | "image/webp";

export const OUTPUT_FORMATS: { mime: OutputMime; label: string; ext: string; lossy: boolean }[] = [
  { mime: "image/jpeg", label: "JPG", ext: "jpg", lossy: true },
  { mime: "image/png", label: "PNG", ext: "png", lossy: false },
  { mime: "image/webp", label: "WebP", ext: "webp", lossy: true },
];

export function formatInfo(mime: string) {
  return OUTPUT_FORMATS.find((f) => f.mime === mime);
}

/** Keeps the original format when the browser can encode it, otherwise falls back to PNG. */
export function defaultOutputMime(file: File): OutputMime {
  return formatInfo(file.type)?.mime ?? "image/png";
}

/**
 * Encodes a canvas to a file. Note the browser may return a different type than
 * requested (e.g. older Safari encodes WebP as PNG) — use the returned blob's `type`.
 */
export function encodeCanvas(
  canvas: HTMLCanvasElement,
  mime: OutputMime,
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolve(blob)
          : reject(new Error("The image is too large for your browser to process.")),
      mime,
      quality,
    );
  });
}
