import { categoryHref, getCategory, getToolsByCategory } from "@/config/tools";
import { cn } from "@/lib/utils";
import type { ToolCategoryId } from "@/types";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { ToolCard } from "@/components/shared/ToolCard";
import { Container } from "@/components/ui/Container";

export function CategoryPage({ categoryId }: { categoryId: ToolCategoryId }) {
  const category = getCategory(categoryId);
  const categoryTools = getToolsByCategory(categoryId);
  const Icon = category.icon;

  return (
    <Container className="py-8 sm:py-12">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: category.name, href: categoryHref(category) },
        ]}
      />
      <header className="mt-8 flex flex-col items-start gap-4">
        <span
          className={cn(
            "inline-flex size-14 items-center justify-center rounded-2xl",
            category.accent,
          )}
        >
          <Icon className="size-7" aria-hidden />
        </span>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Free {category.name}</h1>
        <p className="text-muted max-w-2xl text-lg">{category.description}</p>
        <PrivacyBadge />
      </header>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categoryTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </Container>
  );
}
