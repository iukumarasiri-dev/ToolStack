"use client";

import { useState } from "react";
import { Download, ImagePlus, Info, LoaderCircle, Trash2 } from "lucide-react";
import { FileList, type FileListItem, type FileStatus } from "@/components/tool/FileList";
import { FileUploader } from "@/components/tool/FileUploader";
import { ProgressBar } from "@/components/tool/ProgressBar";
import { Button, buttonClasses } from "@/components/ui/Button";
import { useFileUpload } from "@/hooks/useFileUpload";
import {
  compressImage,
  resolveOutputMime,
  type CompressFormat,
  type CompressSettings,
} from "@/lib/image/compress";
import { OUTPUT_FORMATS, formatInfo } from "@/lib/image/encode";
import { HEIC_ACCEPT } from "@/lib/image/heic";
import { BROWSER_IMAGE_ACCEPT } from "@/lib/image/load";
import { cn, downloadBlob, fileBaseName, formatBytes } from "@/lib/utils";
import { createZip } from "@/lib/zip";

const ACCEPT = [...BROWSER_IMAGE_ACCEPT, ...HEIC_ACCEPT];
const MAX_FILES = 100;

const DIMENSION_OPTIONS = [
  { value: 0, label: "Keep original" },
  { value: 3840, label: "3840 px (4K)" },
  { value: 2560, label: "2560 px" },
  { value: 1920, label: "1920 px (Full HD)" },
  { value: 1280, label: "1280 px" },
  { value: 1024, label: "1024 px" },
  { value: 800, label: "800 px" },
];

interface ItemResult {
  status: FileStatus;
  blob?: Blob;
  keptOriginal?: boolean;
  missedTarget?: boolean;
  error?: string;
  /** Settings that produced this result; results for other settings are ignored. */
  key: string;
}

const fieldClass =
  "border-border bg-background focus-visible:outline-brand h-10 w-full rounded-lg border px-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-1";

function percentSaved(before: number, after: number) {
  return before > 0 ? Math.round((1 - after / before) * 100) : 0;
}

/** "−67%" in green, or "+122% larger" in amber when a format change made the file bigger. */
function SizeChange({ before, after }: { before: number; after: number }) {
  const saved = percentSaved(before, after);
  return saved >= 0 ? (
    <span className="font-medium text-emerald-700 dark:text-emerald-400">−{saved}%</span>
  ) : (
    <span className="font-medium text-amber-700 dark:text-amber-400">+{-saved}% larger</span>
  );
}

export function CompressImageTool() {
  const upload = useFileUpload({ accept: ACCEPT, multiple: true, maxFiles: MAX_FILES });

  const [mode, setMode] = useState<CompressSettings["mode"]>("quality");
  const [quality, setQuality] = useState(75);
  const [targetValue, setTargetValue] = useState(500);
  const [targetUnit, setTargetUnit] = useState<"KB" | "MB">("KB");
  const [maxDimension, setMaxDimension] = useState(0);
  const [format, setFormat] = useState<CompressFormat>("original");

  const [results, setResults] = useState<Record<string, ItemResult>>({});
  const [compressing, setCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [zipping, setZipping] = useState(false);

  const settings: CompressSettings = {
    mode,
    quality: quality / 100,
    targetKB: targetUnit === "MB" ? targetValue * 1024 : targetValue,
    maxDimension: maxDimension || null,
    format,
  };
  const settingsKey = JSON.stringify(settings);
  const validTarget = mode === "quality" || (Number.isFinite(targetValue) && targetValue > 0);

  const resultFor = (id: string) => (results[id]?.key === settingsKey ? results[id] : undefined);
  const outputName = (file: File, blob: Blob) =>
    `${fileBaseName(file.name)}-compressed.${formatInfo(blob.type)?.ext ?? "jpg"}`;

  const done = upload.files.flatMap(({ id, file }) => {
    const r = resultFor(id);
    return r?.status === "done" && r.blob ? [{ id, file, blob: r.blob }] : [];
  });
  const pending = upload.files.filter(({ id }) => {
    const status = resultFor(id)?.status;
    return status !== "done" && status !== "error";
  });
  const failed = upload.files.filter(({ id }) => resultFor(id)?.status === "error").length;

  async function compressAll() {
    setCompressing(true);
    setProgress(0);
    const key = settingsKey;
    const batch = pending;
    // One at a time: each image is decoded at full size, so parallel work could exhaust memory.
    for (const [index, { id, file }] of batch.entries()) {
      setResults((r) => ({ ...r, [id]: { status: "processing", key } }));
      try {
        const result = await compressImage(file, settings, (p) =>
          setProgress(((index + p / 100) / batch.length) * 100),
        );
        setResults((r) => ({ ...r, [id]: { status: "done", key, ...result } }));
      } catch (err) {
        const error = err instanceof Error ? err.message : "Compression failed.";
        setResults((r) => ({ ...r, [id]: { status: "error", error, key } }));
      }
      setProgress(((index + 1) / batch.length) * 100);
    }
    setCompressing(false);
  }

  async function downloadAll() {
    if (done.length === 1) {
      downloadBlob(done[0].blob, outputName(done[0].file, done[0].blob));
      return;
    }
    setZipping(true);
    try {
      const zip = await createZip(
        done.map(({ file, blob }) => ({ name: outputName(file, blob), data: blob })),
      );
      downloadBlob(zip, "compressed-images.zip");
    } finally {
      setZipping(false);
    }
  }

  function clearAll() {
    upload.clear();
    setResults({});
  }

  if (upload.files.length === 0) {
    return (
      <FileUploader
        accept={ACCEPT}
        multiple
        onFiles={upload.addFiles}
        errors={upload.errors}
        hint={`JPG, PNG, WebP, HEIC and more · up to ${MAX_FILES} images at once`}
      />
    );
  }

  const items: FileListItem[] = upload.files.map(({ id, file }) => {
    const r = resultFor(id);
    let detail: FileListItem["detail"];
    if (r?.blob) {
      detail = r.keptOriginal ? (
        <>· already optimized, kept original</>
      ) : (
        <>
          → {formatBytes(r.blob.size)} <SizeChange before={file.size} after={r.blob.size} />
          {r.missedTarget && (
            <span className="text-amber-700 dark:text-amber-400"> · above target</span>
          )}
        </>
      );
    }
    return {
      id,
      name: file.name,
      size: file.size,
      status: r?.status ?? "pending",
      error: r?.error,
      detail,
    };
  });

  const totalIn = done.reduce((sum, d) => sum + d.file.size, 0);
  const totalOut = done.reduce((sum, d) => sum + d.blob.size, 0);
  const anyMissedTarget = upload.files.some(({ id }) => resultFor(id)?.missedTarget);
  const anyGrew = done.some(({ file, blob }) => blob.size > file.size);
  const hasPngKeptAsPng = upload.files.some(
    ({ file }) => resolveOutputMime(file, format) === "image/png",
  );

  return (
    <div className="space-y-4">
      {/* Settings */}
      <div className="border-border bg-surface grid gap-4 rounded-2xl border p-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2">
          <span id="compress-mode-label" className="text-muted mb-1 block text-sm">
            Compress by
          </span>
          <div
            role="group"
            aria-labelledby="compress-mode-label"
            className="bg-background grid grid-cols-2 rounded-lg p-1"
          >
            {(["quality", "size"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                disabled={compressing}
                onClick={() => setMode(m)}
                className={cn(
                  "rounded-md py-1.5 text-sm font-medium transition-colors",
                  mode === m
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted hover:text-foreground",
                )}
              >
                {m === "quality" ? "Quality" : "Target file size"}
              </button>
            ))}
          </div>
        </div>

        <div className="sm:col-span-2">
          {mode === "quality" ? (
            <label className="block text-sm">
              <span className="text-muted mb-1 flex justify-between">
                Quality{" "}
                <span className="tabular-nums">
                  {quality}% ·{" "}
                  {quality >= 85 ? "best quality" : quality >= 65 ? "balanced" : "smallest files"}
                </span>
              </span>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                disabled={compressing}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="accent-brand h-10 w-full"
              />
            </label>
          ) : (
            <div className="text-sm">
              <label htmlFor="target-size" className="text-muted mb-1 block">
                Maximum size per image
              </label>
              <div className="flex gap-2">
                <input
                  id="target-size"
                  type="number"
                  inputMode="decimal"
                  min={1}
                  step="any"
                  value={targetValue || ""}
                  disabled={compressing}
                  onChange={(e) => setTargetValue(Number(e.target.value))}
                  className={cn(fieldClass, "tabular-nums")}
                />
                <select
                  aria-label="Unit"
                  value={targetUnit}
                  disabled={compressing}
                  onChange={(e) => setTargetUnit(e.target.value as "KB" | "MB")}
                  className={cn(fieldClass, "w-24")}
                >
                  <option>KB</option>
                  <option>MB</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <label className="text-sm sm:col-span-1 lg:col-span-2">
          <span className="text-muted mb-1 block">Maximum width or height</span>
          <select
            value={maxDimension}
            disabled={compressing}
            onChange={(e) => setMaxDimension(Number(e.target.value))}
            className={fieldClass}
          >
            {DIMENSION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm sm:col-span-1 lg:col-span-2">
          <span className="text-muted mb-1 block">Output format</span>
          <select
            value={format}
            disabled={compressing}
            onChange={(e) => setFormat(e.target.value as CompressFormat)}
            className={fieldClass}
          >
            <option value="original">Same as original</option>
            {OUTPUT_FORMATS.map((f) => (
              <option key={f.mime} value={f.mime}>
                {f.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {hasPngKeptAsPng && (
        <p className="text-muted flex items-start gap-2 text-sm">
          <Info className="text-brand mt-0.5 size-4 shrink-0" aria-hidden />
          PNG is a lossless format, so PNG photos shrink only a little. For much smaller files, set
          the output format to JPG or WebP (keep PNG for logos and images that need transparency).
        </p>
      )}

      {upload.errors.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm text-red-600 dark:text-red-400">
          {upload.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <FileList
        items={items}
        disabled={compressing}
        onRemove={upload.removeFile}
        renderActions={(item) => {
          const r = resultFor(item.id);
          const file = upload.files.find((f) => f.id === item.id)?.file;
          if (!r?.blob || !file) return null;
          const name = outputName(file, r.blob);
          return (
            <button
              type="button"
              onClick={() => downloadBlob(r.blob!, name)}
              className="text-brand hover:bg-brand-soft focus-visible:outline-brand inline-flex size-8 shrink-0 items-center justify-center rounded-lg focus-visible:outline-2"
            >
              <Download className="size-4" aria-hidden />
              <span className="sr-only">Download {name}</span>
            </button>
          );
        }}
      />

      {compressing && <ProgressBar value={progress} label="Compressing" />}

      {/* Summary + actions */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="mr-auto text-sm" aria-live="polite">
          <p className="text-muted">
            {done.length} of {upload.files.length} compressed
            {failed > 0 && (
              <span className="text-red-600 dark:text-red-400"> · {failed} failed</span>
            )}
          </p>
          {done.length > 0 && (
            <p className="font-medium">
              {formatBytes(totalIn)} → {formatBytes(totalOut)} (
              <SizeChange before={totalIn} after={totalOut} />)
            </p>
          )}
          {anyMissedTarget && (
            <p className="text-xs text-amber-700 dark:text-amber-400">
              Some images couldn&apos;t reach the target size. Try a smaller maximum width or
              height.
            </p>
          )}
          {anyGrew && (
            <p className="text-muted text-xs">
              Some images got larger because their new format is less efficient — HEIC photos, for
              example, are about twice as efficient as JPG. WebP usually gives the smallest files.
            </p>
          )}
        </div>
        <label
          className={buttonClasses({
            variant: "ghost",
            className: cn("cursor-pointer", compressing && "pointer-events-none opacity-50"),
          })}
        >
          <ImagePlus className="size-4" aria-hidden />
          Add images
          <input
            type="file"
            multiple
            accept={ACCEPT.join(",")}
            className="sr-only"
            disabled={compressing}
            onChange={(e) => {
              upload.addFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>
        <Button variant="ghost" onClick={clearAll} disabled={compressing}>
          <Trash2 className="size-4" aria-hidden />
          Clear all
        </Button>
        {pending.length > 0 && (
          <Button size="lg" onClick={compressAll} disabled={compressing || !validTarget}>
            {compressing && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
            {compressing
              ? "Compressing…"
              : `Compress ${pending.length} ${pending.length === 1 ? "image" : "images"}`}
          </Button>
        )}
        {done.length > 0 && !compressing && (
          <Button
            size="lg"
            variant={pending.length > 0 ? "secondary" : "primary"}
            onClick={downloadAll}
            disabled={zipping}
          >
            {zipping ? (
              <LoaderCircle className="size-5 animate-spin" aria-hidden />
            ) : (
              <Download className="size-5" aria-hidden />
            )}
            {done.length === 1 ? "Download" : `Download all (${done.length}) as ZIP`}
          </Button>
        )}
      </div>
    </div>
  );
}
