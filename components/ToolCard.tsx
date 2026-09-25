import Link from "next/link";
import { getCategory, toolHref } from "@/config/tools";
import { cn } from "@/lib/utils";
import type { Tool } from "@/types";

export function ToolCard({ tool }: { tool: Tool }) {
  const category = getCategory(tool.category);
  const Icon = tool.icon;
  const live = tool.status === "live";

  const content = (
    <>
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-lg",
          category.accent,
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{tool.name}</h3>
          {!live && (
            <span className="border-border text-muted rounded-full border px-2 py-0.5 text-[11px] font-medium">
              Coming soon
            </span>
          )}
        </div>
        <p className="text-muted mt-1 text-sm">{tool.tagline}</p>
      </div>
    </>
  );

  const base = "border-border bg-surface flex gap-4 rounded-xl border p-4";

  if (!live) {
    return <div className={cn(base, "opacity-60")}>{content}</div>;
  }

  return (
    <Link
      href={toolHref(tool)}
      className={cn(
        base,
        "hover:border-brand transition-all hover:-translate-y-0.5 hover:shadow-md",
        "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2",
      )}
    >
      {content}
    </Link>
  );
}
