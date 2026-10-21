#!/usr/bin/env node
/**
 * Art-pipeline helper (not part of the site build): sends one prompt, plus
 * optional reference images, to a Gemini image model and saves the result.
 * See docs/visual-art-direction.md §10 and docs/art-generation-prompts.md.
 *
 *   node scripts/generate-image.mjs --prompt art-source/x/prompt.txt \
 *     --out art-source/x/raw-v02 [--ref a.png --ref b.png] \
 *     [--aspect 9:16] [--size 2K] [--model gemini-3-pro-image] [--count 1]
 *
 * Reads GEMINI_API_KEY from .env.ai (gitignored) or the environment. The key
 * goes in a request header and is never printed. Every call is billed to
 * the key's Google account, so generate deliberately.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { extname } from "node:path";

function parseArgs(argv) {
  const args = { ref: [], aspect: "9:16", size: "2K", model: "gemini-3-pro-image", count: 1 };
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, "");
    const value = argv[i + 1];
    if (key === "ref") args.ref.push(value);
    else if (key === "count") args.count = Number(value);
    else args[key] = value;
  }
  if (!args.prompt || !args.out) throw new Error("--prompt <file> and --out <path-prefix> are required");
  return args;
}

function loadKey() {
  if (process.env.GEMINI_API_KEY) return process.env.GEMINI_API_KEY;
  if (existsSync(".env.ai")) {
    const match = readFileSync(".env.ai", "utf8").match(/^GEMINI_API_KEY=(.+)$/m);
    if (match) return match[1].trim().replace(/^["']|["']$/g, "");
  }
  throw new Error("GEMINI_API_KEY not found in environment or .env.ai");
}

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };
const EXT = { "image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp" };

async function generateOnce(args, key, index) {
  const parts = [
    ...args.ref.map((file) => ({
      inlineData: { mimeType: MIME[extname(file).toLowerCase()] ?? "image/png", data: readFileSync(file).toString("base64") },
    })),
    { text: readFileSync(args.prompt, "utf8") },
  ];

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${args.model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": key },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        responseModalities: ["IMAGE", "TEXT"],
        imageConfig: { aspectRatio: args.aspect, imageSize: args.size },
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) throw new Error(`${response.status} ${data.error?.status ?? ""}: ${data.error?.message ?? JSON.stringify(data)}`);

  const outParts = data.candidates?.[0]?.content?.parts ?? [];
  const suffix = args.count > 1 ? `-${String.fromCharCode(97 + index)}` : "";
  let saved = 0;
  for (const part of outParts) {
    if (part.inlineData?.data) {
      const file = `${args.out}${suffix}${EXT[part.inlineData.mimeType] ?? ".png"}`;
      writeFileSync(file, Buffer.from(part.inlineData.data, "base64"));
      console.log(`saved ${file}`);
      saved += 1;
    } else if (part.text && !part.thought) {
      console.log(`model note: ${part.text.trim().slice(0, 300)}`);
    }
  }
  if (!saved) console.log(`no image returned (finishReason: ${data.candidates?.[0]?.finishReason ?? "unknown"})`);
  if (data.usageMetadata) console.log(`usage: ${JSON.stringify(data.usageMetadata)}`);
}

const args = parseArgs(process.argv.slice(2));
const key = loadKey();
for (let i = 0; i < args.count; i += 1) {
  await generateOnce(args, key, i);
}
