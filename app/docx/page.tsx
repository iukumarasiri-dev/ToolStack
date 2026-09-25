import { CategoryPage } from "@/components/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Word Tools — DOCX to PDF, Word Counter & More",
  description:
    "Free online tools for Word documents: convert DOCX to PDF, count words and find & replace text — all processed privately in your browser.",
  path: "/docx",
});

export default function Page() {
  return <CategoryPage categoryId="docx" />;
}
