// news-image-20261122 — entry program.
//
// The image is drawn once, ahead of time, and shipped in this repository
// as entry.png. At grade time this program has no network and must be
// deterministic, so all it does is place a copy of that image at the
// location the grader reads: $MAKEFUN_OUTPUT_DIR/entry.png (or
// /output/entry.png when the variable is unset).
//
// Run it locally with:
//   MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The repository root is the directory holding this file.
const repoRoot = dirname(fileURLToPath(import.meta.url));

// Where the grader expects the finished image.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outputDir, "entry.png");

// Make sure the destination folder exists, then copy byte for byte.
mkdirSync(outputDir, { recursive: true });
copyFileSync(join(repoRoot, "entry.png"), target);

// Sanity check: the file we just wrote must actually be there.
if (!existsSync(target)) {
  throw new Error(`entry.png was not written to ${resolve(target)}`);
}
console.log(`Wrote ${resolve(target)}`);
