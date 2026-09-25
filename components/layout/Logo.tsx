import { Layers } from "lucide-react";
import { siteConfig } from "@/config/site";

export function Logo() {
  return (
    <span className="flex items-center gap-2 text-lg font-semibold tracking-tight">
      <span className="bg-brand text-brand-foreground inline-flex size-8 items-center justify-center rounded-lg">
        <Layers className="size-5" aria-hidden />
      </span>
      {siteConfig.name}
    </span>
  );
}
