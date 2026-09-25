import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${parseFloat((bytes / 1024 ** i).toFixed(decimals))} ${units[i]}`;
}

/** "report.final.pdf" → "report.final" */
export function fileBaseName(filename: string): string {
  const dot = filename.lastIndexOf(".");
  return dot > 0 ? filename.slice(0, dot) : filename;
}

/** replaceExtension("photo.heic", "jpg") → "photo.jpg" */
export function replaceExtension(filename: string, ext: string): string {
  return `${fileBaseName(filename)}.${ext.replace(/^\./, "")}`;
}

/**
 * Checks a file against an `accept` list in the same format as <input accept>:
 * extensions (".pdf"), exact MIME types ("application/pdf") or wildcards ("image/*").
 */
export function matchesAccept(file: File, accept: string[]): boolean {
  if (accept.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept.some((rule) => {
    const r = rule.trim().toLowerCase();
    if (r.startsWith(".")) return name.endsWith(r);
    if (r.endsWith("/*")) return type.startsWith(r.slice(0, -1));
    return type === r;
  });
}

/** Triggers a browser download for an in-memory file. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Revoke after the click has been handled so the download isn't cancelled.
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
