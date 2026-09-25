import { ToolPageLayout } from "@/components/templates/ToolPageLayout";
import { toolMetadata } from "@/lib/seo";
import { WordCounterTool } from "./WordCounterTool";

export const metadata = toolMetadata("docx-word-counter");

export default function Page() {
  return (
    <ToolPageLayout toolId="docx-word-counter" content={<Content />}>
      <WordCounterTool />
    </ToolPageLayout>
  );
}

function Content() {
  return (
    <>
      <h2>What the word counter measures</h2>
      <p>
        Paste or type any text — or open a Word document — and the counter updates instantly as you
        edit. Alongside the word count you get characters with and without spaces, sentences,
        paragraphs, estimated reading and speaking time, and the words you use most often.
      </p>
      <p>
        Words are split using your browser&apos;s built-in language rules, so the count is accurate
        for English as well as languages that don&apos;t separate words with spaces. Hyphenated
        compounds such as <em>well-known</em> count as one word and contractions such as{" "}
        <em>don&apos;t</em> count as one word, matching Microsoft Word.
      </p>

      <h2>Understanding the readability score</h2>
      <p>
        The readability score uses the <strong>Flesch Reading Ease</strong> formula, which looks at
        how long your sentences are and how many syllables your words have. Shorter sentences and
        shorter words produce a higher, easier score.
      </p>
      <table>
        <thead>
          <tr>
            <th>Score</th>
            <th>Reading level</th>
            <th>Typical for</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>80–100</td>
            <td>Easy to very easy</td>
            <td>Conversational writing, children&apos;s books</td>
          </tr>
          <tr>
            <td>60–79</td>
            <td>Plain English</td>
            <td>Blogs, news articles, marketing copy</td>
          </tr>
          <tr>
            <td>30–59</td>
            <td>Difficult</td>
            <td>Academic essays, technical documentation</td>
          </tr>
          <tr>
            <td>0–29</td>
            <td>Very difficult</td>
            <td>Legal contracts, scientific papers</td>
          </tr>
        </tbody>
      </table>
      <p>
        For content aimed at a general audience, a score of 60 or above is a good target. The grade
        level shown next to the score is the Flesch–Kincaid estimate of the US school grade needed
        to understand the text. Both formulas were designed for English, so treat scores for other
        languages as a rough guide.
      </p>

      <h2>Reading and speaking time</h2>
      <p>
        Reading time assumes an average silent reading speed of 238 words per minute; speaking time
        assumes 150 words per minute, a comfortable pace for presentations and speeches. Use them to
        check whether a blog post, script or talk fits the time you have.
      </p>
    </>
  );
}
