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

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// The repository root is the directory holding this file.
const repoRoot = dirname(fileURLToPath(import.meta.url));
const source = join(repoRoot, "entry.png");

// Validate the image before copying anything: it must be a real PNG
// (its first 8 bytes are the PNG signature) and at most 1 MiB, the
// limits the competition sets. A bad file fails loudly instead of
// producing an output the grader would reject.
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const MAX_BYTES = 1048576;
const sourceBytes = readFileSync(source);
if (
  sourceBytes.length > MAX_BYTES ||
  !sourceBytes.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)
) {
  console.error(
    `entry.png is not a valid PNG of at most ${MAX_BYTES} bytes ` +
      `(got ${sourceBytes.length} bytes); refusing to write an output.`,
  );
  process.exit(1);
}

// Where the grader expects the finished image.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const target = join(outputDir, "entry.png");

// Make sure the destination folder exists, then copy byte for byte.
mkdirSync(outputDir, { recursive: true });
copyFileSync(source, target);

// Sanity check: the file we just wrote must actually be there.
if (!existsSync(target)) {
  throw new Error(`entry.png was not written to ${resolve(target)}`);
}
console.log(`Wrote ${resolve(target)}`);
