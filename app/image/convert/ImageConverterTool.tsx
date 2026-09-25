"use client";

import { useState } from "react";
import { Download, ImagePlus, LoaderCircle, Trash2 } from "lucide-react";
import { FileList, type FileListItem, type FileStatus } from "@/components/tool/FileList";
import { FileUploader } from "@/components/tool/FileUploader";
import { Button, buttonClasses } from "@/components/ui/Button";
import { useFileUpload } from "@/hooks/useFileUpload";
import { convertImage } from "@/lib/image/convert";
import { OUTPUT_FORMATS, formatInfo, type OutputMime } from "@/lib/image/encode";
import { HEIC_ACCEPT } from "@/lib/image/heic";
import { BROWSER_IMAGE_ACCEPT } from "@/lib/image/load";
import { cn, downloadBlob, fileBaseName, formatBytes } from "@/lib/utils";
import { createZip } from "@/lib/zip";

const ACCEPT = [...BROWSER_IMAGE_ACCEPT, ...HEIC_ACCEPT];
const MAX_FILES = 100;

interface ItemResult {
  status: FileStatus;
  blob?: Blob;
  error?: string;
  /** Settings that produced this result; results for other settings are ignored. */
  key: string;
}

export function ImageConverterTool() {
  const upload = useFileUpload({ accept: ACCEPT, multiple: true, maxFiles: MAX_FILES });
  const [mime, setMime] = useState<OutputMime>("image/jpeg");
  const [quality, setQuality] = useState(90);
  const [results, setResults] = useState<Record<string, ItemResult>>({});
  const [converting, setConverting] = useState(false);
  const [zipping, setZipping] = useState(false);

  const lossy = formatInfo(mime)?.lossy ?? false;
  const settingsKey = `${mime}|${lossy ? quality : ""}`;
  const format = formatInfo(mime)!;

  const resultFor = (id: string) => (results[id]?.key === settingsKey ? results[id] : undefined);
  const outputName = (file: File, blob: Blob) =>
    `${fileBaseName(file.name)}.${formatInfo(blob.type)?.ext ?? format.ext}`;

  const done = upload.files.flatMap(({ id, file }) => {
    const r = resultFor(id);
    return r?.status === "done" && r.blob ? [{ id, file, blob: r.blob }] : [];
  });
  const pending = upload.files.filter(({ id }) => {
    const status = resultFor(id)?.status;
    return status !== "done" && status !== "error";
  });
  const failed = upload.files.filter(({ id }) => resultFor(id)?.status === "error").length;

  async function convertAll() {
    setConverting(true);
    const key = settingsKey;
    // One at a time keeps memory use low with large photos.
    for (const { id, file } of pending) {
      setResults((r) => ({ ...r, [id]: { status: "processing", key } }));
      try {
        const blob = await convertImage(file, mime, quality / 100);
        setResults((r) => ({ ...r, [id]: { status: "done", blob, key } }));
      } catch (err) {
        const error = err instanceof Error ? err.message : "Conversion failed.";
        setResults((r) => ({ ...r, [id]: { status: "error", error, key } }));
      }
    }
    setConverting(false);
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
      downloadBlob(zip, `converted-images-${format.ext}.zip`);
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
        hint={`JPG, PNG, WebP, HEIC, GIF, BMP or AVIF · up to ${MAX_FILES} images at once`}
      />
    );
  }

  const items: FileListItem[] = upload.files.map(({ id, file }) => {
    const r = resultFor(id);
    return {
      id,
      name: file.name,
      size: file.size,
      status: r?.status ?? "pending",
      error: r?.error,
      detail: r?.blob && (
        <>
          → {formatBytes(r.blob.size)} {formatInfo(r.blob.type)?.label}
        </>
      ),
    };
  });

  const totalIn = done.reduce((sum, d) => sum + d.file.size, 0);
  const totalOut = done.reduce((sum, d) => sum + d.blob.size, 0);
  const fellBack = done.some((d) => d.blob.type !== mime);

  return (
    <div className="space-y-4">
      {/* Settings */}
      <div className="border-border bg-surface flex flex-wrap items-end gap-x-6 gap-y-4 rounded-2xl border p-4">
        <div>
          <span id="convert-to-label" className="text-muted mb-1 block text-sm">
            Convert to
          </span>
          <div
            role="group"
            aria-labelledby="convert-to-label"
            className="bg-background inline-flex rounded-lg p-1"
          >
            {OUTPUT_FORMATS.map((f) => (
              <button
                key={f.mime}
                type="button"
                aria-pressed={mime === f.mime}
                disabled={converting}
                onClick={() => setMime(f.mime)}
                className={cn(
                  "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                  mime === f.mime
                    ? "bg-surface text-foreground shadow-sm"
                    : "text-muted hover:text-foreground",
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
        {lossy && (
          <label className="min-w-40 flex-1 text-sm sm:max-w-xs">
            <span className="text-muted mb-1 flex justify-between">
              Quality <span className="tabular-nums">{quality}%</span>
            </span>
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              disabled={converting}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="accent-brand h-9 w-full"
            />
          </label>
        )}
        <label
          className={buttonClasses({
            variant: "secondary",
            className: cn("ml-auto cursor-pointer", converting && "pointer-events-none opacity-50"),
          })}
        >
          <ImagePlus className="size-4" aria-hidden />
          Add images
          <input
            type="file"
            multiple
            accept={ACCEPT.join(",")}
            className="sr-only"
            disabled={converting}
            onChange={(e) => {
              upload.addFiles(Array.from(e.target.files ?? []));
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {upload.errors.length > 0 && (
        <ul role="alert" className="space-y-1 text-sm text-red-600 dark:text-red-400">
          {upload.errors.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}

      <FileList
        items={items}
        disabled={converting}
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

      {/* Summary + actions */}
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-muted mr-auto text-sm" aria-live="polite">
          {done.length} of {upload.files.length} converted
          {done.length > 0 && (
            <>
              {" "}
              · {formatBytes(totalIn)} → {formatBytes(totalOut)}
            </>
          )}
          {failed > 0 && <span className="text-red-600 dark:text-red-400"> · {failed} failed</span>}
          {fellBack && (
            <span className="block text-xs">
              Your browser can&apos;t save {format.label} files, so PNG was used instead.
            </span>
          )}
        </p>
        <Button variant="ghost" onClick={clearAll} disabled={converting}>
          <Trash2 className="size-4" aria-hidden />
          Clear all
        </Button>
        {pending.length > 0 && (
          <Button size="lg" onClick={convertAll} disabled={converting}>
            {converting && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
            {converting
              ? "Converting…"
              : `Convert ${pending.length} ${pending.length === 1 ? "image" : "images"} to ${format.label}`}
          </Button>
        )}
        {done.length > 0 && !converting && (
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
