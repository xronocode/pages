# GRACE behavioral examples: research and reproduction

Research companion to [PR #63](https://github.com/osovv/grace-marketplace/pull/63), prepared on 2026-10-26. This package preserves the baseline investigation and its reproducible synthetic CLI observations. The proposed agent-performance pilot has **not** been run.

## Scope and current implementation

The recorded experiment evaluates upstream [`70f5ec4`](https://github.com/osovv/grace-marketplace/tree/70f5ec4305bb2cc6ed82dea9470a3b810603874b), package **4.2.1**, artifact grammar **4.0**. Its results and fixture bytes are unchanged from the final normalized research run.

PR #63 at [`11d1573`](https://github.com/osovv/grace-marketplace/tree/11d15732a558dc14dd8868cba9fd4453304e77a8) implements methodology changes: contrasting behavioral examples in spec and plan templates, explicit test mapping, worker/reviewer guidance, current-verification preservation, and corrected semantic-anchor examples. It adds compatibility tests for the published XML and keeps canonical skills and packaged mirrors synchronized. See the [current behavioral-examples reference](https://github.com/osovv/grace-marketplace/blob/11d15732a558dc14dd8868cba9fd4453304e77a8/skills/grace/grace-explainer/references/behavioral-examples.md).

The PR does not add native typed cases, per-case result accounting, a new grammar version, or new CLI semantics. Compatibility tests establish that the documented examples fit the current grammar and projection; they do not demonstrate improved agent implementation quality.

| Material | Purpose |
| --- | --- |
| [Independent findings](RESEARCH.md) | Historical baseline guarantees, counterevidence, primary literature, and limits |
| [Proposed pilot](PILOT.md) | Unexecuted protocol separating teaching effects from evidence accounting |
| [Reproduction instructions](evidence/README.md) | Pinned checkout, local harness, recorded outputs, and controls |
| [Validation record](evidence/validation.json) | Separate baseline, methodology, and final changelog validation summaries |
| [Provenance and SHA-256 manifest](PROVENANCE.json) | Source revisions, file identities, and package scope |
| [Licenses and attribution](LICENSES.md) | CC BY 4.0 research prose, MIT original code/fixtures, and upstream attribution |

## What was observed

The baseline harness passed **26 asserted observations** using **42 subprocesses**. It demonstrates the distinction between structural validation, verification-record existence, and explicitly executed behavioral tests. Unknown ordinary XML content does not gain behavioral semantics; a selected no-op command can pass while a selected independent behavioral test detects the wrong result. Execution logs record command outcomes and starting Git identity, with documented limits on exact dirty-content identity and post-command state.

The recorded repository baseline had **413 passed, 4 skipped, 0 failed** tests. The later methodology check had **416 passed, 4 skipped, 0 failed**. A final changelog-only correction received **58 passing focused tests**; this is a separate validation summary, not an additional agent experiment or a second full-suite result. Details and evidence retention are explicit in the validation record.

## Research questions still open

1. Do selected examples improve an agent's implementation of an already stated rule?
2. Does explicit case-to-result accounting catch omissions that an aggregate command result does not?

The package contains no measurements answering those questions. A better reporter would not itself demonstrate better prompting. The proposed pilot retains failures, missing/skipped cases, cost data, independent expectations, and separate denominators for the two questions.

Use the existing lifecycle and project test runners first. A future native schema or registry remains conditional on demonstrated value and a separate design/review decision. Names such as `MustPassCases` and grammar version `4.1` are possibilities discussed in the research, not available features.

## Package contents and privacy

All application data and fixture identities are synthetic. Known machine paths in the recorded run use declared placeholders; inherited `PATH` is omitted. The two evidence JSON files retain their original normalized bytes, and the scripts retain their original source bytes. No raw local outputs, dependency tree, credentials, or agent task history is included. Documentation and validation scope notes were updated for this standalone package; those edits did not regenerate the experiment.

Download `reproduction.zip` from the research page or follow [the local instructions](evidence/README.md). The archive contains the files listed by the provenance manifest and excludes the archive itself.
