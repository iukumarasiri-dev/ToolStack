import Link from "next/link";
import { categories, categoryHref } from "@/config/tools";
import { Logo } from "@/components/layout/Logo";
import { Container } from "@/components/ui/Container";

export function Navbar() {
  return (
    <header className="border-border bg-surface/80 sticky top-0 z-40 border-b backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link href="/" aria-label="ToolStack home">
          <Logo />
        </Link>
        <nav aria-label="Tool categories">
          <ul className="flex items-center gap-1 sm:gap-2">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  href={categoryHref(category)}
                  className="text-muted hover:bg-brand-soft hover:text-foreground rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors"
                >
                  {category.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}
