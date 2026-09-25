import { ProsePage } from "@/components/ProsePage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: `Contact the ${siteConfig.name} team with questions, bug reports or tool requests.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <ProsePage title="Contact us">
      <p>
        Questions, bug reports, tool requests or business enquiries — we&apos;d love to hear from
        you.
      </p>
      <p>
        Email: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
      <p>We usually reply within a few business days.</p>

      <h2>Reporting a problem</h2>
      <p>If a tool isn&apos;t working as expected, it helps to include:</p>
      <ul>
        <li>Which tool you were using</li>
        <li>Your browser and device (e.g. Chrome on Windows, Safari on iPhone)</li>
        <li>The file type and approximate size</li>
        <li>What you expected to happen and what happened instead</li>
      </ul>
      <p>
        Please don&apos;t email us confidential files — since everything runs in your browser, we
        can usually reproduce issues with a similar sample file.
      </p>
    </ProsePage>
  );
}
