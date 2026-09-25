// Copies browser libraries that must be served as standalone files into public/vendor.
// Runs automatically before `npm run dev` and `npm run build` (see package.json).
//
// browser-image-compression runs in a Web Worker that loads its own code with importScripts().
// By default it fetches that code from a third-party CDN; serving it ourselves keeps every
// request on our own domain.
import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const files = [
  [
    "node_modules/browser-image-compression/dist/browser-image-compression.js",
    "public/vendor/browser-image-compression.js",
  ],
];

for (const [from, to] of files) {
  mkdirSync(dirname(join(root, to)), { recursive: true });
  copyFileSync(join(root, from), join(root, to));
  console.log(`vendor: ${from} → ${to}`);
}
