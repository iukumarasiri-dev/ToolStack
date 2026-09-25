import { encodeCanvas, type OutputMime } from "./encode";
import type { LoadedImage } from "./load";

/** Browsers refuse to create canvases beyond this size per side. */
export const MAX_DIMENSION = 16384;

export interface ResizeOptions {
  width: number;
  height: number;
  mime: OutputMime;
  /** 0–1, only used by JPG and WebP. */
  quality?: number;
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser couldn't create a drawing surface for this image.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  return { canvas, ctx };
}

/**
 * Resizes an image and encodes the result.
 * Large reductions are done in halving steps, which avoids the jagged,
 * over-sharpened look of shrinking an image in a single pass.
 */
export async function resizeImage(image: LoadedImage, options: ResizeOptions): Promise<Blob> {
  const { width, height, mime, quality } = options;
  if (width < 1 || height < 1 || width > MAX_DIMENSION || height > MAX_DIMENSION) {
    throw new RangeError(`Width and height must be between 1 and ${MAX_DIMENSION} pixels.`);
  }

  let source: CanvasImageSource = image.source;
  let srcW = image.width;
  let srcH = image.height;

  while (srcW / 2 >= width && srcH / 2 >= height) {
    const stepW = Math.round(srcW / 2);
    const stepH = Math.round(srcH / 2);
    const step = createCanvas(stepW, stepH);
    step.ctx.drawImage(source, 0, 0, stepW, stepH);
    source = step.canvas;
    srcW = stepW;
    srcH = stepH;
  }

  const { canvas, ctx } = createCanvas(width, height);
  if (mime === "image/jpeg") {
    // JPG has no transparency; without a fill, transparent areas turn black.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(source, 0, 0, width, height);
  return encodeCanvas(canvas, mime, quality);
}
