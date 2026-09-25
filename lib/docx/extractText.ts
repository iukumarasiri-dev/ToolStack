/**
 * Extracts plain text from a .docx file in the browser.
 * mammoth is imported on demand so it only loads when a document is opened.
 */
export async function extractDocxText(file: File): Promise<string> {
  const { default: mammoth } = await import("mammoth");
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  // mammoth separates paragraphs with blank lines; collapse runs of 3+ newlines.
  return result.value.replace(/\n{3,}/g, "\n\n").trim();
}
