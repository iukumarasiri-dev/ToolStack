import type { LucideIcon } from "lucide-react";

export type ToolCategoryId = "pdf" | "docx" | "image";

/** "coming-soon" tools show on the landing page but have no page, nav link or sitemap entry. */
export type ToolStatus = "live" | "coming-soon";

export interface ToolCategory {
  id: ToolCategoryId;
  name: string;
  shortName: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes for the category's icon chip. */
  accent: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Tool {
  id: string;
  category: ToolCategoryId;
  /** URL segment under the category, e.g. "merge" → /pdf/merge */
  slug: string;
  name: string;
  /** One-line summary for cards and the page header. */
  tagline: string;
  /** SEO <title>, without the site-name suffix. */
  title: string;
  /** SEO meta description, ~150–160 characters. */
  description: string;
  icon: LucideIcon;
  status: ToolStatus;
  /** Numbered steps for the "How to use" section. */
  howTo?: string[];
  faq?: FaqItem[];
  /** IDs of related tools shown at the bottom of the page. */
  related?: string[];
}
