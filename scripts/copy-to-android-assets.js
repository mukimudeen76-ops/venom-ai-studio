/**
 * Stage the dist-android/ bundle into the Gradle assets folder so the
 * Android app can load content.js / injected.js / sandbox.html / index.html via
 * WebViewAssetLoader at runtime.
 */
import { resolve, dirname, relative, join } from "path";
import { fileURLToPath } from "url";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  statSync,
  copyFileSync,
  rmSync,
} from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, "..");
const srcDir = resolve(repoRoot, "dist-android");
const destDirBds = resolve(repoRoot, "android/app/src/main/assets/bds");
const destDirRoot = resolve(repoRoot, "android/app/src/main/assets");

if (!existsSync(srcDir)) {
  console.error(`[copy-to-android-assets] ${srcDir} does not exist. Run "npm run build:android" first.`);
  process.exit(1);
}

if (existsSync(destDirBds)) {
  rmSync(destDirBds, { recursive: true, force: true });
}
mkdirSync(destDirBds, { recursive: true });
mkdirSync(destDirRoot, { recursive: true });

let copied = 0;

function copyTree(src, dest) {
  const stats = statSync(src);
  if (stats.isDirectory()) {
    if (!existsSync(dest)) mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) {
      copyTree(join(src, entry), join(dest, entry));
    }
  } else {
    copyFileSync(src, dest);
    copied += 1;
  }
}

// 1. Copy to assets/bds/
copyTree(srcDir, destDirBds);

// 2. Copy root bundle files to assets/ so root path handler finds index.html immediately
for (const entry of readdirSync(srcDir)) {
  const fullSrc = join(srcDir, entry);
  const fullDest = join(destDirRoot, entry);
  if (statSync(fullSrc).isFile()) {
    copyFileSync(fullSrc, fullDest);
    copied += 1;
  }
}

console.log(`[copy-to-android-assets] Copied ${copied} files -> ${relative(repoRoot, destDirBds)} & ${relative(repoRoot, destDirRoot)}`);
