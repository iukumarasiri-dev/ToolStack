"use client";

import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, FileIcon, LoaderCircle, X } from "lucide-react";
import { cn, formatBytes } from "@/lib/utils";

export type FileStatus = "pending" | "processing" | "done" | "error";

export interface FileListItem {
  id: string;
  name: string;
  size: number;
  status?: FileStatus;
  /** Extra info shown under the name, e.g. "→ 1.2 MB". */
  detail?: ReactNode;
  /** Shown instead of `detail` when status is "error". */
  error?: string;
}

interface FileListProps {
  items: FileListItem[];
  onRemove?: (id: string) => void;
  /** Extra controls at the end of each row, e.g. a per-file download button. */
  renderActions?: (item: FileListItem) => ReactNode;
  /** Disables remove buttons, e.g. while processing. */
  disabled?: boolean;
  className?: string;
}

const statusLabel: Record<FileStatus, string> = {
  pending: "Waiting",
  processing: "Processing",
  done: "Done",
  error: "Failed",
};

function StatusIcon({ status }: { status?: FileStatus }) {
  if (status === "processing")
    return <LoaderCircle className="text-brand size-5 animate-spin" aria-hidden />;
  if (status === "done")
    return <CircleCheck className="size-5 text-emerald-600 dark:text-emerald-400" aria-hidden />;
  if (status === "error")
    return <CircleAlert className="size-5 text-red-600 dark:text-red-400" aria-hidden />;
  return <FileIcon className="text-muted size-5" aria-hidden />;
}

export function FileList({ items, onRemove, renderActions, disabled, className }: FileListProps) {
  if (items.length === 0) return null;

  return (
    <ul
      className={cn("border-border bg-surface divide-border divide-y rounded-xl border", className)}
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-3 px-4 py-3">
          <span className="shrink-0">
            <StatusIcon status={item.status} />
            {item.status && <span className="sr-only">{statusLabel[item.status]}: </span>}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium" title={item.name}>
              {item.name}
            </p>
            <p
              className={cn(
                "truncate text-xs",
                item.status === "error" ? "text-red-600 dark:text-red-400" : "text-muted",
              )}
            >
              {item.status === "error" && item.error ? (
                item.error
              ) : (
                <>
                  {formatBytes(item.size)}
                  {item.detail && <> {item.detail}</>}
                </>
              )}
            </p>
          </div>
          {renderActions?.(item)}
          {onRemove && (
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              disabled={disabled}
              className="text-muted hover:bg-brand-soft hover:text-foreground focus-visible:outline-brand inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-40"
            >
              <X className="size-4" aria-hidden />
              <span className="sr-only">Remove {item.name}</span>
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
