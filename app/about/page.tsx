import Link from "next/link";
import { ProsePage } from "@/components/ProsePage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description: `Why we built ${siteConfig.name}: free, private document and image tools that run entirely in your browser.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <ProsePage title={`About ${siteConfig.name}`}>
      <p>
        {siteConfig.name} is a collection of free tools for everyday document and image tasks —
        merging and splitting PDFs, converting Word documents, compressing and resizing images, and
        more.
      </p>

      <h2>Your files stay on your device</h2>
      <p>
        Most online file tools upload your documents to their servers to process them. We think
        that&apos;s unnecessary for everyday tasks — and a real privacy risk when those files are
        contracts, IDs, bank statements or personal photos.
      </p>
      <p>
        Every {siteConfig.name} tool runs entirely inside your web browser. Your files are read and
        processed on your own computer or phone, and the result is saved straight back to it. We
        never receive, store or see your files.
      </p>

      <h2>Free, with no sign-up</h2>
      <p>
        There are no accounts, no watermarks and no daily limits. Because we don&apos;t run servers
        to process files, the site is very cheap to operate, and it&apos;s supported by advertising.
      </p>

      <h2>Get in touch</h2>
      <p>
        Found a bug or want a tool we don&apos;t have yet? <Link href="/contact">Contact us</Link> —
        we read every message.
      </p>
    </ProsePage>
  );
}
