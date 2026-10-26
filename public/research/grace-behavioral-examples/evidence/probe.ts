#!/usr/bin/env bun
/**
 * Independent black-box observations of GRACE 4.2.1, not an implementation of typed examples.
 * Usage: bun probe.ts /path/to/grace-marketplace /path/to/new-output-directory
 * Both path arguments are required. Requires Bun >= 1.3.14, Git, and installed dependencies.
 * A descendant documentation-only checkout is allowed when evaluated source matches the base.
 * No repository source imports: every observation invokes the public CLI in a subprocess.
 * Each run writes its own complete fixture snapshots, argv, environment overrides, output,
 * exit codes, source identities, and command-run metadata beneath the output directory.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, realpathSync, writeFileSync } from "node:fs";
import path from "node:path";

const EXPECTED_SHA = "70f5ec4305bb2cc6ed82dea9470a3b810603874b";
const SOURCE_PATHS = ["src/", "package.json", "bun.lock"];
const SUBPROCESS_TIMEOUT_MS = 45_000;
assert(Bun.argv[2] && Bun.argv[3], "Usage: bun probe.ts /path/to/grace-marketplace /path/to/new-output-directory");
const repo = realpathSync(path.resolve(Bun.argv[2]!));
const requestedOut = path.resolve(Bun.argv[3]!);
mkdirSync(path.dirname(requestedOut), { recursive: true });
const out = path.join(realpathSync(path.dirname(requestedOut)), path.basename(requestedOut));
assert(!existsSync(out), `Use a new output directory; refusing to overwrite ${out}`);
mkdirSync(out, { recursive: true });
const fixtureRoot = path.join(out, "fixtures");
const cache = path.join(out, "cache");
const tmp = path.join(out, "tmp");
mkdirSync(tmp, { recursive: true });
const overrides: Record<string, string> = {
  XDG_CACHE_HOME: cache,
  TMPDIR: tmp,
  PATH: `${path.dirname(process.execPath)}${path.delimiter}${process.env.PATH ?? ""}`,
  NO_COLOR: "1",
  GIT_AUTHOR_NAME: "Independent GRACE Probe",
  GIT_AUTHOR_EMAIL: "grace-probe@example.invalid",
  GIT_COMMITTER_NAME: "Independent GRACE Probe",
  GIT_COMMITTER_EMAIL: "grace-probe@example.invalid",
};
if (process.platform !== "win32") overrides.SHELL = "/bin/sh";
const env = { ...process.env, ...overrides };
const cli = path.join(repo, "src/grace.ts");
const change = "C-REORDER-BOUNDARY";
const bundle = `.grace/changes/active/${change}`;
const verifyOnly = "<MustVerify><Module>M-INVENTORY</Module></MustVerify>";
const noopCommand = "bun run checks/noop.ts";
const behaviorCommand = "bun test checks/reorder.test.ts";
const commands: any[] = [];
const outcomes: any[] = [];
const metadata: any = { sourceCommitExpected: EXPECTED_SHA, evaluatedCodeBaseCommit: EXPECTED_SHA, evaluatedSourcePaths: SOURCE_PATHS, recordedAt: new Date().toISOString(), platform: process.platform, architecture: process.arch, bun: Bun.version, bunExecutable: process.execPath, nodeCompatibility: process.versions.node, subprocessTimeoutMs: SUBPROCESS_TIMEOUT_MS, timeoutScope: "Direct subprocess; no cross-platform descendant-process termination guarantee. A timeout stops the suite.", environmentOverrides: overrides, repo, outputDirectory: out };

function write(root: string, relative: string, content: string) {
  const file = path.join(root, relative);
  mkdirSync(path.dirname(file), { recursive: true });
  writeFileSync(file, content);
}
function read(root: string, relative: string) { return readFileSync(path.join(root, relative), "utf8"); }
function sha(text: string | Buffer) { return createHash("sha256").update(text).digest("hex"); }
function files(root: string, prefix = ""): Record<string, string> {
  if (!existsSync(root)) return {};
  const result: Record<string, string> = {};
  for (const entry of readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === ".git") continue;
    const relative = path.join(prefix, entry.name);
    if (entry.isDirectory()) Object.assign(result, files(path.join(root, entry.name), relative));
    else if (entry.isFile()) result[relative] = readFileSync(path.join(root, entry.name), "utf8");
  }
  return result;
}
function emptyDirectories(root: string, prefix = ""): string[] {
  const entries = readdirSync(root, { withFileTypes: true }).filter(entry => entry.name !== ".git");
  if (entries.length === 0) return prefix ? [prefix] : [];
  return entries.filter(entry => entry.isDirectory()).flatMap(entry => emptyDirectories(path.join(root, entry.name), path.join(prefix, entry.name))).sort();
}
function save() {
  write(out, "results.json", JSON.stringify({ metadata, outcomes, commands }, null, 2) + "\n");
}
async function run(label: string, argv: string[], cwd: string, snapshot = false) {
  const record: any = { label, argv, cwd, startedAt: new Date().toISOString(), environmentOverrides: overrides };
  if (snapshot) {
    const contents = files(cwd);
    record.fixtureSnapshot = `snapshots/${String(commands.length + 1).padStart(2, "0")}-${label}.json`;
    write(out, record.fixtureSnapshot, JSON.stringify(contents, null, 2) + "\n");
    record.fixtureSha256 = sha(JSON.stringify(contents));
    record.fixtureEmptyDirectories = emptyDirectories(cwd);
  }
  const proc = Bun.spawn({ cmd: argv, cwd, env, stdin: "ignore", stdout: "pipe", stderr: "pipe" });
  const readers = [proc.stdout.getReader(), proc.stderr.getReader()];
  const chunks: Uint8Array[][] = [[], []];
  const pumps = readers.map(async (reader, index) => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) chunks[index]!.push(value);
      }
    } catch (error) {
      record.streamReadError = error instanceof Error ? error.message : String(error);
    }
  });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const completed = Promise.all([...pumps, proc.exited]).then(values => ({ exitCode: values.at(-1) as number, timedOut: false }));
  const timeout = new Promise<{ exitCode: null; timedOut: true }>(resolve => {
    timer = setTimeout(() => {
      try { proc.kill("SIGKILL"); } catch { /* A concurrently exited child is already stopped. */ }
      for (const reader of readers) void reader.cancel().catch(() => {});
      resolve({ exitCode: null, timedOut: true });
    }, SUBPROCESS_TIMEOUT_MS);
  });
  const outcome = await Promise.race([completed, timeout]);
  clearTimeout(timer);
  Object.assign(record, { finishedAt: new Date().toISOString(), ...outcome, stdout: Buffer.concat(chunks[0]!).toString("utf8"), stderr: Buffer.concat(chunks[1]!).toString("utf8") });
  commands.push(record);
  save();
  assert(!record.timedOut, `${label}: exceeded ${SUBPROCESS_TIMEOUT_MS}ms; direct child killed and research stopped`);
  assert(!record.streamReadError, `${label}: incomplete subprocess output: ${record.streamReadError}`);
  return record;
}
async function checked(label: string, argv: string[], cwd: string) {
  const result = await run(label, argv, cwd);
  assert.equal(result.exitCode, 0, `${label}: ${result.stderr || result.stdout}`);
  return result;
}
function xmlText(value: string) { return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;"); }
function mustRun(command: string) { return `${verifyOnly}<MustPassCommand><Command>${xmlText(command)}</Command></MustPassCommand>`; }
function runtime(broken = true, note = "") {
  return `// START_MODULE_CONTRACT
//   PURPOSE: Decide when an inventory item needs replenishment.
//   SCOPE: A finite integer quantity and reorder threshold.
//   DEPENDS: none
//   LINKS: M-INVENTORY
//   ROLE: RUNTIME
//   MAP_MODE: EXPORTS
// END_MODULE_CONTRACT
// START_MODULE_MAP
//   needsReorder - Return true only when quantity is below threshold.
// END_MODULE_MAP
export function needsReorder(quantity: number, threshold: number): boolean {
  console.info("[Inventory][needsReorder][BLOCK_COMPARE] compare quantities");
  // START_BLOCK_COMPARE
  return quantity ${broken ? "<=" : "<"} threshold;
  // END_BLOCK_COMPARE
}
${note ? `// ${note}\n` : ""}`;
}
function spec(extra = "", affected = "<M-INVENTORY />") {
  return `<GraceChangeSpec graceVersion="4.0" status="approved"><${change}>
<Summary>Clarify the reorder boundary.</Summary>
<Goals><Goal>Reorder only below the configured threshold.</Goal></Goals>
<Constraints><Constraint>Retain the public boolean function.</Constraint></Constraints>
<NonGoals><NonGoal>Supplier ordering and stock persistence.</NonGoal></NonGoals>
<AcceptanceCriteria><Criterion>Quantity 12 with threshold 12 returns false.</Criterion></AcceptanceCriteria>
<AffectedAreas>${affected}</AffectedAreas>
<VerificationIntent><ExpectedCommand>${behaviorCommand}</ExpectedCommand><ExpectedEvidence>The boundary test passes.</ExpectedEvidence></VerificationIntent>
${extra}
</${change}></GraceChangeSpec>\n`;
}
function plan(target: string) {
  return `<GraceChangePlan graceVersion="4.0" status="approved"><${change}>
<IntentSummary>Enforce the reorder boundary.</IntentSummary>
<BaselineAssertions><MustExist><Value>M-INVENTORY</Value></MustExist></BaselineAssertions>
<TargetAssertions>${target}</TargetAssertions>
<DurableScope><GraphAnchors><M-INVENTORY /></GraphAnchors></DurableScope>
<ObservedWriteScope><File>src/inventory.ts</File></ObservedWriteScope>
<ImplementationPlan><T-001><Title>Check the boundary</Title><DependsOn></DependsOn><AcceptanceCriteria><Criterion>Equality never triggers a reorder.</Criterion></AcceptanceCriteria><Verification><Command>${behaviorCommand}</Command></Verification></T-001></ImplementationPlan>
</${change}></GraceChangePlan>\n`;
}
function fixture(name: string, target = verifyOnly, broken = true) {
  const root = path.join(fixtureRoot, name);
  assert(!existsSync(root));
  write(root, ".grace/context/requirements.xml", '<GraceRequirements graceVersion="4.0"><Summary>Reorder when stock is strictly below threshold.</Summary></GraceRequirements>\n');
  write(root, ".grace/context/technology.xml", '<GraceTechnology graceVersion="4.0"><Runtime>Bun</Runtime></GraceTechnology>\n');
  write(root, ".grace/context/principles.xml", '<GracePrinciples graceVersion="4.0"><Principle>Preserve exact boundary semantics.</Principle></GracePrinciples>\n');
  write(root, ".grace/context/deployment.xml", '<GraceDeployment graceVersion="4.0"><Applicability>not-applicable</Applicability><Reason>This isolated local research fixture is never deployed.</Reason></GraceDeployment>\n');
  write(root, ".grace/context/ux-guidelines.xml", '<GraceUXGuidelines graceVersion="4.0"><Applicability>not-applicable</Applicability><Reason>The fixture exposes only a function and automated tests.</Reason></GraceUXGuidelines>\n');
  write(root, ".grace/graph/index.xml", '<GraceGraphIndex graceVersion="4.0"><GraphDocuments><GD-INVENTORY><Path>graph/inventory.xml</Path><Owns><M-INVENTORY /></Owns></GD-INVENTORY></GraphDocuments></GraceGraphIndex>\n');
  write(root, ".grace/graph/inventory.xml", '<GraceGraphDocument graceVersion="4.0"><GD-INVENTORY><M-INVENTORY><Summary>Inventory reorder predicate.</Summary><Path>src/inventory.ts</Path></M-INVENTORY></GD-INVENTORY></GraceGraphDocument>\n');
  write(root, ".grace/verification/index.xml", '<GraceVerificationIndex graceVersion="4.0"><VerificationDocuments><VD-INVENTORY><Path>verification/inventory.xml</Path><Owns><V-M-INVENTORY /></Owns></VD-INVENTORY></VerificationDocuments></GraceVerificationIndex>\n');
  write(root, ".grace/verification/inventory.xml", `<GraceVerificationDocument graceVersion="4.0"><VD-INVENTORY><V-M-INVENTORY><Command>${behaviorCommand}</Command><Scenario>Equality must not trigger replenishment.</Scenario><Marker>[Inventory][needsReorder][BLOCK_COMPARE]</Marker></V-M-INVENTORY></VD-INVENTORY></GraceVerificationDocument>\n`);
  write(root, `${bundle}/spec.xml`, spec());
  write(root, `${bundle}/plan.xml`, plan(target));
  mkdirSync(path.join(root, ".grace/changes/archive"), { recursive: true });
  write(root, "src/inventory.ts", runtime(broken));
  write(root, "checks/noop.ts", 'console.log("NOOP_ONLY: no inventory function was imported or called");\n');
  write(root, "checks/reorder.test.ts", 'import { expect, test } from "bun:test";\nimport { needsReorder } from "../src/inventory";\ntest("equality keeps current inventory", () => expect(needsReorder(12, 12)).toBe(false));\ntest("a shortage triggers reorder", () => expect(needsReorder(11, 12)).toBe(true));\ntest("excess stock does not reorder", () => expect(needsReorder(13, 12)).toBe(false));\n');
  return root;
}
async function lint(label: string, root: string, expectedExit: number, code?: string, execute = false) {
  const argv = [process.execPath, cli, "lint", "--path", root, "--change", change, "--assertions", "target", "--format", "json", ...(execute ? ["--run-commands", "--command-timeout", "30"] : [])];
  const result = await run(label, argv, root, true);
  assert.equal(result.exitCode, expectedExit, `${label}: unexpected exit; inspect results.json`);
  const data = JSON.parse(result.stdout);
  result.issueCodes = data.issues.map((issue: any) => issue.code);
  if (code) assert(result.issueCodes.includes(code), `${label}: expected ${code}, got ${result.issueCodes}`);
  if (!expectedExit) assert.equal(data.summary.errors, 0, label);
  outcomes.push({ label, exitCode: result.exitCode, issueCodes: result.issueCodes, ...(!expectedExit ? { errors: data.summary.errors } : {}) });
  save();
  return result;
}
function logMetas() {
  return Object.entries(files(cache)).filter(([file]) => file.endsWith("meta.json")).map(([file, text]) => ({ file: path.join(cache, file), data: JSON.parse(text) }));
}
function latestMeta(root: string) {
  const matched = logMetas().filter(entry => entry.data.projectRoot === root);
  assert(matched.length > 0, `No run metadata found for ${root}`);
  return matched.sort((a, b) => a.data.startedAt.localeCompare(b.data.startedAt)).at(-1)!;
}
function assertBoundaryFailure(output: string) {
  assert.match(output, /Expected:\s*false/);
  assert.match(output, /Received:\s*true/);
  assert.match(output, /\(fail\) equality keeps current inventory/);
  assert.match(output, /\b2 pass\b/);
  assert.match(output, /\b1 fail\b/);
  assert.match(output, /Ran 3 tests across 1 file\./);
}
function assertNativeBoundaryFailure(root: string) {
  const meta = latestMeta(root).data;
  assert.equal(meta.status, "failed");
  assert.equal(meta.commands.length, 1);
  const command = meta.commands[0];
  assert.equal(command.command, behaviorCommand);
  assert.equal(command.exitCode, 1);
  assert.equal(command.timedOut, false);
  assert.equal(command.skipped, false);
  assertBoundaryFailure(readFileSync(command.logFile, "utf8"));
}
async function commit(root: string, message: string) {
  const hooks = path.join(out, "empty-hooks");
  mkdirSync(hooks, { recursive: true });
  for (const argv of [["git", "init", "-b", "probe"], ["git", "add", "."], ["git", "-c", "commit.gpgsign=false", "-c", `core.hooksPath=${hooks}`, "commit", "-m", message]]) {
    const result = await run(`git-${commands.length}`, argv, root);
    assert.equal(result.exitCode, 0, result.stderr);
  }
}

try {
  const source = await checked("source-head", ["git", "rev-parse", "HEAD"], repo);
  metadata.sourceCommitActual = source.stdout.trim();
  await checked("source-base-present", ["git", "cat-file", "-e", `${EXPECTED_SHA}^{commit}`], repo);
  await checked("source-base-is-ancestor", ["git", "merge-base", "--is-ancestor", EXPECTED_SHA, "HEAD"], repo);
  await checked("evaluated-source-identical-to-base", ["git", "diff", "--no-ext-diff", "--no-textconv", "--exit-code", EXPECTED_SHA, "--", ...SOURCE_PATHS], repo);
  const untracked = await checked("evaluated-source-untracked", ["git", "ls-files", "--others", "--", ...SOURCE_PATHS], repo);
  assert.equal(untracked.stdout.trim(), "", "Untracked source files could alter behavior; remove them before running this pinned-source study");
  metadata.sourceMatchesBase = true;
  metadata.sourceWorkingTree = (await checked("source-status", ["git", "status", "--porcelain"], repo)).stdout;
  metadata.gitVersion = (await checked("git-version", ["git", "--version"], repo)).stdout.trim();
  metadata.packageVersion = JSON.parse(read(repo, "package.json")).version;
  metadata.lockfileSha256 = existsSync(path.join(repo, "bun.lock")) ? sha(read(repo, "bun.lock")) : null;
  metadata.cliVersion = (await checked("cli-version", [process.execPath, cli, "--version"], repo)).stdout.trim();

  const structural = fixture("structural");
  await lint("01-valid-structure-broken-behavior", structural, 0);
  const behavior = await run("02-direct-negative-behavior-control", [process.execPath, "test", "checks/reorder.test.ts"], structural, true);
  assert.equal(behavior.exitCode, 1);
  assertBoundaryFailure(behavior.stderr);
  outcomes.push({ label: behavior.label, exitCode: behavior.exitCode, observation: "The independent boundary oracle fails while valid structural lint passes." });
  await lint("03-mustverify-runcommands-does-not-run-verification-command", structural, 0, undefined, true);
  assert.equal(logMetas().length, 0, "MustVerify alone should not dispatch V-M-* Command");

  write(structural, `${bundle}/spec.xml`, spec('<Examples><Example label="boundary" expected="true"><Input>12, 12</Input><Expected>true</Expected><Claim>This intentionally contradicts AcceptanceCriteria.</Claim></Example></Examples>'));
  await lint("04-unknown-examples-contradictory-value-accepted", structural, 0);
  write(structural, `${bundle}/spec.xml`, spec('<Examples><Example><Input>12, 12</Input><Expected>false</Expected></Example></Examples>'));
  await lint("05-unknown-examples-corrected-value-accepted", structural, 0);
  write(structural, `${bundle}/spec.xml`, spec('<Examples><Example></Examples>'));
  await lint("06-malformed-xml-control", structural, 1, "xml.parse");
  write(structural, `${bundle}/spec.xml`, spec('<Goals><Goal>Duplicate required section.</Goal></Goals>'));
  await lint("07-duplicate-required-section-control", structural, 1, "change.spec-duplicate-section");
  write(structural, `${bundle}/spec.xml`, spec());
  write(structural, `${bundle}/examples.xml`, '<GraceBehaviorExamples graceVersion="4.0"><Example><Input>12,12</Input><Expected>false</Expected></Example></GraceBehaviorExamples>\n');
  await lint("08-unexpected-companion-xml-rejected", structural, 1, "change.unexpected-file");

  const companion = fixture("design-context");
  write(companion, `${bundle}/design-context.xml`, `<GraceChangeDesignContext graceVersion="4.0"><Change>${change}</Change><Examples><Example><Input>12,12</Input><Expected>false</Expected></Example></Examples></GraceChangeDesignContext>\n`);
  await lint("09-recognized-design-companion-with-prose-examples", companion, 0);
  const anchor = fixture("anchor-attributes");
  write(anchor, `${bundle}/spec.xml`, spec("", '<M-INVENTORY type="runtime" />'));
  await lint("10-semantic-anchor-attribute-rejected", anchor, 1, "artifact.semantic-anchor-has-attributes");
  write(anchor, `${bundle}/spec.xml`, spec('<Examples><Example module="M-INVENTORY"><Expected>false</Expected></Example></Examples>'));
  await lint("11-semantic-anchor-in-ordinary-attribute-rejected", anchor, 1, "artifact.semantic-anchor-attribute");
  write(anchor, `${bundle}/spec.xml`, spec('<Examples><Example label="boundary"><M-INVENTORY /><Expected>false</Expected></Example></Examples>'));
  await lint("12-semantic-anchor-as-child-accepted", anchor, 0);
  write(anchor, `${bundle}/plan.xml`, plan("<MustVerify><Module>M-ABSENT</Module></MustVerify>"));
  await lint("13-mustverify-missing-record-control", anchor, 1, "assertion.MustVerify");

  const noop = fixture("noop-gate", mustRun(noopCommand));
  await lint("14-command-without-opt-in-rejected", noop, 1, "assertion.command-not-evaluated");
  await lint("15-noop-command-passes-with-broken-behavior", noop, 0, undefined, true);
  assert.equal(latestMeta(noop).data.commands[0].command, noopCommand);
  const real = fixture("behavioral-gate", mustRun(behaviorCommand));
  await lint("16-behavioral-command-rejects-broken-boundary", real, 1, "assertion.MustPassCommand", true);
  assertNativeBoundaryFailure(real);
  write(real, "src/inventory.ts", runtime(false));
  await lint("17-same-behavioral-command-accepts-correct-boundary", real, 0, undefined, true);
  assert.equal(latestMeta(real).data.commands[0].exitCode, 0);

  const freshness = fixture("freshness", mustRun(behaviorCommand), false);
  await commit(freshness, "Seed complete independent fixture");
  await lint("18-clean-tree-passing-run", freshness, 0, undefined, true);
  const clean = latestMeta(freshness);
  assert.equal(clean.data.dirty, false);
  assert.match(clean.data.head, /^[0-9a-f]{40}$/);
  write(freshness, "src/inventory.ts", runtime(true));
  const status = await run("19-status-after-behavior-regression", [process.execPath, cli, "status", "--path", freshness, "--format", "json", "--fail-on", "errors"], freshness, true);
  assert.equal(status.exitCode, 0);
  const statusData = JSON.parse(status.stdout);
  assert(statusData.observedDrift.changedFiles.includes("src/inventory.ts"));
  assert(statusData.changes[0].derivedStates.includes("ready-to-execute"));
  outcomes.push({ label: status.label, exitCode: 0, observation: "Status records scoped source drift but does not rerun the behavioral target or validate prior evidence freshness.", observedDrift: statusData.observedDrift, derivedStates: statusData.derivedStates, changes: statusData.changes });
  await lint("20-prior-pass-does-not-satisfy-command-opt-in", freshness, 1, "assertion.command-not-evaluated");
  await lint("21-rerun-rejects-regression-despite-prior-pass", freshness, 1, "assertion.MustPassCommand", true);
  assertNativeBoundaryFailure(freshness);
  assert.equal(JSON.parse(readFileSync(clean.file, "utf8")).status, "passed", "Historical evidence should remain historical, not be rewritten");
  write(freshness, "src/inventory.ts", runtime(false, "Dirty content version A"));
  const hashA = sha(read(freshness, "src/inventory.ts"));
  await lint("22-dirty-content-version-a-passes", freshness, 0, undefined, true);
  const dirtyA = latestMeta(freshness);
  write(freshness, "src/inventory.ts", runtime(false, "Dirty content version B"));
  const hashB = sha(read(freshness, "src/inventory.ts"));
  await lint("23-dirty-content-version-b-passes", freshness, 0, undefined, true);
  const dirtyB = latestMeta(freshness);
  assert.notEqual(hashA, hashB);
  assert.deepEqual({ head: dirtyA.data.head, branch: dirtyA.data.branch, dirty: dirtyA.data.dirty }, { head: dirtyB.data.head, branch: dirtyB.data.branch, dirty: dirtyB.data.dirty });
  assert.equal(dirtyA.data.dirty, true);
  outcomes.push({ label: "24-two-distinct-dirty-trees-share-vcs-identity", hashes: [hashA, hashB], vcsIdentity: { head: dirtyA.data.head, branch: dirtyA.data.branch, dirty: dirtyA.data.dirty }, metadataKeys: Object.keys(dirtyA.data), observation: "Different comment bytes yield different source hashes while executable behavior stays identical; HEAD + branch + dirty flag does not identify exact uncommitted bytes." });

  const mutation = fixture("mutation-during-command", mustRun("bun run checks/mutate-after-check.ts"), false);
  write(mutation, "checks/mutate-after-check.ts", 'import { needsReorder } from "../src/inventory";\nif (needsReorder(12, 12) !== false) throw new Error("Initial boundary was wrong");\nconst file = Bun.file("src/inventory.ts");\nawait Bun.write(file, (await file.text()).replace("quantity < threshold", "quantity <= threshold"));\nconsole.log("Boundary checked, then source deliberately changed before command exit");\n');
  await commit(mutation, "Seed fixture for within-command mutation control");
  await lint("25-source-mutating-command-starts-clean-and-passes", mutation, 0, undefined, true);
  const mutationMeta = latestMeta(mutation);
  assert.equal(mutationMeta.data.dirty, false);
  const afterMutation = await checked("26-git-dirtiness-after-command", ["git", "status", "--porcelain"], mutation);
  assert.match(afterMutation.stdout, /src\/inventory\.ts/);
  const mutationBehavior = await run("27-post-run-behavior-control-fails", [process.execPath, "test", "checks/reorder.test.ts"], mutation, true);
  assert.equal(mutationBehavior.exitCode, 1);
  assertBoundaryFailure(mutationBehavior.stderr);
  outcomes.push({ label: "28-metadata-captures-start-not-post-command-tree", recordedDirty: mutationMeta.data.dirty, gitStatusAfter: afterMutation.stdout, postRunBehaviorExit: mutationBehavior.exitCode, observation: "A passing child and clean starting identity do not guarantee unchanged source after that child exits." });

  await checked("evaluated-source-still-identical-at-end", ["git", "diff", "--no-ext-diff", "--no-textconv", "--exit-code", EXPECTED_SHA, "--", ...SOURCE_PATHS], repo);
  const untrackedAfter = await checked("evaluated-source-still-no-untracked-at-end", ["git", "ls-files", "--others", "--", ...SOURCE_PATHS], repo);
  assert.equal(untrackedAfter.stdout.trim(), "", "Untracked source files appeared during the study");
  metadata.completedAt = new Date().toISOString();
  metadata.assertionSuite = "passed";
  metadata.commandCount = commands.length;
  metadata.observationCount = outcomes.length;
  write(out, "run-metadata.json", JSON.stringify(logMetas(), null, 2) + "\n");
  save();
  const table = outcomes.map(item => `| ${item.label} | ${item.exitCode ?? "comparison"} | ${(item.issueCodes ?? []).join(", ") || item.observation || "0 errors"} |`).join("\n");
  write(out, "REPORT.md", `# Independent GRACE CLI observations\n\nEvaluated code base: \`${metadata.evaluatedCodeBaseCommit}\`; checkout: \`${metadata.sourceCommitActual}\`; package ${metadata.packageVersion}; Bun ${Bun.version}; ${metadata.platform}/${metadata.architecture}.\n\nThe observation suite passed. It asserts observed behavior at this pinned commit; this is research, not a declaration that every observation is a defect or a normative promise for future versions.\n\n## Reproduce\n\nInstall the checkout dependencies with \`bun install --frozen-lockfile\`, then run:\n\n\`\`\`sh\nbun probe.ts /path/to/grace-marketplace /path/to/new-output-directory\n\`\`\`\n\nThe script permits the pinned commit or a descendant checkout, and requires src/, package.json, and bun.lock to match the pinned base exactly, with no untracked source files. Each command has complete argv, cwd, output, exit code, and environment overrides in [results.json](results.json). Complete fixture contents immediately before each relevant command are under [snapshots](snapshots); live fixture projects are under [fixtures](fixtures). [run-metadata.json](run-metadata.json) captures native GRACE command-run metadata.\n\n## Observations\n\n| Probe | Exit | Observation or diagnostic |\n| --- | --- | --- |\n${table}\n\n## Interpretation\n\n1. Well-formed unrecognized Examples sections are tolerated as ordinary spec XML. Correcting their expected value changes no demonstrated gate behavior. Malformed XML, duplicate required sections, and unsupported companion XML are rejected. Therefore syntactic acceptance cannot be treated as a typed or executable example contract.\n2. MustVerify resolves a verification record. A Command inside that record, VerificationIntent, or a task Verification section is not dispatched by MustVerify, including with --run-commands. MustPassCommand dispatches the explicitly chosen command; a no-op passes while a real boundary oracle fails on the same bad implementation. Correcting the implementation makes that same oracle pass.\n3. Existing semantic-anchor discipline also traverses unknown Examples content: an anchor must be an attribute-free tag, and an ordinary attribute cannot carry an anchor identifier. Ordinary attributes such as label or expected remain accepted.\n4. Run logs describe historical executions. A prior pass is not used to satisfy a later MustPassCommand without opt-in. Re-running detects a regression. Status can report explained source drift and ready-to-execute without certifying target behavior or a historical pass.\n5. The recorded HEAD, branch, and dirty flag distinguish clean from dirty starts but do not bind exact dirty contents. Two dirty trees differing only in comment bytes produced the same identity tuple; their executable behavior stayed identical. A command that checks then changes source can finish successfully with metadata still identifying the clean starting tree. This is a limit on what the evidence establishes, not proof that GRACE claims to attest post-command contents.\n\n## What changed my understanding\n\nThe positive and negative controls show a narrower and more useful boundary than “CLI understands examples” or “CLI cannot verify behavior.” It checks structural invariants and can run decisive behavioral oracles when they are explicitly selected. Its evidence is scoped to those commands and their observed exits. A future typed example mechanism would need an explicit validation/execution contract and evidence binding; placing data in accepted XML is insufficient.\n\n## Limits\n\nThe experiment covers synthetic finite integer boundary behavior, selected lint target mode, and status at one version on one platform. It does not measure agent adherence to skills, parser support for every possible extension, parallel execution, external-system effects, or cross-platform shell behavior. It does not change marketplace source or implement a typed-case feature.\n`);
  console.log(JSON.stringify({ assertionSuite: "passed", commandCount: commands.length, observationCount: outcomes.length, report: path.join(out, "REPORT.md") }, null, 2));
} catch (error) {
  metadata.assertionSuite = "failed";
  metadata.failure = error instanceof Error ? { message: error.message, stack: error.stack } : String(error);
  save();
  console.error(error);
  process.exitCode = 1;
}
