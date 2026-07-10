import { readFileSync, existsSync } from "node:fs";

const file = process.argv[2] || ".env";
if (!existsSync(file)) {
  console.log(`MISSING_FILE ${file}`);
  process.exit(1);
}
const t = readFileSync(file, "utf8");
const keys = process.argv.slice(3);
const list =
  keys.length > 0
    ? keys
    : [
        "OPENAI_API_KEY",
        "STRIPE_SECRET_KEY",
        "DATABASE_URL",
        "AUTH_SECRET",
        "PRIVY_APP_SECRET",
      ];

function parseVal(line, key) {
  let v = line.slice(key.length + 1).trim();
  if (
    (v.startsWith('"') && v.endsWith('"')) ||
    (v.startsWith("'") && v.endsWith("'"))
  ) {
    v = v.slice(1, -1);
  }
  // Vercel pull sometimes leaves empty quoted values
  return v;
}

for (const k of list) {
  const line = t.split(/\r?\n/).find((l) => l.startsWith(`${k}=`));
  if (!line) {
    console.log(`${k}: MISSING`);
    continue;
  }
  const v = parseVal(line, k);
  console.log(
    `${k}: len=${v.length} looksConfigured=${v.length > 20}`,
  );
}
