/** HEIC/HEIF (iPhone photos). Most browsers can't decode these natively. */
export const HEIC_ACCEPT = [".heic", ".heif", "image/heic", "image/heif"];

export function isHeic(file: File): boolean {
  const name = file.name.toLowerCase();
  return (
    name.endsWith(".heic") ||
    name.endsWith(".heif") ||
    file.type === "image/heic" ||
    file.type === "image/heif"
  );
}

/**
 * Decodes a HEIC file to a PNG blob the browser can draw.
 * The decoder (~1.3 MB) is imported on demand, only when a HEIC file is converted.
 */
export async function decodeHeic(file: File): Promise<Blob> {
  const { default: heic2any } = await import("heic2any");
  try {
    const result = await heic2any({ blob: file, toType: "image/png" });
    // Multi-image HEIC files (bursts, Live Photos) return an array; use the first image.
    return Array.isArray(result) ? result[0] : result;
  } catch {
    throw new Error(
      "This HEIC file couldn't be decoded. It may be damaged or use an unsupported variant.",
    );
  }
}
