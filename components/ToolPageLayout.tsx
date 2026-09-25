import type { ReactNode } from "react";
import { categoryHref, getCategory, getRelatedTools, getTool, toolHref } from "@/config/tools";
import { toolJsonLd } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { AdSlot } from "./AdSlot";
import { Breadcrumbs } from "./Breadcrumbs";
import { Faq } from "./Faq";
import { JsonLd } from "./JsonLd";
import { PrivacyBadge } from "./PrivacyBadge";
import { ToolCard } from "./ToolCard";
import { Container } from "./ui/Container";

interface ToolPageLayoutProps {
  toolId: string;
  /** The interactive tool (a client component). */
  children: ReactNode;
  /** Long-form explanatory content rendered below the tool (important for SEO/AdSense). */
  content?: ReactNode;
}

/**
 * Standard page for every tool: header, the tool itself, an ad slot,
 * how-to steps, article content, FAQ and related tools.
 *
 * Usage in app/<category>/<slug>/page.tsx:
 *   export const metadata = toolMetadata("pdf-merge");
 *   export default function Page() {
 *     return <ToolPageLayout toolId="pdf-merge"><MergePdfTool /></ToolPageLayout>;
 *   }
 */
export function ToolPageLayout({ toolId, children, content }: ToolPageLayoutProps) {
  const tool = getTool(toolId);
  const category = getCategory(tool.category);
  const related = getRelatedTools(tool);
  const Icon = tool.icon;

  return (
    <Container className="py-8 sm:py-12">
      <JsonLd data={toolJsonLd(tool)} />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.name, href: categoryHref(category) },
          { label: tool.name, href: toolHref(tool) },
        ]}
      />

      <header className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
        <span
          className={cn(
            "inline-flex size-14 items-center justify-center rounded-2xl",
            category.accent,
          )}
        >
          <Icon className="size-7" aria-hidden />
        </span>
        <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{tool.name}</h1>
        <p className="text-muted mt-3 text-lg">{tool.tagline}</p>
        <div className="mt-4">
          <PrivacyBadge />
        </div>
      </header>

      <section aria-label={tool.name} className="mx-auto mt-10 max-w-4xl">
        {children}
      </section>

      <AdSlot className="mx-auto mt-12 max-w-4xl" />

      <div className="mx-auto mt-12 max-w-3xl space-y-14">
        {tool.howTo && tool.howTo.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">How to use {tool.name}</h2>
            <ol className="mt-6 space-y-4">
              {tool.howTo.map((step, i) => (
                <li key={step} className="flex gap-4">
                  <span className="bg-brand-soft text-brand inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold">
                    {i + 1}
                  </span>
                  <p className="pt-1">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {content && (
          <article className="prose prose-slate dark:prose-invert max-w-none">{content}</article>
        )}

        {tool.faq && tool.faq.length > 0 && <Faq items={tool.faq} />}

        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold tracking-tight">Related tools</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((t) => (
                <ToolCard key={t.id} tool={t} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Container>
  );
}
