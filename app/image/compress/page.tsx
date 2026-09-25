import { ToolPageLayout } from "@/components/templates/ToolPageLayout";
import { toolMetadata } from "@/lib/seo";
import { CompressImageTool } from "./CompressImageTool";

export const metadata = toolMetadata("image-compress");

export default function Page() {
  return (
    <ToolPageLayout toolId="image-compress" content={<Content />}>
      <CompressImageTool />
    </ToolPageLayout>
  );
}

function Content() {
  return (
    <>
      <h2>Two ways to compress</h2>
      <p>
        <strong>Quality</strong> saves every image at the quality level you choose. Around 75% is a
        good balance: photos look the same on screen but are often 60–80% smaller.
      </p>
      <p>
        <strong>Target file size</strong> is for upload limits — for example a form that only
        accepts images under 500 KB. The tool lowers the quality step by step, and if needed the
        dimensions, until each image fits.
      </p>

      <h2>The biggest saving: smaller dimensions</h2>
      <p>
        A modern phone photo is around 4000 × 3000 pixels — far more than a screen, email or website
        needs. Setting a maximum width or height of 1920 px (Full HD) typically cuts the file size
        by 70–90% on its own, with no visible difference on most screens.
      </p>

      <h2>Which format gives the smallest files?</h2>
      <table>
        <thead>
          <tr>
            <th>Format</th>
            <th>Compression</th>
            <th>Best for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>WebP</td>
            <td>Smallest at the same quality</td>
            <td>Websites and modern apps</td>
          </tr>
          <tr>
            <td>JPG</td>
            <td>Small, universally supported</td>
            <td>Photos, email, upload forms</td>
          </tr>
          <tr>
            <td>PNG</td>
            <td>Lossless — limited savings</td>
            <td>Logos, screenshots, transparency</td>
          </tr>
        </tbody>
      </table>

      <h2>Privacy bonus: location data removed</h2>
      <p>
        Photos from phones usually contain hidden metadata such as GPS location, camera model and
        the date and time they were taken. Every image that gets compressed is saved without this
        metadata, so it&apos;s safer to share publicly. Orientation is applied before saving, so
        photos stay the right way up.
      </p>
      <p>
        If an image is already so well optimized that compressing it wouldn&apos;t make it smaller,
        the list shows &ldquo;already optimized&rdquo; and your original file is kept unchanged —
        including its metadata.
      </p>
    </>
  );
}
