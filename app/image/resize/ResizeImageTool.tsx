"use client";

import { useEffect, useState } from "react";
import { CircleAlert, ImagePlus, Link2, Link2Off, LoaderCircle, TriangleAlert } from "lucide-react";
import { DownloadButton } from "@/components/tool/DownloadButton";
import { FileUploader } from "@/components/tool/FileUploader";
import { Button } from "@/components/ui/Button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { OUTPUT_FORMATS, defaultOutputMime, formatInfo, type OutputMime } from "@/lib/image/encode";
import { BROWSER_IMAGE_ACCEPT, loadImage, type LoadedImage } from "@/lib/image/load";
import { MAX_DIMENSION, resizeImage } from "@/lib/image/resize";
import { cn, fileBaseName, formatBytes } from "@/lib/utils";

type Mode = "pixels" | "percent";

const PERCENT_PRESETS = [25, 50, 75, 150, 200];

interface Loaded {
  image: LoadedImage;
  previewUrl: string;
}

interface Result {
  blob: Blob;
  width: number;
  height: number;
  /** The settings that produced this result; it's hidden once settings change. */
  key: string;
}

const inputClass =
  "border-border bg-background focus-visible:outline-brand h-10 w-full rounded-lg border px-3 tabular-nums focus-visible:outline-2 focus-visible:outline-offset-1";

export function ResizeImageTool() {
  const upload = useFileUpload({ accept: BROWSER_IMAGE_ACCEPT });
  const file = upload.files[0]?.file ?? null;

  const [loaded, setLoaded] = useState<Loaded | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [mode, setMode] = useState<Mode>("pixels");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [percent, setPercent] = useState(50);
  const [keepAspect, setKeepAspect] = useState(true);
  const [mime, setMime] = useState<OutputMime>("image/png");
  const [quality, setQuality] = useState(90);

  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [resizeError, setResizeError] = useState<string | null>(null);

  // Decode the chosen file and reset the settings to match it.
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    let current: Loaded | null = null;

    loadImage(file)
      .then((image) => {
        if (cancelled) return image.close();
        current = { image, previewUrl: URL.createObjectURL(file) };
        setLoaded(current);
        setWidth(image.width);
        setHeight(image.height);
        setMime(defaultOutputMime(file));
      })
      .catch((err: Error) => !cancelled && setLoadError(err.message));

    return () => {
      cancelled = true;
      if (current) {
        current.image.close();
        URL.revokeObjectURL(current.previewUrl);
      }
    };
  }, [file]);

  function handleFiles(files: File[]) {
    setLoaded(null);
    setLoadError(null);
    setResult(null);
    setResizeError(null);
    // Each new image starts with safe defaults: exact pixels, proportions locked.
    setMode("pixels");
    setKeepAspect(true);
    upload.addFiles(files);
  }

  function reset() {
    upload.clear();
    setLoaded(null);
    setLoadError(null);
    setResult(null);
    setResizeError(null);
  }

  if (!file) {
    return (
      <FileUploader
        accept={BROWSER_IMAGE_ACCEPT}
        onFiles={handleFiles}
        errors={upload.errors}
        hint="JPG, PNG, WebP, GIF, BMP or AVIF"
      />
    );
  }

  if (loadError) {
    return (
      <div className="border-border bg-surface rounded-2xl border p-8 text-center">
        <CircleAlert className="mx-auto size-8 text-red-600 dark:text-red-400" aria-hidden />
        <p className="mt-3 font-medium">{loadError}</p>
        <Button variant="secondary" className="mt-6" onClick={reset}>
          Choose another image
        </Button>
      </div>
    );
  }

  if (!loaded) {
    return (
      <div className="border-border bg-surface text-muted flex items-center justify-center gap-2 rounded-2xl border p-12">
        <LoaderCircle className="size-5 animate-spin" aria-hidden />
        Opening image…
      </div>
    );
  }

  const { image, previewUrl } = loaded;
  const aspect = image.width / image.height;

  const target =
    mode === "percent"
      ? {
          width: Math.max(1, Math.round((image.width * percent) / 100)),
          height: Math.max(1, Math.round((image.height * percent) / 100)),
        }
      : { width, height };

  const valid =
    Number.isInteger(target.width) &&
    Number.isInteger(target.height) &&
    target.width >= 1 &&
    target.height >= 1 &&
    target.width <= MAX_DIMENSION &&
    target.height <= MAX_DIMENSION;
  const enlarging = target.width > image.width || target.height > image.height;
  const lossy = formatInfo(mime)?.lossy ?? false;
  const settingsKey = `${target.width}x${target.height}|${mime}|${lossy ? quality : ""}`;
  const currentResult = result?.key === settingsKey ? result : null;

  function changeWidth(value: number) {
    setWidth(value);
    if (keepAspect && value > 0) setHeight(Math.max(1, Math.round(value / aspect)));
  }

  function changeHeight(value: number) {
    setHeight(value);
    if (keepAspect && value > 0) setWidth(Math.max(1, Math.round(value * aspect)));
  }

  function toggleAspect() {
    // Re-lock to the original proportions, using the current width.
    if (!keepAspect && width > 0) setHeight(Math.max(1, Math.round(width / aspect)));
    setKeepAspect(!keepAspect);
  }

  async function handleResize() {
    setProcessing(true);
    setResizeError(null);
    try {
      const blob = await resizeImage(image, {
        ...target,
        mime,
        quality: quality / 100,
      });
      setResult({ blob, ...target, key: settingsKey });
    } catch (err) {
      setResizeError(err instanceof Error ? err.message : "Something went wrong while resizing.");
    } finally {
      setProcessing(false);
    }
  }

  const outputExt = formatInfo(currentResult?.blob.type ?? mime)?.ext ?? "png";
  const outputName = `${fileBaseName(file.name)}-${target.width}x${target.height}.${outputExt}`;
  const formatFellBack = currentResult && currentResult.blob.type !== mime;

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Preview */}
      <div className="lg:col-span-3">
        <div className="border-border flex min-h-64 items-center justify-center overflow-hidden rounded-2xl border bg-[repeating-conic-gradient(#e2e8f0_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-4 dark:bg-[repeating-conic-gradient(#1f2937_0%_25%,transparent_0%_50%)]">
          {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, nothing to optimize */}
          <img
            src={previewUrl}
            alt={`Preview of ${file.name}`}
            className="max-h-[28rem] w-auto max-w-full object-contain"
          />
        </div>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-muted min-w-0">
            <span className="text-foreground font-medium break-all">{file.name}</span> ·{" "}
            {image.width} × {image.height} px · {formatBytes(file.size)}
          </p>
          <label className="text-brand inline-flex cursor-pointer items-center gap-1.5 font-medium hover:underline">
            <ImagePlus className="size-4" aria-hidden />
            Change image
            <input
              type="file"
              accept={BROWSER_IMAGE_ACCEPT.join(",")}
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFiles([f]);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      {/* Options */}
      <div className="border-border bg-surface space-y-5 rounded-2xl border p-5 lg:col-span-2">
        <div
          role="group"
          aria-label="Resize by"
          className="bg-background grid grid-cols-2 rounded-lg p-1"
        >
          {(["pixels", "percent"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded-md py-1.5 text-sm font-medium transition-colors",
                mode === m
                  ? "bg-surface text-foreground shadow-sm"
                  : "text-muted hover:text-foreground",
              )}
            >
              {m === "pixels" ? "By pixels" : "By percentage"}
            </button>
          ))}
        </div>

        {mode === "pixels" ? (
          <div className="flex items-end gap-2">
            <label className="flex-1 text-sm">
              <span className="text-muted mb-1 block">Width (px)</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_DIMENSION}
                value={width || ""}
                onChange={(e) => changeWidth(Math.round(Number(e.target.value)))}
                className={inputClass}
              />
            </label>
            <button
              type="button"
              onClick={toggleAspect}
              aria-pressed={keepAspect}
              title={keepAspect ? "Proportions locked" : "Proportions unlocked"}
              className={cn(
                "mb-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                keepAspect ? "bg-brand-soft text-brand" : "text-muted hover:bg-brand-soft",
              )}
            >
              {keepAspect ? (
                <Link2 className="size-4" aria-hidden />
              ) : (
                <Link2Off className="size-4" aria-hidden />
              )}
              <span className="sr-only">Keep proportions</span>
            </button>
            <label className="flex-1 text-sm">
              <span className="text-muted mb-1 block">Height (px)</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={MAX_DIMENSION}
                value={height || ""}
                onChange={(e) => changeHeight(Math.round(Number(e.target.value)))}
                className={inputClass}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block text-sm">
              <span className="text-muted mb-1 block">Scale (%)</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={1000}
                value={percent || ""}
                onChange={(e) => setPercent(Math.round(Number(e.target.value)))}
                className={inputClass}
              />
            </label>
            <div className="flex flex-wrap gap-2">
              {PERCENT_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPercent(p)}
                  className={cn(
                    "rounded-full border px-3 py-1 text-sm transition-colors",
                    percent === p
                      ? "border-brand bg-brand-soft text-brand"
                      : "border-border hover:border-brand",
                  )}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm">
          New size:{" "}
          <span className="font-semibold tabular-nums">
            {valid ? `${target.width} × ${target.height} px` : "—"}
          </span>
        </p>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="text-muted mb-1 block">Format</span>
            <select
              value={mime}
              onChange={(e) => setMime(e.target.value as OutputMime)}
              className={inputClass}
            >
              {OUTPUT_FORMATS.map((f) => (
                <option key={f.mime} value={f.mime}>
                  {f.label}
                </option>
              ))}
            </select>
          </label>
          {lossy && (
            <label className="text-sm">
              <span className="text-muted mb-1 flex justify-between">
                Quality <span className="tabular-nums">{quality}%</span>
              </span>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="accent-brand h-10 w-full"
              />
            </label>
          )}
        </div>

        {!valid && (
          <p className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Width and height must be whole numbers between 1 and {MAX_DIMENSION} pixels.
          </p>
        )}
        {valid && enlarging && (
          <p className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Enlarging an image can make it look soft or blurry.
          </p>
        )}
        {resizeError && (
          <p role="alert" className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            {resizeError}
          </p>
        )}

        {currentResult ? (
          <div className="space-y-3">
            <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300">
              Resized to {currentResult.width} × {currentResult.height} px ·{" "}
              {formatBytes(currentResult.blob.size)}
              {formatFellBack && (
                <span className="mt-1 block text-xs">
                  Your browser can&apos;t save {formatInfo(mime)?.label} files, so it was saved as{" "}
                  {formatInfo(currentResult.blob.type)?.label ?? "PNG"}.
                </span>
              )}
            </div>
            <DownloadButton blob={currentResult.blob} filename={outputName} className="w-full" />
          </div>
        ) : (
          <Button
            size="lg"
            className="w-full"
            disabled={!valid || processing}
            onClick={handleResize}
          >
            {processing && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
            {processing ? "Resizing…" : "Resize image"}
          </Button>
        )}
      </div>
    </div>
  );
}
