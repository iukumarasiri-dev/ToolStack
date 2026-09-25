"use client";

import { useDeferredValue, useMemo, useRef, useState, type DragEvent, type ReactNode } from "react";
import { CircleAlert, FileText, FileUp, LoaderCircle, Trash2 } from "lucide-react";
import { Button, buttonClasses } from "@/components/ui/Button";
import { extractDocxText } from "@/lib/docx/extractText";
import { analyzeText, formatDuration, type Readability } from "@/lib/text/stats";
import { cn, matchesAccept } from "@/lib/utils";

const ACCEPT = [".docx", ".txt"];
const number = new Intl.NumberFormat("en-US");

export function WordCounterTool() {
  const [text, setText] = useState("");
  const [source, setSource] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const dragDepth = useRef(0);

  // Typing stays responsive on very long texts; stats catch up a moment later.
  const deferredText = useDeferredValue(text);
  const stats = useMemo(() => analyzeText(deferredText), [deferredText]);

  async function openFile(file: File) {
    setError(null);
    if (!matchesAccept(file, ACCEPT)) {
      setError(`"${file.name}" isn't supported. Open a .docx or .txt file.`);
      return;
    }
    setLoading(true);
    try {
      const content = file.name.toLowerCase().endsWith(".docx")
        ? await extractDocxText(file)
        : await file.text();
      setText(content);
      setSource(file.name);
    } catch {
      setError(
        `Couldn't read "${file.name}". Make sure it's a valid .docx file — older .doc files aren't supported.`,
      );
    } finally {
      setLoading(false);
    }
  }

  // Only intercept dragged files; dragging selected text into the box works as normal.
  const isFileDrag = (e: DragEvent) => e.dataTransfer.types.includes("Files");

  function handleDrop(e: DragEvent) {
    if (!isFileDrag(e)) return;
    e.preventDefault();
    dragDepth.current = 0;
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void openFile(file);
  }

  function clear() {
    setText("");
    setSource(null);
    setError(null);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <label className={buttonClasses({ variant: "secondary", className: "cursor-pointer" })}>
          <FileUp className="size-4" aria-hidden />
          Open .docx or .txt
          <input
            type="file"
            accept={ACCEPT.join(",")}
            className="sr-only"
            disabled={loading}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void openFile(file);
              e.target.value = "";
            }}
          />
        </label>
        <Button variant="ghost" onClick={clear} disabled={!text && !source}>
          <Trash2 className="size-4" aria-hidden />
          Clear
        </Button>
        {loading && (
          <span className="text-muted flex items-center gap-2 text-sm">
            <LoaderCircle className="size-4 animate-spin" aria-hidden />
            Reading document…
          </span>
        )}
        {source && !loading && (
          <span className="text-muted flex min-w-0 items-center gap-1.5 text-sm">
            <FileText className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{source}</span>
          </span>
        )}
      </div>

      {error && (
        <p role="alert" className="flex items-start gap-2 text-sm text-red-600 dark:text-red-400">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <PrimaryStat label="Words" value={stats.words} />
        <PrimaryStat label="Characters" value={stats.characters} />
        <PrimaryStat label="Sentences" value={stats.sentences} />
        <PrimaryStat label="Paragraphs" value={stats.paragraphs} />
      </dl>

      <div className="grid gap-4 lg:grid-cols-3">
        <div
          className="relative lg:col-span-2"
          onDragEnter={(e) => {
            if (!isFileDrag(e)) return;
            dragDepth.current++;
            setDragging(true);
          }}
          onDragOver={(e) => isFileDrag(e) && e.preventDefault()}
          onDragLeave={(e) => {
            if (!isFileDrag(e)) return;
            dragDepth.current--;
            if (dragDepth.current <= 0) setDragging(false);
          }}
          onDrop={handleDrop}
        >
          <label htmlFor="word-counter-text" className="sr-only">
            Text to count
          </label>
          <textarea
            id="word-counter-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start typing, paste your text, or drop a .docx file here…"
            spellCheck
            className={cn(
              "border-border bg-surface block min-h-80 w-full resize-y rounded-xl border p-4 leading-relaxed lg:h-full",
              "focus-visible:outline-brand focus-visible:outline-2 focus-visible:outline-offset-2",
            )}
          />
          {dragging && (
            <div className="border-brand bg-brand-soft/90 text-brand pointer-events-none absolute inset-0 flex items-center justify-center rounded-xl border-2 border-dashed font-semibold">
              Drop to open
            </div>
          )}
        </div>

        <aside className="space-y-4" aria-label="Detailed statistics">
          <Panel title="Details">
            <dl className="divide-border divide-y text-sm">
              <DetailRow
                label="Characters (no spaces)"
                value={number.format(stats.charactersNoSpaces)}
              />
              <DetailRow label="Reading time" value={formatDuration(stats.readingTimeMin)} />
              <DetailRow label="Speaking time" value={formatDuration(stats.speakingTimeMin)} />
              <DetailRow label="Avg. word length" value={`${stats.avgWordLength} letters`} />
              <DetailRow label="Avg. sentence length" value={`${stats.avgSentenceLength} words`} />
            </dl>
          </Panel>

          <Panel title="Readability">
            <ReadabilityMeter readability={stats.readability} />
          </Panel>

          <Panel title="Top keywords">
            {stats.keywords.length > 0 ? (
              <table className="w-full text-sm">
                <thead className="sr-only">
                  <tr>
                    <th>Keyword</th>
                    <th>Count</th>
                    <th>Density</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.keywords.map((k) => (
                    <tr key={k.word}>
                      <td className="truncate py-1 pr-2">{k.word}</td>
                      <td className="text-muted py-1 text-right tabular-nums">{k.count}×</td>
                      <td className="text-muted w-16 py-1 text-right tabular-nums">{k.density}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-muted text-sm">Words used more than once will appear here.</p>
            )}
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function PrimaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-border bg-surface rounded-xl border p-4">
      <dt className="text-muted text-sm">{label}</dt>
      <dd className="mt-1 text-2xl font-bold tabular-nums">{number.format(value)}</dd>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-border bg-surface rounded-xl border p-4">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-2 first:pt-0 last:pb-0">
      <dt className="text-muted">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function ReadabilityMeter({ readability }: { readability: Readability | null }) {
  if (!readability) {
    return (
      <p className="text-muted text-sm">
        Add at least a couple of sentences to see a readability score.
      </p>
    );
  }
  const { score, grade, label } = readability;
  const color = score >= 60 ? "bg-emerald-500" : score >= 30 ? "bg-amber-500" : "bg-red-500";

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-2xl font-bold tabular-nums">{score}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div
        role="meter"
        aria-label="Flesch reading ease"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={score}
        className="bg-brand-soft mt-2 h-2 overflow-hidden rounded-full"
      >
        <div className={cn("h-full rounded-full", color)} style={{ width: `${score}%` }} />
      </div>
      <p className="text-muted mt-2 text-xs">
        Flesch reading ease (0–100, higher is easier) · US grade level {grade}
      </p>
    </div>
  );
}
