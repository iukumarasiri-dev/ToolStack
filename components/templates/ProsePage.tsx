import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

/** Layout for text-heavy pages (about, legal). */
export function ProsePage({
  title,
  lastUpdated,
  children,
}: {
  title: string;
  lastUpdated?: string;
  children: ReactNode;
}) {
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <article className="prose prose-slate dark:prose-invert prose-a:text-brand max-w-none">
        <h1>{title}</h1>
        {lastUpdated && <p className="text-muted text-sm">Last updated: {lastUpdated}</p>}
        {children}
      </article>
    </Container>
  );
}
