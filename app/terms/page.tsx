import Link from "next/link";
import { ProsePage } from "@/components/templates/ProsePage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: `The terms for using ${siteConfig.name}'s free online document and image tools.`,
  path: "/terms",
});

// NOTE: Starting template, not legal advice — review before launch.
export default function TermsPage() {
  return (
    <ProsePage title="Terms of Service" lastUpdated="September 25, 2026">
      <p>
        By using {siteConfig.name} (the &quot;Site&quot;) you agree to these terms. If you do not
        agree, please do not use the Site.
      </p>

      <h2>Use of the tools</h2>
      <p>
        The tools on the Site are provided free of charge for personal and commercial use. You agree
        to use them only for lawful purposes and only with files you have the right to process. You
        are responsible for the files you open and the results you create.
      </p>

      <h2>Your files</h2>
      <p>
        Files are processed locally in your browser and are not uploaded to us. See our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link> for details. Always keep a copy of your
        original files.
      </p>

      <h2>No warranty</h2>
      <p>
        The Site and its tools are provided &quot;as is&quot; and &quot;as available&quot;, without
        warranties of any kind. We do not guarantee that results will be accurate, complete or
        suitable for any particular purpose, or that the Site will be uninterrupted or error-free.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, {siteConfig.name} is not liable for any indirect,
        incidental or consequential damages, or for any loss of data, arising from your use of the
        Site.
      </p>

      <h2>Advertising and third-party links</h2>
      <p>
        The Site displays advertising and may link to third-party websites. We are not responsible
        for the content or practices of those third parties.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms or change the tools on the Site at any time. Continued use of the
        Site after changes means you accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </ProsePage>
  );
}
