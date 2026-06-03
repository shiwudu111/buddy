import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);

if (files.length === 0) {
  console.error("Usage: node tools/check-utf8-docs.mjs <file...>");
  process.exit(2);
}

const mojibakePattern = /[绔戠鍙€]|(?:Ã.|Â.)/g;
let hasProblem = false;

for (const file of files) {
  const fullPath = path.resolve(file);
  const content = fs.readFileSync(fullPath, "utf8");
  const replacementCount = [...content].filter((char) => char === "\uFFFD").length;
  const mojibakeCount = (content.match(mojibakePattern) ?? []).length;
  const ok = replacementCount === 0 && mojibakeCount === 0;

  console.log(
    `${ok ? "OK" : "WARN"} ${file} chars=${content.length} replacement=${replacementCount} mojibake=${mojibakeCount}`
  );

  if (!ok) {
    hasProblem = true;
  }
}

process.exit(hasProblem ? 1 : 0);
