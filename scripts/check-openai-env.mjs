import { readFileSync } from "node:fs";

const file = process.argv[2] || ".env.vercel-prod-test";
const raw = readFileSync(file, "utf8");
const line = raw.split(/\r?\n/).find((l) => l.startsWith("OPENAI_API_KEY="));
if (!line) {
  console.log("MISSING");
  process.exit(1);
}
let v = line.slice("OPENAI_API_KEY=".length).trim();
if (
  (v.startsWith('"') && v.endsWith('"')) ||
  (v.startsWith("'") && v.endsWith("'"))
) {
  v = v.slice(1, -1);
}
console.log(
  JSON.stringify({
    present: true,
    valueLength: v.length,
    looksConfigured: v.length >= 20,
  }),
);
