import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

type AdFormat = "horizontal" | "rectangle";

// Fixed minimum heights reserve space before the ad loads, preventing layout shift (CLS).
const reservedHeight: Record<AdFormat, string> = {
  horizontal: "min-h-[100px]",
  rectangle: "min-h-[280px]",
};

export function AdSlot({
  format = "horizontal",
  className,
}: {
  format?: AdFormat;
  className?: string;
}) {
  if (!siteConfig.adsenseClient) {
    // No AdSense yet: show a placeholder in development, nothing in production.
    if (process.env.NODE_ENV === "production") return null;
    return (
      <div
        aria-hidden
        className={cn(
          "border-border text-muted flex items-center justify-center rounded-lg border border-dashed text-xs",
          reservedHeight[format],
          className,
        )}
      >
        Ad slot · {format}
      </div>
    );
  }

  // Phase 4: render the <ins class="adsbygoogle"> unit inside this reserved box.
  return <div aria-label="Advertisement" className={cn(reservedHeight[format], className)} />;
}
