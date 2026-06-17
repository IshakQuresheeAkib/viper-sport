/**
 * Download HTML and screenshot assets from Stitch meta JSON files in .stitch/.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stitchDir = join(root, ".stitch");

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Download failed ${res.status}: ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(dest, buf);
  console.log(`Downloaded: ${dest}`);
}

const prefixes = process.argv.slice(2);
const metaFiles =
  prefixes.length > 0
    ? prefixes.map((p) => `${p}-meta.json`)
    : readdirSync(stitchDir).filter((f) => f.endsWith("-meta.json"));

for (const metaFile of metaFiles) {
  const metaPath = join(stitchDir, metaFile);
  const prefix = metaFile.replace(/-meta\.json$/, "");
  const screen = JSON.parse(readFileSync(metaPath, "utf8"));

  const htmlUrl = screen?.htmlCode?.downloadUrl;
  const screenshotUrl = screen?.screenshot?.downloadUrl;

  if (htmlUrl) {
    await download(htmlUrl, join(stitchDir, `${prefix}.html`));
  }
  if (screenshotUrl) {
    await download(
      screenshotUrl,
      join(stitchDir, `${prefix}-screenshot.png`),
    );
  }
}
