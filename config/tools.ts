import {
  Combine,
  Eraser,
  FileImage,
  FileOutput,
  FileSpreadsheet,
  FileText,
  FileType,
  Hash,
  Image as ImageIcon,
  LayoutGrid,
  Minimize2,
  Presentation,
  RefreshCw,
  Replace,
  Scaling,
  Scissors,
} from "lucide-react";
import type { Tool, ToolCategory, ToolCategoryId } from "@/types";

/**
 * Tool registry — the single source of truth for every tool.
 * Nav, landing page, category pages, sitemap, metadata and related-tool links
 * are all generated from this file.
 *
 * To ship a tool: flip its status to "live", fill in howTo/faq/related,
 * and add app/<category>/<slug>/page.tsx.
 */

export const categories: ToolCategory[] = [
  {
    id: "pdf",
    name: "PDF Tools",
    shortName: "PDF",
    description: "Merge, split, compress, reorder and convert PDF files.",
    icon: FileText,
    accent: "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400",
  },
  {
    id: "docx",
    name: "Word Tools",
    shortName: "Word",
    description: "Convert, count and edit Word (.docx) documents.",
    icon: FileType,
    accent: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
  },
  {
    id: "image",
    name: "Image Tools",
    shortName: "Image",
    description: "Convert, compress, resize and turn images into PDFs.",
    icon: ImageIcon,
    accent: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
  },
];

export const tools: Tool[] = [
  // ── PDF ────────────────────────────────────────────────────────────────
  {
    id: "pdf-merge",
    category: "pdf",
    slug: "merge",
    name: "Merge PDF",
    tagline: "Combine multiple PDFs into one file, in any order.",
    title: "Merge PDF Files Online Free — No Upload",
    description:
      "Combine multiple PDF files into one document for free. Drag to reorder, then merge instantly in your browser — your files are never uploaded.",
    icon: Combine,
    status: "coming-soon",
    related: ["pdf-split", "pdf-organize", "image-to-pdf"],
  },
  {
    id: "pdf-split",
    category: "pdf",
    slug: "split",
    name: "Split PDF",
    tagline: "Extract pages or split a PDF into several files.",
    title: "Split PDF Online Free — Extract Pages Without Uploading",
    description:
      "Split a PDF into separate files or extract specific pages for free. Works entirely in your browser, so your documents stay private.",
    icon: Scissors,
    status: "coming-soon",
    related: ["pdf-merge", "pdf-organize"],
  },
  {
    id: "pdf-compress",
    category: "pdf",
    slug: "compress",
    name: "Compress PDF",
    tagline: "Reduce PDF file size for email and uploads.",
    title: "Compress PDF Online Free — Reduce PDF File Size",
    description:
      "Shrink PDF file size for free, right in your browser. No sign-up and no uploads — ideal for email attachments and upload limits.",
    icon: Minimize2,
    status: "coming-soon",
    related: ["pdf-merge", "image-compress"],
  },
  {
    id: "pdf-organize",
    category: "pdf",
    slug: "organize",
    name: "Organize PDF",
    tagline: "Rotate, reorder and delete pages visually.",
    title: "Organize PDF Pages — Rotate, Reorder & Delete Online",
    description:
      "Rotate, reorder and delete PDF pages with a visual editor. Free, fast and private — everything happens in your browser.",
    icon: LayoutGrid,
    status: "coming-soon",
    related: ["pdf-merge", "pdf-split"],
  },
  {
    id: "pdf-word-counter",
    category: "pdf",
    slug: "word-counter",
    name: "PDF Word Counter",
    tagline: "Count words and characters in a PDF.",
    title: "PDF Word Counter — Count Words in a PDF Online",
    description:
      "Count words, characters and pages in any PDF for free. Runs in your browser, so your document is never uploaded.",
    icon: Hash,
    status: "coming-soon",
    related: ["docx-word-counter", "pdf-to-word"],
  },
  {
    id: "pdf-to-word",
    category: "pdf",
    slug: "to-word",
    name: "PDF to Word",
    tagline: "Extract text from a PDF into an editable .docx.",
    title: "PDF to Word — Extract PDF Text to DOCX Free",
    description:
      "Extract the text from a PDF into an editable Word document for free, without uploading your file anywhere.",
    icon: FileOutput,
    status: "coming-soon",
    related: ["docx-to-pdf", "pdf-to-excel"],
  },
  {
    id: "pdf-to-excel",
    category: "pdf",
    slug: "to-excel",
    name: "PDF to Excel",
    tagline: "Pull text and tables from a PDF into a spreadsheet.",
    title: "PDF to Excel — Extract PDF Data to a Spreadsheet",
    description:
      "Extract text and simple tables from a PDF into an Excel spreadsheet, for free and entirely in your browser.",
    icon: FileSpreadsheet,
    status: "coming-soon",
    related: ["pdf-to-word", "pdf-to-ppt"],
  },
  {
    id: "pdf-to-ppt",
    category: "pdf",
    slug: "to-ppt",
    name: "PDF to PowerPoint",
    tagline: "Turn PDF pages into presentation slides.",
    title: "PDF to PowerPoint — Convert PDF Pages to Slides",
    description:
      "Turn PDF pages into PowerPoint slides for free. No uploads, no sign-up — conversion happens in your browser.",
    icon: Presentation,
    status: "coming-soon",
    related: ["pdf-to-word", "pdf-to-excel"],
  },

  // ── Word / DOCX ────────────────────────────────────────────────────────
  {
    id: "docx-to-pdf",
    category: "docx",
    slug: "to-pdf",
    name: "Word to PDF",
    tagline: "Convert .docx documents to PDF.",
    title: "Word to PDF — Convert DOCX to PDF Online Free",
    description:
      "Convert Word documents (.docx) to PDF for free, directly in your browser. Your files are never uploaded to a server.",
    icon: FileText,
    status: "coming-soon",
    related: ["pdf-to-word", "pdf-merge"],
  },
  {
    id: "docx-word-counter",
    category: "docx",
    slug: "word-counter",
    name: "Word Counter",
    tagline: "Words, characters and readability score.",
    title: "Word Counter — Count Words & Characters with Readability Score",
    description:
      "Count words, characters, sentences and reading time, with a readability score. Paste text or open a .docx — free and private.",
    icon: Hash,
    status: "live",
    howTo: [
      "Type or paste your text into the box — or open a .docx or .txt file with the button above it.",
      "Word, character, sentence and paragraph counts update instantly as you type.",
      "Check the side panel for reading time, readability score and your most-used keywords.",
    ],
    faq: [
      {
        question: "Is my text sent anywhere?",
        answer:
          "No. Counting happens entirely in your browser. Your text and documents are never uploaded, stored or seen by anyone else, and they're cleared when you close the page.",
      },
      {
        question: "Can I count words in a Word document?",
        answer:
          'Yes. Click "Open .docx or .txt" or drag the file onto the text box. The text is extracted in your browser and counted instantly. Older .doc files aren\'t supported — save them as .docx first.',
      },
      {
        question: "Why is my count slightly different from Microsoft Word or Google Docs?",
        answer:
          "Each program has its own rules for things like hyphens, numbers, URLs and footnotes. We count hyphenated words and contractions as one word, like Microsoft Word. Text inside headers, footers and text boxes of a .docx may not be included.",
      },
      {
        question: "Are spaces included in the character count?",
        answer:
          'Both are shown: "Characters" includes spaces and line breaks, and "Characters (no spaces)" in the details panel excludes them. Emoji and accented letters count as one character each.',
      },
      {
        question: "What is a good readability score?",
        answer:
          "For general audiences, aim for a Flesch Reading Ease score of 60 or higher. Scores of 30–59 are typical for academic and technical writing. The score is designed for English text.",
      },
      {
        question: "Is there a word limit?",
        answer:
          "No. The counter handles very long texts, including full books — the only limit is your device's memory.",
      },
    ],
    related: ["pdf-word-counter", "docx-find-replace", "docx-to-pdf"],
  },
  {
    id: "docx-find-replace",
    category: "docx",
    slug: "find-replace",
    name: "Find & Replace",
    tagline: "Find and replace text across a Word document.",
    title: "Find and Replace in Word Documents Online",
    description:
      "Find and replace text across a .docx document and download the result. Free, fast and processed entirely in your browser.",
    icon: Replace,
    status: "coming-soon",
    related: ["docx-word-counter", "docx-to-pdf"],
  },

  // ── Image ──────────────────────────────────────────────────────────────
  {
    id: "image-convert",
    category: "image",
    slug: "convert",
    name: "Image Converter",
    tagline: "Convert HEIC, PNG, WebP and more to JPG, PNG or WebP.",
    title: "Image Converter — HEIC to JPG, PNG to JPG, WebP & More",
    description:
      "Convert HEIC, PNG, WebP, GIF and more to JPG, PNG or WebP for free. Batch convert and download as ZIP — photos never leave your device.",
    icon: RefreshCw,
    status: "live",
    howTo: [
      "Add your images — drag them into the box or choose them. You can mix formats, including iPhone HEIC photos.",
      "Choose the format to convert to: JPG, PNG or WebP. For JPG and WebP, adjust the quality if you like.",
      "Click “Convert” and wait for each image to show a green tick.",
      "Download images one by one, or all of them together as a ZIP file.",
    ],
    faq: [
      {
        question: "How do I convert HEIC to JPG?",
        answer:
          "Add your HEIC photos, keep “JPG” selected and click Convert. The HEIC decoder loads automatically the first time and runs in your browser, so your photos are never uploaded.",
      },
      {
        question: "Are my images uploaded anywhere?",
        answer:
          "No. All conversion happens on your device. Your images aren't sent to a server, stored or seen by anyone else.",
      },
      {
        question: "How many images can I convert at once?",
        answer:
          "Up to 100 images per batch. They're converted one after another to keep memory use low, and you can download them all together as a ZIP file.",
      },
      {
        question: "Can I convert images to HEIC?",
        answer:
          "Not currently — browsers can read HEIC with our decoder but can't create HEIC files. Convert to JPG or WebP instead; both are much more widely supported.",
      },
      {
        question: "What happens to transparent backgrounds?",
        answer:
          "PNG and WebP keep transparency. JPG doesn't support it, so transparent areas become white.",
      },
      {
        question: "Does converting an animated GIF keep the animation?",
        answer:
          "No — only the first frame is converted. The output formats here are for still images.",
      },
    ],
    related: ["image-compress", "image-resize", "image-to-pdf"],
  },
  {
    id: "image-compress",
    category: "image",
    slug: "compress",
    name: "Compress Image",
    tagline: "Shrink image file size without visible quality loss.",
    title: "Compress Images Online Free — JPG, PNG & WebP",
    description:
      "Reduce image file size for free while keeping quality high. Batch compress JPG, PNG and WebP privately in your browser.",
    icon: Minimize2,
    status: "coming-soon",
    related: ["image-resize", "image-convert"],
  },
  {
    id: "image-resize",
    category: "image",
    slug: "resize",
    name: "Resize Image",
    tagline: "Change image dimensions by pixels or percentage.",
    title: "Resize Images Online Free — By Pixels or Percentage",
    description:
      "Resize images to exact pixel dimensions or by percentage for free. Keep proportions, choose JPG, PNG or WebP — privately in your browser.",
    icon: Scaling,
    status: "live",
    howTo: [
      "Choose an image or drag it into the box — JPG, PNG, WebP, GIF, BMP and AVIF are supported.",
      "Pick “By pixels” to enter an exact width and height, or “By percentage” to scale it.",
      "Choose the output format and quality, then click “Resize image”.",
      "Download your resized image.",
    ],
    faq: [
      {
        question: "Are my images uploaded to a server?",
        answer:
          "No. Resizing happens entirely in your browser using your device's graphics capabilities. Your images never leave your device and aren't stored anywhere.",
      },
      {
        question: "Will resizing reduce the quality of my image?",
        answer:
          "Making an image smaller keeps it sharp. Making it larger can look soft, because no new detail can be created. For JPG and WebP, a quality setting of 80–90% keeps images looking like the original.",
      },
      {
        question: "How do I resize without stretching the image?",
        answer:
          "Keep the link icon between width and height switched on. The other dimension then updates automatically so the proportions stay the same. Resizing by percentage always keeps the proportions.",
      },
      {
        question: "What's the largest image I can resize?",
        answer: `Output images can be up to 16,384 pixels on each side. Very large images depend on your device's memory — most computers handle photos of 50 megapixels or more.`,
      },
      {
        question: "Why is my photo rotated correctly here but not in other apps?",
        answer:
          "Phone cameras often store rotation as a hidden tag instead of rotating the pixels. We apply that tag when resizing, so the downloaded image is the right way up in every app.",
      },
      {
        question: "Can I change the format while resizing?",
        answer:
          "Yes. Choose JPG, PNG or WebP as the output format. Transparent areas are kept in PNG and WebP, and turned white in JPG, which doesn't support transparency.",
      },
    ],
    related: ["image-compress", "image-convert", "image-to-pdf"],
  },
  {
    id: "image-remove-background",
    category: "image",
    slug: "remove-background",
    name: "Remove Background",
    tagline: "Automatically remove image backgrounds.",
    title: "Remove Image Background Online Free — No Upload",
    description:
      "Remove the background from photos automatically, for free. AI runs on your device, so your images are never uploaded.",
    icon: Eraser,
    status: "coming-soon",
    related: ["image-convert", "image-resize"],
  },
  {
    id: "image-to-pdf",
    category: "image",
    slug: "to-pdf",
    name: "Image to PDF",
    tagline: "Combine JPG, PNG and more into a single PDF.",
    title: "Image to PDF — Convert JPG & PNG to PDF Free",
    description:
      "Convert and combine JPG, PNG and other images into one PDF for free. Reorder pages and convert privately in your browser.",
    icon: FileImage,
    status: "coming-soon",
    related: ["pdf-merge", "image-convert"],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────

export function getTool(id: string): Tool {
  const tool = tools.find((t) => t.id === id);
  if (!tool) throw new Error(`Unknown tool id: "${id}"`);
  return tool;
}

export function getCategory(id: ToolCategoryId): ToolCategory {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category id: "${id}"`);
  return category;
}

export function toolHref(tool: Tool): string {
  return `/${tool.category}/${tool.slug}`;
}

export function categoryHref(category: ToolCategory): string {
  return `/${category.id}`;
}

export function getToolsByCategory(id: ToolCategoryId): Tool[] {
  return tools.filter((t) => t.category === id);
}

export function getLiveTools(): Tool[] {
  return tools.filter((t) => t.status === "live");
}

/** Related tools that are live; falls back to other live tools in the same category. */
export function getRelatedTools(tool: Tool, limit = 3): Tool[] {
  const explicit = (tool.related ?? []).map(getTool);
  const sameCategory = getToolsByCategory(tool.category).filter((t) => t.id !== tool.id);
  const unique = [...new Set([...explicit, ...sameCategory])];
  return unique.filter((t) => t.status === "live").slice(0, limit);
}
