import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getTool, toolHref } from "@/config/tools";
import type { Tool } from "@/types";

export const defaultOgImage = {
  url: "/og-images/default.png",
  width: 1200,
  height: 630,
  alt: siteConfig.tagline,
};

interface PageMetaInput {
  title: string;
  description: string;
  /** Path relative to the site root, e.g. "/pdf/merge". */
  path: string;
}

export function pageMetadata({ title, description, path }: PageMetaInput): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: siteConfig.name,
      type: "website",
      // Page-level openGraph replaces the layout's, so the image must be repeated here.
      images: [defaultOgImage],
    },
    twitter: { card: "summary_large_image", title, description, images: [defaultOgImage.url] },
  };
}

export function toolMetadata(id: string): Metadata {
  const tool = getTool(id);
  return pageMetadata({ title: tool.title, description: tool.description, path: toolHref(tool) });
}

/** schema.org data for a tool page: the app itself plus its FAQ (eligible for rich results). */
export function toolJsonLd(tool: Tool): Record<string, unknown>[] {
  const data: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: tool.name,
      description: tool.description,
      url: `${siteConfig.url}${toolHref(tool)}`,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any (runs in web browser)",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ];
  if (tool.faq?.length) {
    data.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: tool.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    });
  }
  return data;
}
