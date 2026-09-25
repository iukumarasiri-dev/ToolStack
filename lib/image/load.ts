/** Image types every modern browser can decode natively. HEIC needs a decoder (see image converter). */
export const BROWSER_IMAGE_ACCEPT = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".avif",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/bmp",
  "image/avif",
];

export interface LoadedImage {
  /** Drawable source for canvas operations. */
  source: CanvasImageSource;
  /** Dimensions after applying EXIF orientation (what the user sees). */
  width: number;
  height: number;
  /** Frees the decoded image. Call when the image is no longer needed. */
  close: () => void;
}

export class ImageLoadError extends Error {}

/**
 * Decodes an image file in the browser, applying its EXIF orientation so
 * phone photos come out the right way up.
 */
export async function loadImage(file: Blob): Promise<LoadedImage> {
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      return {
        source: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        close: () => bitmap.close(),
      };
    } catch {
      // Fall through to <img> decoding, which supports a few more edge cases.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.decoding = "async";
    img.src = url;
    await img.decode();
    return {
      source: img,
      width: img.naturalWidth,
      height: img.naturalHeight,
      close: () => URL.revokeObjectURL(url),
    };
  } catch {
    URL.revokeObjectURL(url);
    throw new ImageLoadError(
      "This image couldn't be opened. It may be damaged or in an unsupported format.",
    );
  }
}
