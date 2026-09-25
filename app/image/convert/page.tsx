import { ToolPageLayout } from "@/components/templates/ToolPageLayout";
import { toolMetadata } from "@/lib/seo";
import { ImageConverterTool } from "./ImageConverterTool";

export const metadata = toolMetadata("image-convert");

export default function Page() {
  return (
    <ToolPageLayout toolId="image-convert" content={<Content />}>
      <ImageConverterTool />
    </ToolPageLayout>
  );
}

function Content() {
  return (
    <>
      <h2>Convert HEIC to JPG</h2>
      <p>
        iPhones and many recent Android phones save photos as <strong>HEIC</strong>, a format that
        keeps quality high and files small — but that Windows, many websites and older apps
        can&apos;t open. Convert HEIC photos to JPG here and they&apos;ll work everywhere, without
        installing anything. Photos are converted on your device, so private pictures are never
        uploaded.
      </p>

      <h2>Which format should I choose?</h2>
      <table>
        <thead>
          <tr>
            <th>Format</th>
            <th>Best for</th>
            <th>Transparency</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>JPG</td>
            <td>Photos; the most widely supported format</td>
            <td>No (becomes white)</td>
          </tr>
          <tr>
            <td>PNG</td>
            <td>Logos, screenshots, graphics with text; lossless</td>
            <td>Yes</td>
          </tr>
          <tr>
            <td>WebP</td>
            <td>Websites; smaller than JPG at the same quality</td>
            <td>Yes</td>
          </tr>
        </tbody>
      </table>
      <p>
        Converting a photo to PNG makes the file much larger without improving quality, since the
        detail lost in the original JPG or HEIC can&apos;t be recovered. Choose PNG only when you
        need lossless output or transparency.
      </p>

      <h2>Converting many images at once</h2>
      <p>
        Add up to 100 images in one go — you can mix formats, such as HEIC photos from your phone
        and PNG screenshots. Everything is converted to the format you choose, and you can download
        each file individually or all of them together in a single ZIP file.
      </p>

      <h2>What about quality?</h2>
      <p>
        For JPG and WebP, the quality slider balances file size against detail. 85–92% is visually
        identical to the original for almost all photos. Lower values produce smaller files but may
        show blocky artifacts around sharp edges and text.
      </p>
    </>
  );
}
