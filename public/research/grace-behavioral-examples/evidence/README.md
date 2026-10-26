# Reproduction and recorded evidence

The characterization suite contains **26 asserted observations**, with **42 subprocesses** including source-identity checks and synthetic Git setup. The recorded run passed on **macOS arm64, Bun 1.3.14**. Negative controls intentionally exit 1; the overall suite passes only when those failures have the expected cause.

The tested implementation and lockfile match upstream `70f5ec4305bb2cc6ed82dea9470a3b810603874b`, package 4.2.1, grammar 4.0. These are observations about that baseline, not promises that future implementations must preserve every limitation.

## Files

| File | Contents |
|---|---|
| [probe.ts](probe.ts) | Complete independent fixture generator and subprocess assertions |
| [export-results.ts](export-results.ts) | Deterministic normalization/deduplication of a completed local run; no network publication |
| [results.json](results.json) | Every command, cwd, output, exit, observation, source check, native run record and native command log |
| [fixtures.json](fixtures.json) | Complete pre-command fixture contents, deduplicated by SHA-256 |
| [validation.json](validation.json) | Repository validation summary and final artifact checks |

For a command in `results.json`, follow `fixtureSnapshot` into `fixtures.json.snapshots`, then its manifest in `manifests`, then each file's content in `blobs`. Recreate `emptyDirectories` as well as file parent directories. File bytes are unchanged. Reconstructing the manifest's ordered path-to-content object and hashing its `JSON.stringify` reproduces `rawFixtureSha256`. Git internals are excluded; the recorded setup commands recreate the fixture history.

## Run it

Run these commands from the extracted package root, where `evidence/probe.ts` and the top-level `README.md` exist. Use **new directories**. Bun 1.3.14 or newer and Git are required. These are POSIX examples; adapt directory syntax for your environment.

```sh
git clone https://github.com/osovv/grace-marketplace.git ../grace-marketplace-baseline
git -C ../grace-marketplace-baseline checkout --detach 70f5ec4305bb2cc6ed82dea9470a3b810603874b
(cd ../grace-marketplace-baseline && bun install --frozen-lockfile --ignore-scripts)
bun evidence/probe.ts ../grace-marketplace-baseline ../grace-observation-run
bun evidence/export-results.ts ../grace-observation-run ../grace-observation-public
```

Cloning and dependency installation require network access unless those inputs are already available locally. Packaging this archive did not perform a new network run, agent benchmark, or CLI characterization experiment. To use an existing checkout, substitute its path as the first argument to `probe.ts`; keep the script path relative to the extracted package root.

Both scripts require **two positional arguments**. The probe receives checkout path and a new raw-output directory. The exporter receives the completed raw run and a new normalized-output directory. It writes `results.json` and `fixtures.json`; neither script publishes to the network.

The harness canonicalizes filesystem paths and refuses to overwrite an existing run. It allows the baseline or a descendant checkout only when `src/`, `package.json`, and `bun.lock` match the baseline, with no untracked source files under those protected paths. It checks those surfaces before and after the run and verifies ancestry. This permits methodology-only descendants; their skill changes are outside the mechanism probe's scope. Use the pinned baseline above to reproduce the recorded implementation context. Dependencies must be installed from the lockfile; the script does not attest an arbitrary pre-existing `node_modules` directory.

All CLI invocations use the checkout's `src/grace.ts`. Every fixture, local Git repository, cache and generated result stays below the supplied run directory. Each subprocess has a 45-second bound; command execution has a 30-second CLI timeout. The harness does not claim cross-platform process-tree containment. The recorded run validates macOS only; Linux and Windows reproduction remain unverified here.

## Observations and controls

| Probe labels | Observation | Control / limit |
|---|---|---|
| 01–03 | Structural lint and `MustVerify` pass while the boundary implementation is wrong | Direct independent test fails; `--run-commands` does not turn a verification description into a selected command assertion |
| 04–09 | Ordinary contradictory `Examples` data is accepted without interpreting its expectation; an unsupported companion file is rejected | Correcting the expected value leaves lint unchanged; malformed XML and duplicated required sections fail; the supported design-context companion is accepted |
| 10–13 | Semantic-anchor restrictions apply even within ordinary examples; `MustVerify` requires a matching record | Attribute-bearing anchors and attributes containing module IDs fail; child-anchor form succeeds; missing verification fails |
| 14–17 | A no-op selected command passes against broken behavior; a real selected test fails, then passes after the operator is corrected | Execution opt-in is required; failure logs assert the exact equality failure and the expected test counts |
| 18–21 | A clean passing run stays historical after a source regression; a new real run detects it | Status reports scoped drift but does not execute the target test; a prior pass does not satisfy a later command assertion without opt-in |
| 22–24 | Two different dirty contents have the same HEAD/branch/dirty identity | The variants differ in comments: this proves lack of exact byte identity, not different runtime behavior |
| 25–28 | A command can test correct code, modify it, and exit 0 while metadata retains the clean starting identity | Git confirms the post-command modification; a fresh test process then fails on the equality assertion |

Numeric labels identify the experimental sequence, not the number of independent statistical samples. Labels 26 and 27 are checks supporting observation 28. Setup and source-check subprocesses account for the rest of the 42 commands.

The runner is correctly following its documented command-exit semantics in the no-op and mutating-command cases. These experiments justify narrower evidence claims, not an assertion that current GRACE promised a behavioral proof or immutable execution environment.

## Normalization and review

Published results replace the known checkout, run, executable and home paths with `<REPO>`, `<RUN_DIR>`, `<BUN>` and `<HOME>`. The inherited `PATH` is omitted and shared overrides are stored once. Timestamps, durations, process IDs, statuses and all failure output remain. Fixture bytes and their hashes are preserved; the exporter rejects fixtures requiring path replacement and audits for remaining user/temporary paths. `results.json.normalization` describes the transformation and hash scopes.

The normalized records are evidence of this run, not an exact byte-for-byte transcript of its original machine paths. Raw results remain local; rerunning the harness regenerates full local paths and fixture directories. Input snapshot hashes identify the fixture contents immediately before a command, not a sealed filesystem throughout execution.

The research documents received separate source and methodology critiques. Their material findings led to source-identity checks in the harness, more precise treatment of the earlier proposal and stronger pilot comparison/analysis rules. Rechecks were targeted at those findings; this is not a claim of two complete clean review rounds.

## Repository checks

The unchanged upstream implementation passed the full local suite: **413 passed, 4 skipped, 0 failed** (417 tests, 27 files). The skipped tests are two Windows-specific checks and two requiring Dart. Type checking and marketplace validation passed. That historical result predates the methodology changes in PR #63. The later methodology suite passed **416 tests, with 4 skipped and 0 failed** (420 tests across 28 files). The final changelog-only commit had **58 passing focused tests**, recorded separately rather than represented as another full suite. See [validation.json](validation.json) and [PROVENANCE.json](../PROVENANCE.json). No agent-performance benchmark, remote CI result, Linux test result, or Windows test result is claimed here.
