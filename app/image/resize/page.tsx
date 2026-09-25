import { ToolPageLayout } from "@/components/templates/ToolPageLayout";
import { toolMetadata } from "@/lib/seo";
import { ResizeImageTool } from "./ResizeImageTool";

export const metadata = toolMetadata("image-resize");

export default function Page() {
  return (
    <ToolPageLayout toolId="image-resize" content={<Content />}>
      <ResizeImageTool />
    </ToolPageLayout>
  );
}

function Content() {
  return (
    <>
      <h2>Resize by pixels or by percentage</h2>
      <p>
        Choose <strong>By pixels</strong> when you need an exact size — for example a 1080 × 1080
        social media post or a 1920 × 1080 wallpaper. Choose <strong>By percentage</strong> to scale
        the whole image up or down, such as halving a large phone photo before emailing it.
      </p>
      <p>
        With the link icon switched on, the proportions stay locked: change the width and the height
        updates automatically, so the image is never stretched or squashed. Unlock it only when you
        really need a different shape.
      </p>

      <h2>Common image sizes</h2>
      <table>
        <thead>
          <tr>
            <th>Use</th>
            <th>Size (px)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Instagram square post</td>
            <td>1080 × 1080</td>
          </tr>
          <tr>
            <td>Instagram portrait post</td>
            <td>1080 × 1350</td>
          </tr>
          <tr>
            <td>Instagram / TikTok story</td>
            <td>1080 × 1920</td>
          </tr>
          <tr>
            <td>YouTube thumbnail</td>
            <td>1280 × 720</td>
          </tr>
          <tr>
            <td>Full HD wallpaper</td>
            <td>1920 × 1080</td>
          </tr>
          <tr>
            <td>Website hero image</td>
            <td>1920 × 1080 or smaller</td>
          </tr>
        </tbody>
      </table>
      <p>
        Platforms change their recommended sizes from time to time, so check their current
        guidelines for anything critical.
      </p>

      <h2>Choosing a format</h2>
      <p>
        <strong>JPG</strong> is best for photos and gives small files. <strong>PNG</strong> is
        lossless and keeps transparent backgrounds, making it ideal for logos, screenshots and
        graphics. <strong>WebP</strong> produces smaller files than JPG at similar quality and is
        supported by all modern browsers. For JPG and WebP, a quality of 80–90% is usually
        indistinguishable from the original while saving a lot of space.
      </p>

      <h2>Making images bigger</h2>
      <p>
        Shrinking an image keeps it sharp, but enlarging it can only stretch the pixels that are
        already there, so large increases look soft. For the best results, start from the largest,
        highest-quality version of the image you have.
      </p>
    </>
  );
}
