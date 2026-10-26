#!/usr/bin/env bun
/**
 * Export a completed probe.ts run as two compact, reviewable research evidence files.
 * Usage: bun export-results.ts /path/to/raw-run /path/to/new-public-directory
 * This does not rerun the study or publish anything to a network service.
 * Fixture content is preserved byte-for-byte; machine paths in observations/logs are replaced
 * with declared placeholders. All subprocess output, including negative controls, is retained.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import path from "node:path";

assert(Bun.argv[2] && Bun.argv[3], "Usage: bun export-results.ts /path/to/raw-run /path/to/new-public-directory");
const input = realpathSync(path.resolve(Bun.argv[2]!));
const requestedOutput = path.resolve(Bun.argv[3]!);
mkdirSync(path.dirname(requestedOutput), { recursive: true });
const output = path.join(realpathSync(path.dirname(requestedOutput)), path.basename(requestedOutput));
assert(!existsSync(output), `Refusing to overwrite ${output}`);
const raw = JSON.parse(readFileSync(path.join(input, "results.json"), "utf8"));
assert.equal(raw.metadata.assertionSuite, "passed", "Only completed, passing research runs may be exported");
assert.equal(raw.metadata.sourceMatchesBase, true, "Use the current source-identity-checking probe script");
const native = JSON.parse(readFileSync(path.join(input, "run-metadata.json"), "utf8"));
const sha = (value: string) => createHash("sha256").update(value).digest("hex");
const replacements = new Map<string, string>();
function addReplacement(source: string, placeholder: string) {
  if (!source) return;
  const variants = new Set([source, source.replaceAll("\\", "/")]);
  // macOS commonly returns /private-prefixed paths for a /tmp or /var alias.
  if (source.startsWith("/private/")) variants.add(source.slice("/private".length));
  for (const variant of variants) {
    replacements.set(variant, placeholder);
    replacements.set(JSON.stringify(variant).slice(1, -1), placeholder);
  }
}
addReplacement(raw.metadata.repo, "<REPO>");
addReplacement(raw.metadata.outputDirectory, "<RUN_DIR>");
addReplacement(raw.metadata.bunExecutable, "<BUN>");
addReplacement(homedir(), "<HOME>");
const orderedReplacements = [...replacements].sort((a, b) => b[0].length - a[0].length);
function normalizeText(value: string): string {
  for (const [source, placeholder] of orderedReplacements) value = value.replaceAll(source, placeholder);
  return value;
}
function normalize(value: any): any {
  if (typeof value === "string") return normalizeText(value);
  if (Array.isArray(value)) return value.map(normalize);
  if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [normalizeText(key), normalize(child)]));
  return value;
}
function safeRunFile(relative: string) {
  const resolved = realpathSync(path.resolve(input, relative));
  const rel = path.relative(input, resolved);
  assert(rel && !rel.startsWith("..") && !path.isAbsolute(rel), `Run evidence must remain beneath its input directory: ${relative}`);
  return resolved;
}
function safeNativeLog(file: string) {
  const resolved = realpathSync(file);
  const rel = path.relative(input, resolved);
  assert(rel && !rel.startsWith("..") && !path.isAbsolute(rel), "Native log lies outside this raw run");
  return resolved;
}

const blobs: Record<string, string> = {};
const manifests: Record<string, { rawFixtureSha256: string; emptyDirectories: string[]; files: Record<string, string> }> = {};
const snapshots: Record<string, string> = {};
for (const command of raw.commands) {
  if (!command.fixtureSnapshot) continue;
  const content: Record<string, string> = JSON.parse(readFileSync(safeRunFile(command.fixtureSnapshot), "utf8"));
  const rawFixtureSha256 = sha(JSON.stringify(content));
  assert.equal(rawFixtureSha256, command.fixtureSha256, `${command.label}: fixture manifest hash differs from the recorded input`);
  const references: Record<string, string> = {};
  for (const [relative, text] of Object.entries(content)) {
    assert(!path.isAbsolute(relative) && !relative.split(/[\\/]/).includes(".."), "Fixture paths must be project-relative");
    assert.equal(normalizeText(text), text, "A fixture contains a machine path; refuse to alter semantic inputs while exporting");
    const hash = sha(text);
    if (hash in blobs) assert.equal(blobs[hash], text, "Unexpected content hash collision");
    blobs[hash] = text;
    references[relative] = hash;
  }
  assert(Array.isArray(command.fixtureEmptyDirectories), "Use a probe run that records empty fixture directories");
  for (const relative of command.fixtureEmptyDirectories) assert(!path.isAbsolute(relative) && !relative.split(/[\\/]/).includes(".."), "Empty fixture directories must be project-relative");
  const manifest = { rawFixtureSha256, emptyDirectories: command.fixtureEmptyDirectories, files: references };
  const manifestHash = sha(JSON.stringify(manifest));
  manifests[manifestHash] = manifest;
  snapshots[command.fixtureSnapshot] = manifestHash;
}

const normalization = {
  purpose: "Research observations, not product certification or a typed-case implementation.",
  placeholders: {
    "<REPO>": "Canonical checkout root used for the experiment.",
    "<RUN_DIR>": "Canonical raw evidence root, including fixture projects and isolated cache.",
    "<BUN>": "Bun executable recorded by the experiment.",
    "<HOME>": "The exporter's home directory, if present in captured text.",
  },
  transformations: [
    "Only known machine paths are replaced in argv, cwd, output, observation metadata, and native logs; all other output text and all exit codes are retained.",
    "Inherited PATH is omitted. Remaining identical environment overrides are recorded once in metadata, rather than repeated for every subprocess.",
    "Fixture file contents are not normalized: publication fails if that would be necessary. Identical content and identical manifests are deduplicated.",
    "Timestamps, process IDs, durations, Git identities, runtime versions, content hashes, and positive/negative outcomes are preserved from the run.",
  ],
  fixtureHashDefinition: "A blob key is SHA-256 of the original UTF-8 file text. A rawFixtureSha256 is SHA-256 of JSON.stringify of the ordered relative-path-to-text object before the command. Manifest files retain that insertion order, so reconstructing the object from blobs reproduces the recorded hash.",
  manifestHashDefinition: "A manifest key is SHA-256 of JSON.stringify({rawFixtureSha256, emptyDirectories, files}), where files maps project-relative paths to blob keys in original order. Recreate the recorded empty directories as well as parent directories for files. Git internals are excluded; the recorded Git commands recreate the fixture history.",
  observationHashScope: "Source file hashes in observations (including probe 24) remain hashes of the original exact bytes; paths are not included in those hashes.",
  pathAudit: "Export rejects remaining known private roots and common Unix/Windows user or temporary directory paths. Inspect before publishing on another environment.",
};
const publishedMetadata = structuredClone(raw.metadata);
assert(publishedMetadata.environmentOverrides && typeof publishedMetadata.environmentOverrides.PATH === "string");
delete publishedMetadata.environmentOverrides.PATH;
const publishedCommands = raw.commands.map((command: any) => {
  assert.deepEqual(command.environmentOverrides, raw.metadata.environmentOverrides, "Per-command environment differs; exporter must represent the difference explicitly");
  const result = { ...command };
  delete result.environmentOverrides;
  delete result.fixtureEmptyDirectories;
  return result;
});
const nativeRuns = native.map((entry: any) => ({
  ...entry,
  commandLogs: entry.data.commands.filter((command: any) => command.logFile).map((command: any) => ({
    file: command.logFile,
    output: readFileSync(safeNativeLog(command.logFile), "utf8"),
  })),
}));
const publicResults = normalize({ schemaVersion: "1.0.0", normalization, metadata: publishedMetadata, outcomes: raw.outcomes, commands: publishedCommands, nativeRuns });
const publicFixtures = { schemaVersion: "1.0.0", normalization: "See results.json normalization. These complete fixture input bytes are unchanged; snapshots resolve to deduplicated manifests and UTF-8 content blobs.", snapshots, manifests, blobs };
const resultsText = JSON.stringify(publicResults, null, 2) + "\n";
const fixturesText = JSON.stringify(publicFixtures, null, 2) + "\n";
const all = resultsText + fixturesText;
for (const [privateValue] of replacements) {
  if (!privateValue) continue;
  assert(!all.includes(privateValue), "A private path remains after normalization");
}
assert(!/(?:\/(?:Users|home)\/|\/private\/(?:tmp|var)\/|\/(?:tmp|var\/folders)\/|[A-Za-z]:\\\\Users\\\\)/.test(all), "Unrecognized private user/temp path remains; extend explicit normalization before publishing");
const bytes = Buffer.byteLength(resultsText) + Buffer.byteLength(fixturesText);
assert(bytes <= 150 * 1024, `Export is ${bytes} bytes; review size before publishing (limit 150 KiB)`);
mkdirSync(output);
writeFileSync(path.join(output, "results.json"), resultsText);
writeFileSync(path.join(output, "fixtures.json"), fixturesText);
console.log(JSON.stringify({ output, commandCount: publicResults.commands.length, observationCount: publicResults.outcomes.length, nativeRunCount: publicResults.nativeRuns.length, snapshotCount: Object.keys(snapshots).length, uniqueManifestCount: Object.keys(manifests).length, uniqueFileContentCount: Object.keys(blobs).length, totalBytes: bytes, resultsSha256: sha(resultsText), fixturesSha256: sha(fixturesText) }, null, 2));
