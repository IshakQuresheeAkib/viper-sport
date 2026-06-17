/**
 * Fetch a Stitch screen via MCP get_screen and save meta + assets to .stitch/
 *
 * Usage: node scripts/fetch-stitch-screen.mjs <prefix> <projectId> <screenId>
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const stitchDir = join(root, ".stitch");

function loadApiKey() {
  if (process.env.STITCH_API_KEY) return process.env.STITCH_API_KEY;
  const mcpPath = join(root, ".cursor", "mcp.json");
  const mcp = JSON.parse(readFileSync(mcpPath, "utf8"));
  const key = mcp?.mcpServers?.stitch?.headers?.["X-Goog-Api-Key"];
  if (!key) throw new Error("STITCH_API_KEY not found in env or .cursor/mcp.json");
  return key;
}

async function getScreen(projectId, screenId, apiKey) {
  const { StitchToolClient } = await import("@google/stitch-sdk");
  const client = new StitchToolClient({ apiKey });
  try {
    const result = await client.callTool("get_screen", {
      name: `projects/${projectId}/screens/${screenId}`,
    });
    return result;
  } finally {
    await client.close();
  }
}

function curlDownload(url, dest) {
  execSync(`curl -L -s -o "${dest}" "${url}"`, { stdio: "inherit" });
  console.log(`Downloaded: ${dest}`);
}

const [prefix, projectId, screenId] = process.argv.slice(2);
if (!prefix || !projectId || !screenId) {
  console.error(
    "Usage: node scripts/fetch-stitch-screen.mjs <prefix> <projectId> <screenId>",
  );
  process.exit(1);
}

mkdirSync(stitchDir, { recursive: true });

const apiKey = loadApiKey();
const raw = await getScreen(projectId, screenId, apiKey);
const screen = raw?.structuredContent ?? raw?.content?.[0]?.text
  ? JSON.parse(raw.content[0].text)
  : raw;

writeFileSync(
  join(stitchDir, `${prefix}-request.json`),
  JSON.stringify(
    {
      projectId,
      screenId,
      name: `projects/${projectId}/screens/${screenId}`,
    },
    null,
    2,
  ),
);

writeFileSync(
  join(stitchDir, `${prefix}-meta.json`),
  JSON.stringify(screen, null, 2),
);

const htmlUrl = screen?.htmlCode?.downloadUrl;
const screenshotUrl = screen?.screenshot?.downloadUrl;

if (htmlUrl) {
  curlDownload(htmlUrl, join(stitchDir, `${prefix}.html`));
}
if (screenshotUrl) {
  curlDownload(screenshotUrl, join(stitchDir, `${prefix}-screenshot.png`));
}

console.log(`Saved ${prefix} (${screen?.title ?? screenId})`);
