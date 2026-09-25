import { CategoryPage } from "@/components/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free PDF Tools — Merge, Split, Compress & Convert",
  description:
    "Free online PDF tools that run in your browser: merge, split, compress, organize and convert PDFs without uploading your files.",
  path: "/pdf",
});

export default function Page() {
  return <CategoryPage categoryId="pdf" />;
}
