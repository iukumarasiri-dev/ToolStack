import Link from "next/link";
import { siteConfig } from "@/config/site";
import { categories, categoryHref, getToolsByCategory, toolHref } from "@/config/tools";
import { Logo } from "./Logo";
import { Container } from "./ui/Container";

const companyLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const linkClass = "text-muted hover:text-foreground text-sm transition-colors";

export function Footer() {
  return (
    <footer className="border-border bg-surface mt-auto border-t">
      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-1">
          <Logo />
          <p className="text-muted mt-3 text-sm">
            Free document and image tools. Files are processed in your browser and never uploaded.
          </p>
        </div>

        {categories.map((category) => {
          const live = getToolsByCategory(category.id).filter((t) => t.status === "live");
          return (
            <div key={category.id}>
              <h2 className="text-sm font-semibold">
                <Link href={categoryHref(category)} className="hover:text-brand">
                  {category.name}
                </Link>
              </h2>
              <ul className="mt-3 space-y-2">
                {live.map((tool) => (
                  <li key={tool.id}>
                    <Link href={toolHref(tool)} className={linkClass}>
                      {tool.name}
                    </Link>
                  </li>
                ))}
                {live.length === 0 && <li className="text-muted text-sm">Coming soon</li>}
              </ul>
            </div>
          );
        })}

        <div>
          <h2 className="text-sm font-semibold">Company</h2>
          <ul className="mt-3 space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
      <div className="border-border border-t">
        <Container className="text-muted py-6 text-center text-xs">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </Container>
      </div>
    </footer>
  );
}
