import { readFileSync, writeFileSync } from "fs";

for (const loc of ["es", "de", "fr", "it", "pt", "ru", "ar-AE"]) {
  const p = `src/i18n/locales/${loc}.ts`;
  let c = readFileSync(p, "utf8");
  const next = c.replace(
    /(linkHome: "[^"]*",)\r?\n  \},\r?\n  \},\r?\n  book:/,
    "$1\n  },\n  book:",
  );
  if (next === c) console.log(loc, "no change");
  else {
    writeFileSync(p, next);
    console.log(loc, "fixed");
  }
}
