import { ChevronRight } from "lucide-react";
import type { FaqItem } from "@/types";

export function Faq({
  items,
  title = "Frequently asked questions",
}: {
  items: FaqItem[];
  title?: string;
}) {
  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="border-border bg-surface divide-border mt-6 divide-y rounded-xl border">
        {items.map((item) => (
          <details key={item.question} className="group px-5 py-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
              {item.question}
              <ChevronRight
                className="text-muted size-4 shrink-0 transition-transform group-open:rotate-90"
                aria-hidden
              />
            </summary>
            <p className="text-muted mt-3 text-sm leading-relaxed">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
