export interface ZipEntry {
  name: string;
  data: Blob;
}

/** Makes names unique within an archive: "photo.jpg", "photo (2).jpg", … */
export function uniqueNames(names: string[]): string[] {
  const used = new Set<string>();
  return names.map((name) => {
    let candidate = name;
    const dot = name.lastIndexOf(".");
    const base = dot > 0 ? name.slice(0, dot) : name;
    const ext = dot > 0 ? name.slice(dot) : "";
    for (let i = 2; used.has(candidate.toLowerCase()); i++) candidate = `${base} (${i})${ext}`;
    used.add(candidate.toLowerCase());
    return candidate;
  });
}

/**
 * Bundles files into a ZIP archive in the browser.
 * Uses "store" (no compression): images and PDFs are already compressed, so
 * compressing again would only waste time.
 */
export async function createZip(entries: ZipEntry[]): Promise<Blob> {
  const { zipSync } = await import("fflate");
  const names = uniqueNames(entries.map((e) => e.name));
  const buffers = await Promise.all(entries.map((e) => e.data.arrayBuffer()));
  // Insert in list order so the archive matches the order shown to the user.
  const files: Record<string, Uint8Array> = {};
  names.forEach((name, i) => (files[name] = new Uint8Array(buffers[i])));
  const zipped = zipSync(files, { level: 0 });
  return new Blob([zipped], { type: "application/zip" });
}
