"use client";

import { useCallback, useState } from "react";
import { formatBytes, matchesAccept } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  file: File;
}

interface UseFileUploadOptions {
  /** Same format as <input accept>: [".pdf", "application/pdf", "image/*"] */
  accept?: string[];
  multiple?: boolean;
  /** Per-file size limit in bytes. */
  maxSize?: number;
  maxFiles?: number;
}

let nextId = 0;

/**
 * File list state for a tool: validation, add/remove/reorder.
 * Pair with <FileUploader onFiles={addFiles} errors={errors} />.
 */
export function useFileUpload({
  accept = [],
  multiple = false,
  maxSize,
  maxFiles = multiple ? Infinity : 1,
}: UseFileUploadOptions = {}) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const addFiles = useCallback(
    (incoming: File[]) => {
      const newErrors: string[] = [];
      const valid: UploadedFile[] = [];

      for (const file of incoming) {
        if (!matchesAccept(file, accept)) {
          newErrors.push(`"${file.name}" isn't a supported file type.`);
        } else if (maxSize !== undefined && file.size > maxSize) {
          newErrors.push(`"${file.name}" is larger than ${formatBytes(maxSize)}.`);
        } else {
          valid.push({ id: `file-${nextId++}`, file });
        }
      }

      // Single-file tools replace the current file instead of appending.
      const base = multiple ? files : [];
      const room = Math.max(0, maxFiles - base.length);
      if (valid.length > room) {
        newErrors.push(`You can add up to ${maxFiles} files. Extra files were skipped.`);
      }
      setFiles([...base, ...valid.slice(0, room)]);
      setErrors(newErrors);
    },
    [files, accept, multiple, maxSize, maxFiles],
  );

  const removeFile = useCallback((id: string) => {
    setFiles((current) => current.filter((f) => f.id !== id));
  }, []);

  const moveFile = useCallback((from: number, to: number) => {
    setFiles((current) => {
      if (to < 0 || to >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setFiles([]);
    setErrors([]);
  }, []);

  return { files, errors, addFiles, removeFile, moveFile, clear };
}
