# ToolStack

Free, browser-based document and image toolkit — merge, convert, compress, and edit PDFs, Word documents, and images, all processed client-side with no sign-up and no uploads to a server.

## Overview

ToolStack brings together everyday document and image utilities in one place. Every tool runs entirely in the browser, meaning files never leave the user's device — no server-side processing, no storage, and no uploads. This makes the app fast, private by design, and free to run at scale.

The project is built with Next.js and Tailwind CSS as a statically exported, SEO-friendly site, with each tool living on its own dedicated page for better search discoverability. Monetization is handled through Google AdSense.

Longer-term, the project is designed to expand beyond core document tools into AI-powered features (summarization, document Q&A) and potentially other utility categories, without needing a rebrand.

## Features

### PDF Tools

- Merge PDFs
- Split PDFs
- Rotate / reorder / delete pages (PDF editor)
- Compress PDF (reduce file size) — see [Implementation Notes](#implementation-notes)
- PDF word counter
- PDF → Word / Excel / PowerPoint — text extraction only; see [Implementation Notes](#implementation-notes)

### Word/DOCX Tools

- DOCX to PDF / PDF to DOCX
- Word counter / character counter with readability score
- Find & replace across a document (doc editor)

### Image Tools

- Image format converter (PNG / JPG / WebP / HEIC)
- Image compressor / resizer
- Image to PDF batch converter
- Background remover — pending license decision; see [Implementation Notes](#implementation-notes)

### Planned (Future)

- AI-powered tools: document summarizer, ask-your-document Q&A, auto-translate (requires a backend + API costs — funded by ad revenue)
- Additional utility categories beyond documents

## Tech Stack

- **Framework:** Next.js (App Router) with static export (`output: 'export'`)
- **Styling:** Tailwind CSS
- **Processing:** 100% client-side, no backend required
  - `pdf-lib` — merge, split, rotate, reorder, delete pages
  - `pdf.js` — PDF rendering/preview and text extraction
  - `mammoth.js` — DOCX → HTML/text
  - `docx` — DOCX generation
  - `jsPDF` — HTML/text → PDF
  - `browser-image-compression` — image compression
  - `heic2any` — HEIC decoding (browsers can't read HEIC natively)
  - Canvas API — image conversion/resizing
  - Web Workers — heavy processing off the main thread
- **Hosting:** Cloudflare Pages (free tier, commercial use allowed)
- **Domain:** Custom domain (required by AdSense — `*.pages.dev` / `*.vercel.app` subdomains are not accepted)
- **Database:** None required for core tools (fully stateless)
- **Analytics:** Google Search Console + Cloudflare Web Analytics (cookieless)

> **Why not Vercel?** Vercel's free Hobby plan is restricted to non-commercial use, and an ad-monetized site counts as commercial. Since the app is fully static, Cloudflare Pages hosts it for free with no such restriction. Vercel Pro (~$20/mo) is an option if needed later.

## Implementation Notes

Known constraints of doing everything in the browser:

| Tool                     | Constraint                                                                                                                                | Approach                                                                                                                      |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| PDF → Word / Excel / PPT | No reliable client-side library preserves layout                                                                                          | Ship as "text extraction" (pdf.js); revisit with a backend later                                                              |
| Compress PDF             | `pdf-lib` cannot re-encode embedded images                                                                                                | Rasterize pages via pdf.js + canvas at lower quality, or evaluate a WASM build of qpdf (check licenses — Ghostscript is AGPL) |
| HEIC conversion          | Not natively decodable in most browsers                                                                                                   | `heic2any` (WASM)                                                                                                             |
| Background remover       | `@imgly/background-removal` is **AGPL-3.0** (requires open-sourcing the app or buying a commercial license); model download is tens of MB | Decide on license before building; lazy-load the model only on user action                                                    |

**Performance rules:**

- Load heavy libraries (pdf.js, WASM, ONNX models) with dynamic `import()` only on the page that needs them.
- Run processing in Web Workers so large files don't freeze the UI.
- Reserve fixed-size containers for ad slots to avoid layout shift (CLS).

## Project Structure

```
toolstack/
├── app/
│   ├── layout.tsx            # root layout, default metadata, navbar/footer
│   ├── page.tsx              # landing page
│   ├── globals.css           # Tailwind v4 theme tokens (light/dark)
│   ├── icon.svg              # favicon
│   ├── not-found.tsx
│   ├── pdf/
│   │   ├── page.tsx          # category page
│   │   └── <slug>/page.tsx   # one per live tool, e.g. merge/page.tsx
│   ├── docx/
│   │   ├── page.tsx
│   │   └── <slug>/page.tsx
│   ├── image/
│   │   ├── page.tsx
│   │   └── <slug>/page.tsx
│   ├── about/page.tsx
│   ├── contact/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms/page.tsx
│   ├── sitemap.ts            # generated from the registry (live tools only)
│   └── robots.ts
├── components/
│   ├── ui/                   # Button, Container
│   ├── ToolPageLayout.tsx    # shared tool page: header, tool, ad, how-to, FAQ, related tools
│   ├── CategoryPage.tsx
│   ├── FileUploader.tsx      # drag & drop / browse
│   ├── ProgressBar.tsx
│   ├── DownloadButton.tsx
│   ├── ToolCard.tsx
│   ├── AdSlot.tsx            # fixed-size ad container (placeholder in dev)
│   ├── Breadcrumbs.tsx       # + BreadcrumbList structured data
│   ├── Faq.tsx
│   ├── JsonLd.tsx
│   ├── PrivacyBadge.tsx
│   ├── ProsePage.tsx         # layout for about/legal pages
│   ├── Logo.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
├── config/
│   ├── site.ts               # site name, URL, contact email, AdSense ID
│   └── tools.ts              # tool registry — single source of truth
├── lib/
│   ├── seo.ts                # metadata + JSON-LD helpers
│   └── utils.ts              # cn, formatBytes, matchesAccept, downloadBlob, …
├── hooks/
│   └── useFileUpload.ts      # file list state + validation
├── public/
│   └── og-images/default.png
├── types/
│   └── index.ts
├── .env.example
├── next.config.ts            # output: "export"
└── package.json
```

Added in later phases: `lib/pdf/`, `lib/docx/`, `lib/image/` (processing logic), `workers/` (Web Workers), `components/ConsentBanner.tsx` and `public/ads.txt` (Phase 4).

### Tool Registry

`config/tools.ts` defines every tool once — slug, route, title, meta description, category, FAQ entries, and related tools. The navbar, landing page cards, sitemap, page metadata, and "related tools" links are all generated from it, so adding a tool means one registry entry plus one page.

Tools marked `coming-soon` appear greyed out on the landing page but have no page or sitemap entry. To ship a tool:

1. Set its `status` to `"live"` and fill in `howTo`, `faq` and `related`.
2. Build the tool UI as a client component, using `useFileUpload` + `FileUploader`.
3. Add the page:

```tsx
// app/pdf/merge/page.tsx
import { ToolPageLayout } from "@/components/ToolPageLayout";
import { toolMetadata } from "@/lib/seo";
import { MergePdfTool } from "./MergePdfTool";

export const metadata = toolMetadata("pdf-merge");

export default function Page() {
  return (
    <ToolPageLayout toolId="pdf-merge">
      <MergePdfTool />
    </ToolPageLayout>
  );
}
```

## Why Client-Side Processing?

- **Privacy:** Files are never uploaded to a server — a real differentiator against competitors like iLovePDF and Smallpdf.
- **Cost:** No backend, no database, no storage costs — the app runs entirely on a free static host.
- **Speed:** No upload/download round trip; processing happens instantly in-browser.

## AdSense Readiness Checklist

Tool sites are commonly rejected for "low-value content". Before applying:

- [ ] Custom domain connected and indexed in Google Search Console
- [ ] Every tool page has 300–600 words of unique content: what it does, how to use it, FAQ, privacy note
- [ ] Unique `<title>`, meta description, `<h1>`, and OG image per page
- [ ] About, Contact, Privacy Policy (incl. Google advertising cookies disclosure), and Terms pages
- [ ] Google-certified consent banner (CMP) for EEA/UK/Switzerland visitors
- [ ] `ads.txt` in `/public`
- [ ] Sitemap submitted; internal links between related tools
- [ ] Good Core Web Vitals; ad slots reserve space (no CLS)

## Roadmap

Launch small and apply to AdSense early — indexing and approval take weeks, so build more tools while under review.

- [ ] **Phase 1 — Foundation:** domain, Cloudflare Pages deploy, static export, shared components, tool registry, legal pages, landing page
- [ ] **Phase 2 — MVP tools:** PDF merge / split / organize, image → PDF, image converter, image compressor/resizer, word counter
- [ ] **Phase 3 — Launch & apply:** tool page content + FAQs, Search Console, performance pass, consent banner, **AdSense application**
- [ ] **Phase 4 — Expand (during review):** DOCX → PDF, find & replace, PDF compress, PDF text extraction
- [ ] **Phase 5 — Data-driven growth:** prioritize new tools by Search Console queries; background remover once licensing is resolved
- [ ] **Phase 6 — AI tools:** summarizer, document Q&A, translate (introduces a backend)

## Development Workflow

- **Branching:** `main` is always deployable. One branch per tool (`feat/pdf-merge`), merged via PR. Cloudflare Pages builds a preview deployment for every PR — test there, then merge to deploy.
- **Commits:** small and descriptive (e.g. `feat(pdf): add merge tool`, `fix(image): handle HEIC orientation`).

### Definition of Done (per tool)

- [ ] Works in Chrome, Firefox, Safari, and on mobile
- [ ] Handles large files (~100 MB) without freezing the UI (Web Worker)
- [ ] Heavy libraries lazy-loaded only on that page
- [ ] Clear error messages for invalid/corrupt files
- [ ] Page content, FAQ, metadata, and OG image written
- [ ] Added to the tool registry (nav, sitemap, related tools update automatically)

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-username>/toolstack.git
cd toolstack

# Install dependencies
npm install

# Configure environment (site URL, AdSense ID)
cp .env.example .env.local

# Run the development server
npm run dev

# Build the static site (output in /out)
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

Other scripts: `npm run lint`, `npm run typecheck`, `npm run format`.

**Deploying to Cloudflare Pages:** build command `npm run build`, output directory `out`, and set `NEXT_PUBLIC_SITE_URL` to your domain in the project's environment variables.

## License

TBD — note that choosing AGPL dependencies (e.g. `@imgly/background-removal`) would require the project to be released under AGPL.
