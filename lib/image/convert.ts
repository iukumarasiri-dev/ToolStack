import type { OutputMime } from "./encode";
import { decodeHeic, isHeic } from "./heic";
import { loadImage } from "./load";
import { resizeImage } from "./resize";

/**
 * Converts an image file to another format at its original size.
 * HEIC files are decoded first; EXIF orientation is applied, so the output is upright.
 */
export async function convertImage(file: File, mime: OutputMime, quality = 0.92): Promise<Blob> {
  const source = isHeic(file) ? await decodeHeic(file) : file;
  const image = await loadImage(source);
  try {
    return await resizeImage(image, { width: image.width, height: image.height, mime, quality });
  } finally {
    image.close();
  }
}
