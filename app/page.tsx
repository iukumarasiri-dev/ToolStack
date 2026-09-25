import Link from "next/link";
import { BadgeCheck, Lock, MousePointerClick, Upload, UserX, Zap } from "lucide-react";
import { Faq } from "@/components/shared/Faq";
import { ToolCard } from "@/components/shared/ToolCard";
import { buttonClasses } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { categories, categoryHref, getToolsByCategory } from "@/config/tools";
import { cn } from "@/lib/utils";

const highlights = [
  {
    icon: Lock,
    title: "Private by design",
    text: "Files are processed on your device. Nothing is uploaded, stored or seen by anyone else.",
  },
  {
    icon: Zap,
    title: "Instant results",
    text: "No upload or download wait — processing starts the moment you add a file.",
  },
  {
    icon: UserX,
    title: "No sign-up",
    text: "No account, no email, no watermark. Open a tool and use it.",
  },
  {
    icon: BadgeCheck,
    title: "Free forever",
    text: "Every tool is free to use, supported by unobtrusive ads.",
  },
];

const steps = [
  {
    icon: MousePointerClick,
    title: "Pick a tool",
    text: "Choose what you want to do with your file.",
  },
  {
    icon: Upload,
    title: "Add your files",
    text: "Drag and drop or browse. They stay on your device.",
  },
  {
    icon: BadgeCheck,
    title: "Download the result",
    text: "Your processed file is ready in seconds.",
  },
];

const faq = [
  {
    question: "Are my files uploaded to a server?",
    answer:
      "No. Every ToolStack tool runs entirely in your web browser using JavaScript and WebAssembly. Your files are read and processed on your own device and are never sent to us or anyone else.",
  },
  {
    question: "Is ToolStack really free?",
    answer:
      "Yes. All tools are free with no sign-up, no watermarks and no daily limits. The site is supported by advertising.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "There's no fixed limit because processing happens on your device. Very large files depend on your device's memory — most computers and modern phones handle files of 100 MB or more.",
  },
  {
    question: "Does it work on my phone?",
    answer:
      "Yes. ToolStack works in any modern browser on Windows, macOS, Linux, Android and iOS. Nothing needs to be installed.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="border-border from-brand-soft to-background border-b bg-linear-to-b">
        <Container className="py-16 text-center sm:py-24">
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="text-muted mx-auto mt-5 max-w-2xl text-lg">
            Merge, split, compress and convert PDFs, Word documents and images. No uploads, no
            sign-up — your files never leave your device.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`#${category.id}`}
                className={buttonClasses({ variant: "secondary", size: "lg" })}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <Container className="space-y-16 py-16">
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <section key={category.id} id={category.id} className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "inline-flex size-10 items-center justify-center rounded-lg",
                      category.accent,
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">{category.name}</h2>
                    <p className="text-muted text-sm">{category.description}</p>
                  </div>
                </div>
                <Link
                  href={categoryHref(category)}
                  className="text-brand text-sm font-medium hover:underline"
                >
                  View all {category.shortName} tools →
                </Link>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {getToolsByCategory(category.id).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          );
        })}
      </Container>

      <section className="border-border bg-surface border-y">
        <Container className="py-16">
          <h2 className="text-center text-2xl font-semibold tracking-tight">Why ToolStack?</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {highlights.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <Icon className="text-brand size-6" aria-hidden />
                <h3 className="mt-3 font-semibold">{title}</h3>
                <p className="text-muted mt-1 text-sm">{text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <Container className="py-16">
        <h2 className="text-center text-2xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="text-center">
              <span className="bg-brand-soft text-brand mx-auto inline-flex size-12 items-center justify-center rounded-full">
                <Icon className="size-6" aria-hidden />
              </span>
              <h3 className="mt-4 font-semibold">
                {i + 1}. {title}
              </h3>
              <p className="text-muted mt-1 text-sm">{text}</p>
            </li>
          ))}
        </ol>
      </Container>

      <Container className="max-w-3xl pb-20">
        <Faq items={faq} />
      </Container>
    </>
  );
}
