import { ShieldCheck } from "lucide-react";

export function PrivacyBadge() {
  return (
    <p className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
      <ShieldCheck className="size-3.5" aria-hidden />
      Your files never leave your device
    </p>
  );
}
