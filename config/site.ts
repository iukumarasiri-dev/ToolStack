export const siteConfig = {
  name: "ToolStack",
  tagline: "Free PDF, Word & image tools that run in your browser",
  description:
    "Merge, split, compress and convert PDFs, Word documents and images for free. Everything runs in your browser — your files are never uploaded.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  // TODO: replace with a real inbox before launch (AdSense reviewers check the contact page).
  contactEmail: "hello@example.com",
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? "",
} as const;
