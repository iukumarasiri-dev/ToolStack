import { ProsePage } from "@/components/templates/ProsePage";
import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: `How ${siteConfig.name} handles your data. Files are processed in your browser and never uploaded.`,
  path: "/privacy-policy",
});

// NOTE: This is a starting template, not legal advice. Review it (ideally with a
// professional or a policy generator) before launch, and keep it in sync with the
// analytics and ad providers you actually use.
export default function PrivacyPolicyPage() {
  return (
    <ProsePage title="Privacy Policy" lastUpdated="September 25, 2026">
      <p>
        This policy explains what information {siteConfig.name} (&quot;we&quot;, &quot;us&quot;)
        collects when you use {siteConfig.url} (the &quot;Site&quot;) and how it is used.
      </p>

      <h2>Your files</h2>
      <p>
        All file processing on the Site happens locally in your web browser.{" "}
        <strong>
          The files you open with our tools are never uploaded to our servers or any third party
        </strong>
        , and we cannot see, store or access their contents. When you close or reload the page, the
        files are cleared from the browser&apos;s memory.
      </p>

      <h2>Information collected automatically</h2>
      <p>
        Like most websites, our hosting provider may log standard technical information such as IP
        address, browser type, referring page and time of visit, for security and to keep the Site
        running.
      </p>
      <p>
        We use privacy-friendly analytics to understand which pages are visited. This analytics
        service does not use cookies and does not track you across other websites.
      </p>

      <h2>Advertising and cookies</h2>
      <p>
        The Site is supported by advertising provided by Google AdSense. Google and its partners use
        cookies and similar technologies to serve ads and measure their performance:
      </p>
      <ul>
        <li>
          Third-party vendors, including Google, use cookies to serve ads based on your prior visits
          to this website or other websites.
        </li>
        <li>
          Google&apos;s use of advertising cookies enables it and its partners to serve ads to you
          based on your visits to this and/or other sites on the Internet.
        </li>
        <li>
          You may opt out of personalised advertising by visiting{" "}
          <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
            Google Ads Settings
          </a>
          , or opt out of some third-party vendors&apos; use of cookies at{" "}
          <a href="https://www.aboutads.info/choices/" rel="noopener noreferrer" target="_blank">
            aboutads.info
          </a>
          .
        </li>
      </ul>
      <p>
        For more information, see{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          rel="noopener noreferrer"
          target="_blank"
        >
          How Google uses information from sites or apps that use its services
        </a>
        .
      </p>
      <p>
        If you are in the European Economic Area, the United Kingdom or Switzerland, we ask for your
        consent before personalised ads or non-essential cookies are used, and you can change your
        choice at any time.
      </p>

      <h2>Children&apos;s privacy</h2>
      <p>
        The Site is not directed at children under 13, and we do not knowingly collect personal
        information from them.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct or delete personal data
        held about you. Because we do not operate user accounts or store your files, we hold very
        little personal data. Contact us with any request and we will respond as required by
        applicable law.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &quot;last updated&quot; date above shows
        when it was last changed.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy? Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>
    </ProsePage>
  );
}
