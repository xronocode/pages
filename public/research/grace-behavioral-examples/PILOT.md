# Pilot protocol and implementation gates

**Proposed, not executed.** The baseline CLI characterization experiments in this package are not this pilot. PR #63 adopts a methodology convention and compatible examples; it does not supply agent-performance results. Maintainers should approve or amend this protocol before collecting those results.

## Minimal working convention

Keep the accepted rule in the existing change spec and, after adoption, the owning module contract. Keep verification descriptions and test references in the existing owning `V-M-*`. Store runnable fixtures with the project tests. A project-owned manifest may index test cases; it must have one authoritative expected-value source, not a competing copy of expectations.

For each case record only these core concepts:

| Concept | Required information |
|---|---|
| Identity | Stable local key, owning module and rule reference |
| Intent | The plausible incorrect interpretation this case detects |
| Given / action | Explicit input and relevant initial state/context |
| Expected observations | Result and any relevant changes, unchanged state, forbidden effects or allowed outcome set |
| Oracle / binding | Independent comparison, test selector and runner command |

Actor, tenant, clock, version, concurrency schedule, fault point, audit, recovery and fixture digest are extensions when relevant. Record why an important axis does not apply. Do not make authors manufacture distributed-failure fields for a pure function.

This is a review convention on 4.2.1. Ordinary text or child fields accepted by the XML parser do not acquire new native semantics. Project-local keys are not newly registered GRACE semantic anchors.

## Synthetic worked example: reserve inventory

This example supplies its own toy product rules; it does not import application-specific policy.

**Rule R-1:** `reserve(sku, quantity)` accepts a positive integer quantity no greater than the current available stock. Success reduces only that SKU by the requested quantity. Rejection leaves the entire inventory unchanged. The pilot's first version uses a single call, an in-memory inventory and a typed success/rejection result; concurrency, persistence, audit and authorization are outside this toy contract.

| Case | Before / action | Expected observation | Error it distinguishes |
|---|---|---|---|
| reserve-partial | A=5, B=9; reserve A, 2 | success; A=3, B=9 | Wrong decrement or unrelated item modification |
| reserve-exact | A=5, B=9; reserve A, 5 | success; A=0, B=9 | Rejecting the equality boundary with `>=` |
| reject-overdraw | A=5, B=9; reserve A, 6 | rejection; A=5, B=9 | Allowing negative stock or mutating before validation |
| reject-zero | A=5, B=9; reserve A, 0 | rejection; A=5, B=9 | Treating zero as a successful reservation |
| reject-negative | A=5, B=9; reserve A, -2 | rejection; A=5, B=9 | Accidentally increasing stock |
| reject-fractional | A=5, B=9; reserve A, 1.5 | rejection; A=5, B=9 | Accepting a non-integer quantity |

The function's input domain for this toy task is an existing SKU and a finite numeric quantity. Unknown SKUs, NaN and transport parsing need explicit additional rules before becoming acceptance cases. A larger task must state them rather than hide policy in a fixture.

The test checks the returned result and a post-call inventory snapshot. It does not call the implementation's validation helper to calculate expected values. Add properties over a disclosed bounded domain: successful reservations conserve `before[A] = after[A] + quantity`; every rejected reservation preserves the whole snapshot; renaming SKU identifiers or adding an independent SKU preserves the decision and existing entries. Generated tests must report their domain, seed and sample count.

Before the agent experiment, demonstrate that the independent checker rejects implementations that allow equality only incorrectly, omit positive-integer validation, decrement the wrong item or mutate on rejection. Keep equivalent mutants separate. This validates sensitivity to those errors, not completeness.

## Two experiments, two denominators

### Experiment 1: teaching effect

Use the same explicitly disclosed normative contract in all conditions:

- **A — rule only:** contract and normal project context.
- **B — rule + random demonstrations:** a seeded random subset of valid demonstrations.
- **C — rule + distinguishing demonstrations:** a preselected subset targeting likely confusions.

Use the same number and representation of demonstrations in B and C, with comparable prompt lengths. Keep model revision, runtime, tools, task context, output/repair limits and maximum total token budget fixed. A shorter prompt in A is legitimate and its actual cost should be reported; an optional length-matched control can distinguish additional context length from example content. Do not silently grant one condition extra repair attempts.

Pre-register the task corpus, contracts, selection procedure and evaluation protocol before agent outputs are inspected. Include at least a pure function, a state mutation with frame conditions and an authorization/scope boundary. Start with a small feasibility run to estimate variance and cost; choose the confirmatory sample size and minimum worthwhile gain before that experiment. Do not declare success from a single toy task or select only successful repeats.

Reserve fresh tasks for confirmation after tuning on feasibility tasks; any reuse is exploratory. Predeclare C minus A as the primary contrast for the benefit of curated examples. Treat C minus B (curation) and B minus A as secondary unless a multiple-comparison plan is registered in advance. Freeze C's subset per task; sample B's subset per repetition from the same eligible pool using recorded seeds. Sample demonstration order separately. These choices estimate the stated policies, not the best prompt found after inspecting results.

Randomize trial/condition order and demonstration order using recorded seeds; use fresh workspaces and contexts. Record any platform nondeterminism that cannot be controlled. The evaluator receives the normative rules but no treatment label. Challenge tests use new values and combinations under the same disclosed rules and are withheld from the implementation context.

**Primary outcome:** fraction of task runs passing all mandatory independent checks on the first evaluation, before feedback-driven repairs. The task run is the unit of analysis; correlated cases within one run are not independent samples.

**Secondary outcomes:** per-rule violations, frame/scope breaches, missing cases, repair rounds, changed expectations, tokens, wall-clock time and tool errors. Report absolute numerators/denominators, paired task-level differences and uncertainty intervals; group repeated measurements by task. Publish failure artifacts. Analyze repaired success separately from first-pass success. Preserve dropped or infrastructure-failed trials with explicit reasons and a predeclared rerun policy.

Weight tasks equally: average repeated-run success within each task and condition, then compare paired task averages. Predeclare an uncertainty procedure that resamples whole tasks with all their repeats and conditions together, such as a task-cluster bootstrap; disclose its limits for a small task set. Fix the sample-size/stopping rule before confirmation. Extra repeats on a few tasks cannot substitute for task diversity.

The pilot result may justify a teaching convention even if native case typing is not useful. Conversely, a useful typed reporter may have no measurable prompting effect.

### Experiment 2: evidence-accounting effect

Use known test implementations and a project-owned report checker invoked as a leaf command through the existing `MustPassCommand`. Compare it with an aggregate exit-code-only command under controlled faults:

| Controlled input or fault | Required system behavior |
|---|---|
| Valid complete report for the current selected inventory | Accept |
| Inputs legitimately change, then a fresh matching report is generated | Accept |
| Retry history satisfies the explicitly permitted policy | Accept while retaining every attempt |
| Exit 0 but no report, empty report or zero discovered tests | Reject |
| Required case omitted, skipped or filtered out | Reject |
| Duplicate/unknown case key or wrong inventory version | Reject |
| Fixture, expectation, oracle or tested implementation changed | Reject stale result |
| Execution interrupted or report malformed | Reject; preserve the diagnostic |
| A failed attempt is followed by a pass | Retain both; apply explicitly selected retry policy |
| Cases pass but another final-gate requirement fails | Outer gate remains failed even if the leaf checker accepts the case report |

Record case coverage against the declared case inventory, not against an undefined universe of behavior. Do not label a report "100% correct". The checker must validate observed reports from a real test adapter, not a static hand-authored list of passing IDs.

Report fault-detection counts and false rejections of valid reports separately. This experiment validates the checker; it does not by itself justify native integration. Before promoting B, compare a proposed native mechanism with the functioning project-owned checker. Record at least one repeated workflow problem and its frequency/consequence, author/reviewer setup and correction time, missed errors and false rejections. Explain which ownership, navigation or maintenance problem native support solves and why a small project convention is insufficient.

For a first trusted local pilot, use fresh execution against a clean committed fixture/test workspace and record the commit, toolchain, manifest, runner and relevant input hashes. Record dirty work separately or reject it. Hash the inputs that can affect the result, including dependencies/configuration, and state external-state assumptions. A nonce and digest can detect accidental mismatch; they do not authenticate a malicious runner. Endpoint before/after hashes do not prove that files were never changed during execution. Stronger claims require immutable inputs and trusted execution/approval records.

## Implementation gates

| Stage | Deliverable | Exit criterion |
|---|---|---|
| 0. Historical baseline research (this package) | Pinned source analysis, primary references, reproducible characterization | Independent review can reproduce and challenge each mechanism claim |
| 1. Existing-runner pilot | One complete case inventory, real adapter, checker, negative controls, measured agent trials | Complete raw results; costs and limitations visible; no claim of native conformance |
| 2. Native proposal, if warranted | Small versioned case/result contract in existing owners | Demonstrated accounting/maintenance problem; explicit schema and lifecycle design; maintainer approval |
| 3. Native implementation | One vertical path from approved target to current state and evidence | Compatibility, parser isolation, exact identity/accounting and lifecycle checks pass |
| 4. Additional domains/adapters | Only integrations demanded by observed usage | Independent oracle and integration evidence for each added boundary |

Stop or redesign the teaching convention if it increases cost without a worthwhile independent quality gain. Do not force a native schema if existing commands and project conventions meet the need. A registry becomes a candidate only when cross-owner reuse or independent lifecycle produces concrete recurring problems.

## Minimum acceptance for a future native feature

1. Keep legacy structural semantics and `MustVerify` unchanged; use explicit capability/version negotiation for new required semantics.
2. Validate exact locations, keys, references, result cardinality and unsupported fields; literal examples must never inject assertions, scopes, links or commands.
3. Resolve the selected approved target inventory against a named baseline before execution; define deletion/retirement and preserve unaffected owners.
4. Require a real test binding and explicit non-success states for missing/skipped/stale/duplicate/unknown cases. Preserve retries and interruption.
5. Tie evidence to the actual relevant inputs and distinguish command, case-set and whole-gate outcomes. State the execution and approval trust model.
6. Fail structural/capability checks before executing case commands. Preserve existing execution opt-in and contained-path protections.
7. Verify target/current equivalence after apply, execute the final gate, then archive without losing current ownership or provenance.
8. Test one successful lifecycle, behavioral failure, stale evidence, downgrade, malformed report and semantic retirement before adding more case kinds.
9. Update canonical skills and packaged mirrors together; exercise navigation, CLI, published examples and package installation paths.

Review evidence should state scope, snapshot, method, findings and disposition. Fresh reviewer contexts are useful but correlated model reviews are not a statistical guarantee. Choose review depth according to risk and findings; a fixed count of clean rounds is not part of this proposed minimum.
