import { CategoryPage } from "@/components/templates/CategoryPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Free Image Tools — Convert, Compress & Resize Images",
  description:
    "Free online image tools: convert PNG, JPG, WebP and HEIC, compress and resize images, and turn photos into PDFs — without uploading them.",
  path: "/image",
});

export default function Page() {
  return <CategoryPage categoryId="image" />;
}
