import { readdirSync, readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join, relative } from "node:path";

const root = process.cwd();
const ignoredDirs = new Set([
  ".claude",
  ".git",
  ".next",
  ".playwright-cli",
  ".wrangler",
  "coverage",
  "node_modules",
  "out",
]);

const ignoredFiles = new Set([
  "package-lock.json",
]);

const secretPatterns = [
  {
    name: "API key-like token",
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/,
  },
  {
    name: "Anthropic API key variable with value",
    pattern: /(?:^|\n)ANTHROPIC_API_KEY[^\S\r\n]*=[^\S\r\n]*[^\s"'`]+/,
  },
  {
    name: "OpenRouter API key variable with value",
    pattern: /(?:^|\n)OPENROUTER_API_KEY[^\S\r\n]*=[^\S\r\n]*[^\s"'`]+/,
  },
];

const findings = [];

function isIgnoredPath(path) {
  return path.split(/[\\/]/).some((part) => ignoredDirs.has(part));
}

function scanFile(path) {
  const name = path.split(/[\\/]/).pop();
  if (ignoredFiles.has(name)) return;

  let content;
  try {
    content = readFileSync(path, "utf8");
  } catch {
    return;
  }

  for (const { name: patternName, pattern } of secretPatterns) {
    if (pattern.test(content)) {
      findings.push({ file: relative(root, path), pattern: patternName });
    }
  }
}

function walkFallback(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;

    const path = join(dir, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      walkFallback(path);
      continue;
    }

    if (stats.isFile()) {
      scanFile(path);
    }
  }
}

try {
  const files = execFileSync(
    "git",
    ["ls-files", "--cached", "--others", "--exclude-standard"],
    { cwd: root, encoding: "utf8" }
  )
    .split(/\r?\n/)
    .filter(Boolean);

  for (const file of files) {
    if (isIgnoredPath(file)) continue;
    scanFile(join(root, file));
  }
} catch {
  walkFallback(root);
}

if (findings.length > 0) {
  console.error("Potential secrets found. Review these files before commit:");
  for (const finding of findings) {
    console.error(`- ${finding.file} (${finding.pattern})`);
  }
  process.exit(1);
}

console.log("No secret-like tokens found in tracked workspace paths.");
