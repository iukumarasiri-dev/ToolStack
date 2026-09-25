"use client";

import { useRef, useState, type DragEvent } from "react";
import { CircleAlert, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onFiles: (files: File[]) => void;
  /** Same format as <input accept>: [".pdf", "application/pdf", "image/*"] */
  accept?: string[];
  multiple?: boolean;
  /** Short hint under the main label, e.g. "PDF files up to 100 MB". */
  hint?: string;
  errors?: string[];
  disabled?: boolean;
  className?: string;
}

export function FileUploader({
  onFiles,
  accept = [],
  multiple = false,
  hint,
  errors = [],
  disabled = false,
  className,
}: FileUploaderProps) {
  const [dragging, setDragging] = useState(false);
  // Counts nested dragenter/dragleave events so hovering child elements doesn't flicker.
  const dragDepth = useRef(0);

  const handleDragEnter = (e: DragEvent) => {
    e.preventDefault();
    if (disabled) return;
    dragDepth.current++;
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current--;
    if (dragDepth.current <= 0) setDragging(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    if (disabled) return;
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length) onFiles(multiple ? dropped : dropped.slice(0, 1));
  };

  return (
    <div className={className}>
      <label
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors",
          "focus-within:outline-brand focus-within:outline-2 focus-within:outline-offset-2",
          dragging ? "border-brand bg-brand-soft" : "border-border bg-surface hover:border-brand",
          disabled && "pointer-events-none opacity-50",
        )}
      >
        <span className="bg-brand-soft text-brand inline-flex size-12 items-center justify-center rounded-full">
          <Upload className="size-6" aria-hidden />
        </span>
        <span className="text-lg font-semibold">
          {dragging ? "Drop to add" : `Choose ${multiple ? "files" : "a file"} or drag them here`}
        </span>
        {hint && <span className="text-muted text-sm">{hint}</span>}
        <input
          type="file"
          className="sr-only"
          accept={accept.join(",")}
          multiple={multiple}
          disabled={disabled}
          onChange={(e) => {
            const selected = Array.from(e.target.files ?? []);
            if (selected.length) onFiles(selected);
            // Reset so choosing the same file again still fires onChange.
            e.target.value = "";
          }}
        />
      </label>

      {errors.length > 0 && (
        <ul role="alert" className="mt-3 space-y-1">
          {errors.map((error) => (
            <li
              key={error}
              className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
              {error}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
