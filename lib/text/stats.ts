/**
 * Text statistics for the word counter.
 * Uses Intl.Segmenter where available so word and sentence boundaries are
 * correct for most languages (not just space-separated English).
 */

export interface TextStats {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  /** Minutes, at an average silent reading speed. */
  readingTimeMin: number;
  /** Minutes, at an average speaking pace. */
  speakingTimeMin: number;
  avgWordLength: number;
  avgSentenceLength: number;
  readability: Readability | null;
  keywords: Keyword[];
}

export interface Readability {
  /** Flesch Reading Ease, 0–100 (higher = easier). */
  score: number;
  /** Flesch–Kincaid US school grade level. */
  grade: number;
  label: string;
}

export interface Keyword {
  word: string;
  count: number;
  /** Share of all words, as a percentage. */
  density: number;
}

const READING_WPM = 238;
const SPEAKING_WPM = 150;

const hasSegmenter = typeof Intl !== "undefined" && "Segmenter" in Intl;
const HYPHENS = new Set(["-", "‐", "‑"]);

// Segmenters are reusable, so create each one once.
let segmenters: Record<"word" | "sentence" | "grapheme", Intl.Segmenter> | null = null;
function getSegmenters() {
  segmenters ??= {
    word: new Intl.Segmenter(undefined, { granularity: "word" }),
    sentence: new Intl.Segmenter(undefined, { granularity: "sentence" }),
    grapheme: new Intl.Segmenter(undefined, { granularity: "grapheme" }),
  };
  return segmenters;
}

function getWords(text: string): string[] {
  if (!hasSegmenter) return text.match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? [];

  const words: string[] = [];
  // True when the previous segment was a hyphen directly after a word, e.g. "well-".
  let joinNext = false;
  let prevWasWord = false;
  for (const { segment, isWordLike } of getSegmenters().word.segment(text)) {
    if (isWordLike) {
      // Count hyphenated compounds ("well-known") as one word, like Microsoft Word.
      if (joinNext) words[words.length - 1] += `-${segment}`;
      else words.push(segment);
      joinNext = false;
      prevWasWord = true;
    } else {
      joinNext = prevWasWord && HYPHENS.has(segment);
      prevWasWord = false;
    }
  }
  return words;
}

function countSentences(text: string): number {
  const hasContent = (s: string) => /[\p{L}\p{N}]/u.test(s);
  if (!hasSegmenter) return text.split(/[.!?]+(?:\s|$)/).filter(hasContent).length;
  let count = 0;
  for (const { segment } of getSegmenters().sentence.segment(text)) {
    if (hasContent(segment)) count++;
  }
  return count;
}

/** Counts user-perceived characters (emoji and accented letters count as one), with and without whitespace. */
function countCharacters(text: string): { all: number; noSpaces: number } {
  let all = 0;
  let noSpaces = 0;
  const graphemes = hasSegmenter
    ? Array.from(getSegmenters().grapheme.segment(text), (s) => s.segment)
    : Array.from(text);
  for (const g of graphemes) {
    all++;
    if (!/^\s+$/.test(g)) noSpaces++;
  }
  return { all, noSpaces };
}

/** Heuristic English syllable count — good enough for readability scores. */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (w.length === 0) return 0;
  if (w.length <= 3) return 1;
  const trimmed = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = trimmed.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups?.length ?? 0);
}

function readabilityLabel(score: number): string {
  if (score >= 90) return "Very easy";
  if (score >= 80) return "Easy";
  if (score >= 70) return "Fairly easy";
  if (score >= 60) return "Plain English";
  if (score >= 50) return "Fairly difficult";
  if (score >= 30) return "Difficult";
  return "Very difficult";
}

function getReadability(words: string[], sentences: number): Readability | null {
  // Scores on a handful of words are meaningless.
  if (words.length < 10 || sentences === 0) return null;
  const syllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
  const wordsPerSentence = words.length / sentences;
  const syllablesPerWord = syllables / words.length;
  const score = 206.835 - 1.015 * wordsPerSentence - 84.6 * syllablesPerWord;
  const grade = 0.39 * wordsPerSentence + 11.8 * syllablesPerWord - 15.59;
  const clamped = Math.min(100, Math.max(0, score));
  return {
    score: Math.round(clamped),
    grade: Math.max(0, Math.round(grade * 10) / 10),
    label: readabilityLabel(clamped),
  };
}

// Common English words excluded from keyword density.
const STOP_WORDS = new Set(
  (
    "a about above after again against all am an and any are as at be because been before being " +
    "below between both but by can could did do does doing down during each few for from further " +
    "had has have having he her here hers herself him himself his how i if in into is it its itself " +
    "just me more most my myself no nor not now of off on once only or other our ours ourselves out " +
    "over own same she should so some such than that the their theirs them themselves then there " +
    "these they this those through to too under until up very was we were what when where which " +
    "while who whom why will with would you your yours yourself yourselves also may might must " +
    "shall us one"
  ).split(" "),
);

function getKeywords(words: string[], limit: number): Keyword[] {
  const counts = new Map<string, number>();
  for (const raw of words) {
    const word = raw.toLowerCase();
    if (word.length < 3 || STOP_WORDS.has(word) || /^\d+$/.test(word)) continue;
    counts.set(word, (counts.get(word) ?? 0) + 1);
  }
  return Array.from(counts, ([word, count]) => ({
    word,
    count,
    density: Math.round((count / words.length) * 1000) / 10,
  }))
    .filter((k) => k.count > 1)
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word))
    .slice(0, limit);
}

export function analyzeText(text: string, keywordLimit = 10): TextStats {
  const words = getWords(text);
  const sentences = countSentences(text);
  const paragraphs = text.split(/\n+/).filter((p) => p.trim().length > 0).length;
  const letters = words.reduce((sum, w) => sum + w.length, 0);
  const characters = countCharacters(text);

  return {
    words: words.length,
    characters: characters.all,
    charactersNoSpaces: characters.noSpaces,
    sentences,
    paragraphs,
    readingTimeMin: words.length / READING_WPM,
    speakingTimeMin: words.length / SPEAKING_WPM,
    avgWordLength: words.length ? Math.round((letters / words.length) * 10) / 10 : 0,
    avgSentenceLength: sentences ? Math.round((words.length / sentences) * 10) / 10 : 0,
    readability: getReadability(words, sentences),
    keywords: getKeywords(words, keywordLimit),
  };
}

/** 0.3 → "18 sec", 4.2 → "4 min 12 sec" */
export function formatDuration(minutes: number): string {
  const totalSeconds = Math.round(minutes * 60);
  if (totalSeconds < 60) return `${totalSeconds} sec`;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return s ? `${m} min ${s} sec` : `${m} min`;
}
