---
title: "Behavioral examples in GRACE: what they clarify and what they do not prove"
seoTitle: "Behavioral Examples in GRACE: Evidence and Limits"
description: "An independent source review, 26 controlled observations, and the rationale for carrying behavioral examples from specifications to verification."
date: 2026-10-26
num: "10"
tags: ["grace", "ai-agents", "verification"]
mirrors:
  ru: /blog/grace-behavioral-examples-ru/
---

A rule such as "reject reservations that exceed available stock" leaves several opportunities for an implementation mistake. Does an exact reservation succeed? Can a rejected request modify stock before returning an error? Must unrelated items remain unchanged? A few carefully chosen examples can expose these questions before code is written.

[GRACE PR #63](https://github.com/osovv/grace-marketplace/pull/63) turns that practice into instructions for specification, planning, execution and review. It updates the skills and reusable templates, adds a worked example, and corrects misleading XML guidance. It uses the existing GRACE 4.0 artifact format and project test runners. The CLI's execution and validation semantics remain unchanged.

The changes are proposed in PR #63; this article does not describe a new released GRACE version.

The supporting investigation examined source code, ran controlled probes and reviewed primary research on demonstrations and testing. Its findings explain both the practical changes and the limits of the evidence behind them.

## What was examined

The implementation review used upstream commit [`70f5ec4305bb2cc6ed82dea9470a3b810603874b`](https://github.com/osovv/grace-marketplace/tree/70f5ec4305bb2cc6ed82dea9470a3b810603874b): package version 4.2.1, artifact grammar 4.0. Package and grammar versions describe different things. The methodology changes discussed here are pinned to [PR revision `11d15732`](https://github.com/osovv/grace-marketplace/tree/11d15732a558dc14dd8868cba9fd4453304e77a8).

Source inspection, runtime probes and literature review were assigned to separate agent contexts. The source and literature reviewers examined primary material before reading the earlier proposal; the runtime harness was independently authored. This reduced shared framing. It did not make the reviewers statistically independent or replace human review.

The characterization suite recorded 26 asserted observations across 42 subprocesses, including setup and source-identity checks. It ran on macOS arm64 with Bun 1.3.14. These counts describe a bounded mechanism investigation, not independent statistical samples. Linux and Windows reproduction was not established, and no agent-performance benchmark was run. The [research notes](/research/grace-behavioral-examples/RESEARCH.md) and [reproduction archive](/research/grace-behavioral-examples/reproduction.zip) contain the detailed evidence and limitations.

## Four roles for one example

A concrete case can appear in several places, with a different responsibility in each:

| Role | Responsibility |
| --- | --- |
| General rule | Define required behavior over the supported input domain. |
| Prompt demonstration | Help an agent interpret that rule through a concrete contrast. |
| Test fixture and binding | Exercise the operation and compare observations with an independently specified expectation. |
| Run evidence | Record what actually executed, its result and the relevant source identity. |

An example in an approved specification is an obligation. Selecting two examples for a worker's prompt does not reduce the complete set of accepted obligations. A test binding identifies how an obligation is checked; it must not quietly add a product policy. A passing log records the outcome of an execution, with whatever limits its runner and metadata impose.

These distinctions also affect storage. Accepted rules and examples belong in `spec.xml`. Rationale and alternatives may go into `design-context.xml`. After centralized apply, current rules belong to the owning module contract, and accepted scenarios and bindings belong to its verification entry. Unaffected obligations must survive that transition.

## What the existing CLI checks

`MustVerify` requires a verification entry for a module. It does not execute that entry's commands or establish that its scenarios passed. Actual command evaluation comes from selected `MustPassCommand` assertions with explicit `--run-commands` opt-in. The distinction is visible in the [assertion implementation](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/assertions.ts).

For the worked change, a selected post-edit check is:

```sh
grace lint --path PROJECT --change C-RESERVE-STOCK --assertions target --run-commands
```

Required durable graph and verification changes must already have been reconciled centrally. The corresponding `final --run-commands` check evaluates the target with full project lint before archival. Task verification runs during implementation; planning records those future checks without claiming to have executed them.

A controlled probe paired broken behavior with a successful no-op command. The selected command passed. Replacing it with a real behavioral test exposed the error, and correcting the implementation made that test pass. This confirms the runner's exit-code contract. The strength of the behavioral check depends on what the project command actually asserts and whether it discovers all required cases.

The parser has another important boundary. Ordinary `Scenario` elements can contain `Given`, `When` and `Then` children. The [verification projection](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/projections.ts) collects their text. It does not evaluate the expectation. Renaming a field to `Scenario-CART-ADD` can leave the XML acceptable while removing it from scenario projection, which looks for the exact name `Scenario`.

The old unique-tag reference also presented attribute-bearing semantic anchors as valid examples, although the grammar rejects those attributes. PR #63 corrects the distinction: registered semantic anchors remain attribute-free; ordinary repeated fields retain their expected names. Local labels live in text fields such as `Name`. Literal teaching XML needs escaping or CDATA where descendant traversal could otherwise interpret it as active structure.

## Reserve three units, then try four

The [new worked reference](https://github.com/osovv/grace-marketplace/blob/11d15732a558dc14dd8868cba9fd4453304e77a8/skills/grace/grace-explainer/references/behavioral-examples.md) isolates one reservation rule. Its domain is one call with a positive integer quantity and nonnegative starting stock. Authorization, validation of other inputs, concurrency and persistence failures need their own applicable contracts.

The rule accepts a quantity at most equal to available stock, returns `reserved`, and subtracts that quantity from the selected SKU. An overdraw returns `insufficient-stock` and performs no stock write. Other SKUs remain unchanged; the operation never creates or removes SKUs.

Start each case with A=3 and B=7:

| Case | Action | Required observations |
| --- | --- | --- |
| `exact-boundary` | Reserve 3 units of A | `reserved`; A=0; B=7; no extra SKU or negative stock. |
| `rejected-overdraw` | Reserve 4 units of A | `insufficient-stock`; A=3; B=7; no partial reservation or stock write. |

The first case distinguishes an incorrect strict boundary. The second checks rejection and its effects. Merely checking the returned error would miss an implementation that modifies inventory before rejecting. Even equal before/after snapshots do not prove that no write occurred: a no-op write or a write followed by restoration can leave identical final values. The observer must examine the write boundary when the accepted rule forbids writes.

The spec uses repeated `Criterion` and `Scenario` fields with ordinary children such as `Name`, `Given`, `When`, `Then`, `Unchanged` and `Forbidden`. These are authoring conventions within grammar 4.0. The plan maps both cases to named tests in `tests/reserve-stock.test.ts`, their command and expected observations. The expected values come from the approved rule; calling the production reservation calculation to produce its own expected answer would reproduce the same possible defect.

Both examples still leave unlisted inputs. The general rule continues to apply to those inputs, along with existing regression obligations. Boundary, failure, concurrency and property checks should follow the behavior's actual risks. A pure function does not need invented audit or recovery fields to complete a form.

## What the methodology changes require

The revised spec skill requires rules and a small set of contrasting examples for changed behavior. Rule/example contradictions block approval. Unresolved expectations stay in the draft instead of becoming implicit decisions inside fixtures.

Planning must account for every accepted criterion and example through tasks, test files, selectors or names, executable commands and expected evidence. Execution may give a worker a compact subset as context, while the controller remains responsible for the complete required checks. Verification and review inspect actual results for missing, skipped, filtered or weakened cases. Changing approved obligations follows the existing supersession and approval lifecycle.

The changes also preserve command budgets and the distinction between quick checks and expensive acceptance tests. Tests that depend on database, transaction or authorization semantics need the relevant real boundary. Quarantining a flaky mandatory case requires an approved deferral; quarantine alone cannot satisfy acceptance. These instructions are implemented in the skills and templates. Native case accounting, a new grammar profile and automatic evaluation of prose expectations are not implemented.

## What the literature supports

[Brown et al.](https://arxiv.org/abs/2005.14165) demonstrated useful few-shot performance without parameter updates across studied language tasks. Selection matters: [Liu et al.](https://aclanthology.org/2022.deelio-1.10/) found benefits from retrieving relevant demonstrations on their benchmarks. [Lu et al.](https://aclanthology.org/2022.acl-long.556/) showed substantial sensitivity to demonstration order. These results motivate careful example selection; they do not establish a universal number of examples or a measured improvement for GRACE agents.

[Min et al.](https://aclanthology.org/2022.emnlp-main.759/) found that format, input distribution and label space contributed strongly on their classification and multiple-choice tasks, sometimes despite randomized demonstration labels. That finding cautions against attributing every improvement to learning the intended mapping. It provides no justification for incorrect expected outputs in software tests.

Testing research gives a complementary warning. [EvalPlus](https://arxiv.org/abs/2305.01210) exposed incorrect generated programs that smaller test suites missed. [QuickCheck](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf) shows how executable properties and controlled input generation can extend testing beyond enumerated examples. Generator quality and the correctness of the checking logic remain assumptions. [Mutation testing](https://pitest.org/) examines whether tests detect selected artificial faults; surviving or killed mutants do not yield a percentage of program correctness.

## What a passing record leaves unresolved

GRACE records command outcomes and starting Git identity, including HEAD, branch and a dirty-state flag. That flag does not identify every dirty byte. The probes produced different dirty contents with the same identity tuple. Another command tested correct code, modified it and exited successfully; the record retained the clean starting identity, while a fresh test process detected the resulting regression. The [run-log implementation](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/run-log-store.ts) does not promise an immutable execution snapshot.

These observations support fresh verification after relevant changes and precise descriptions of recorded evidence. They do not show silent reuse of cached passes: a historical pass does not satisfy a new command assertion without execution opt-in. Hashes could strengthen content identity, but would still need a defined input boundary and trusted execution assumptions to support stronger claims.

## What remains to measure

A future teaching experiment could compare the same disclosed contract alone, with random demonstrations, and with curated distinguishing examples. It should reserve fresh tasks for confirmation, predeclare the curated-versus-contract-only comparison, keep execution budgets consistent, and test unseen values under the same rules. Repeated runs should be grouped by task when estimating uncertainty. Costs, unsuccessful runs and repair attempts belong in the results.

A separate accounting experiment could challenge a project-owned checker with missing cases, stale reports, duplicates and valid changed inputs. Before adopting native support, that checker should be the baseline for measuring maintenance effort, missed errors and false rejections. Prompting gains alone would not establish the value of a native schema.

Those experiments have not been run. The current change provides a concrete workflow that can be used and evaluated now: approved rules with distinguishing examples, complete test mappings, and evidence that states what actually executed.
