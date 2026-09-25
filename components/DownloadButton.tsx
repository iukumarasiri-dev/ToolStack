"use client";

import { Download } from "lucide-react";
import { downloadBlob, formatBytes } from "@/lib/utils";
import { Button } from "./ui/Button";

interface DownloadButtonProps {
  blob: Blob | null;
  filename: string;
  label?: string;
  className?: string;
}

export function DownloadButton({
  blob,
  filename,
  label = "Download",
  className,
}: DownloadButtonProps) {
  return (
    <Button
      size="lg"
      className={className}
      disabled={!blob}
      onClick={() => blob && downloadBlob(blob, filename)}
    >
      <Download className="size-5" aria-hidden />
      {label}
      {blob && <span className="opacity-75">({formatBytes(blob.size)})</span>}
    </Button>
  );
}
