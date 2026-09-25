import { cn } from "@/lib/utils";

interface ProgressBarProps {
  /** 0–100. Omit for an indeterminate (unknown duration) bar. */
  value?: number;
  label?: string;
  className?: string;
}

export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const indeterminate = value === undefined;
  const clamped = indeterminate ? 0 : Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <div className="mb-2 flex justify-between text-sm">
          <span>{label}</span>
          {!indeterminate && (
            <span className="text-muted tabular-nums">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label ?? "Progress"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminate ? undefined : Math.round(clamped)}
        className="bg-brand-soft h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className={cn(
            "bg-brand h-full rounded-full",
            indeterminate ? "animate-indeterminate w-2/5" : "transition-[width] duration-300",
          )}
          style={indeterminate ? undefined : { width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
