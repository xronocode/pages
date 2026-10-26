# Independent findings

**Historical baseline study.** The implementation observations below concern commit `70f5ec4`. PR #63 now adds methodology guidance and compatible examples at `11d1573`; the proposed agent-performance pilot remains unexecuted. See [package scope and provenance](README.md).

## Scope and independence

This investigation re-examines a supplied 2026-10-26 proposal about few-shot examples in GRACE. It uses a fresh checkout of upstream `70f5ec4305bb2cc6ed82dea9470a3b810603874b`, direct inspection of the implementation, newly authored synthetic CLI probes and primary research sources. Source inspection, runtime experiments and literature review were performed in separate agent contexts. The source and literature reviewers examined primary material before reading the earlier report; the runtime harness was written independently. The coordinating author then compared the findings with the supplied proposal.

Separate agent contexts reduce shared framing but do not establish statistical independence or substitute for human review. This is a focused examination of the relevant interfaces, not a claim to have audited every source line or formally proved GRACE. No agent-generation benchmark was run. The local application-specific examples in the supplied material are not required to reproduce these findings and are not republished here.

## What the code actually guarantees

All links in this section are pinned to the inspected revision.

| Surface | Existing guarantee | Boundary relevant to this proposal |
|---|---|---|
| Artifact grammar | Validates known roots, version, anchor structure, ownership and selected section shapes | Acceptance of an ordinary nested tag does not give it behavioral semantics |
| `MustVerify` | Requires a verification entry for the module | Does not inspect the assertions inside a test or demonstrate a business result |
| `MustPassCommand` | Evaluates actual command execution results when explicitly requested | The project's command determines what behavior is tested; exit 0 can mean no assertions ran |
| Assertion slots | Command results are keyed to the extracted plan/section/slot in the current invocation | Slot identity is not stable behavioral-case identity or a digest of normative content |
| Verification projection | Collects commands, scenarios, markers, trace assertions and test-file references | Scenarios and trace assertions are strings; no typed per-case outcome protocol is present |
| Run logs | Record command, exit code, duration, timestamps, HEAD, branch and dirty state; preserve a passing run per change under retention policy | Dirty state is a boolean, not a digest of the dirty tree; command-run success is not necessarily whole-lint success |
| Skills | Require approval, immutable approved plans, scoped execution and final checks | Agent instructions do not themselves authenticate approval or seal an execution snapshot |

Sources: [grammar](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/grammar.ts), [assertion evaluation](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/assertions.ts#L336-L374), [slot/result mapping](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/lint/core.ts#L199-L251), [verification projection](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/projections.ts#L26-L39), [run metadata](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/run-log-store.ts#L6-L58), [VCS identity](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/run-log-store.ts#L113-L139), [execution skill](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/skills/grace/grace-execute/SKILL.md).

It would be inaccurate to say GRACE has no execution binding or no provenance. It has both at command level. The proposed improvement concerns case granularity and stronger snapshot identity. The current CLI executes selected commands afresh; the absence of a digest is not evidence that it silently reuses stale cached PASS results.

### Structured text already fits, but is not a typed contract

An ordinary `Scenario` can contain `Given`, `When` and `Then` children today. The projection aggregates them into text; it does not preserve a typed scenario model or compare observations with expectations. Renaming it to an invented unique tag such as `Scenario-CART-ADD` can remain grammatically acceptable while disappearing from the scenario projection. A permissive XML payload and a supported executable contract are different capabilities.

This makes a prose-first pilot possible without a new schema. Use supported fields, explicit textual case keys and existing test references; do not imply that a new `Case`, `BehavioralExamples` or attribute is natively enforced. Avoid embedding live GRACE structures inside illustrative XML: descendant traversal can interpret recognized tags. Use escaped text or CDATA for literal teaching examples. See [XML helpers](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/xml.ts) and [projection extraction](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/projections.ts).

### Confirmed drift in teaching material

The reference labels `<M-CONFIG NAME="Config" TYPE="UTILITY">` as a good semantic anchor and repeats attribute-bearing module/data-flow forms in its table. Current grammar rejects attributes on semantic anchors. The same file extends the unique-tag convention to ordinary repeated fields, although projection readers still look for specific names such as `Scenario`.

The study recommended teaching attribute-free registered anchors with ordinary child fields, distinguishing semantic IDs from repeated data fields, and validating positive snippets against the actual parser. PR #63 now implements that correction and the behavioral-example workflow; the linked baseline reference below records the original finding. Byte-identical mirrors are necessary for packaging but do not detect a shared semantic mistake. The reference's claims about attention mechanisms should be framed as a design rationale unless directly supported by a suitable study. Sources: [reference](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/skills/grace/grace-explainer/references/unique-tag-convention.md#L23-L72), [grammar rules](https://github.com/osovv/grace-marketplace/blob/70f5ec4305bb2cc6ed82dea9470a3b810603874b/src/grace4/grammar.ts#L172-L211).

## Controlled experiments

The companion [reproduction package](evidence/README.md) records commands, input fixtures, output and exit status. Its positive and negative controls distinguish permissive extension fields, actual command execution and absent behavioral assertions. A successful no-op command demonstrates the runner's intended exit-code contract; it is not evidence of a broken test runner. A failing behavioral check is a required control: without it, a green no-op probe says little about the execution path.

The experiments examine mechanism boundaries. They do not estimate the frequency of agent mistakes, the benefit of demonstrations, the effectiveness of a new schema or correctness for real multi-tenant applications.

A further controlled experiment tests correct behavior and then deliberately changes the source before the selected command exits successfully. The lint run passes, its metadata retains the clean starting identity, and a new independent test subprocess fails on the changed code. Two distinct dirty source contents also share the same HEAD/branch/dirty tuple. These observations demonstrate the limits of the recorded identity; they do not establish that GRACE promises post-command tree attestation. Re-running the real test detects the regression, and the historical pass does not satisfy a new command assertion without execution opt-in.

## Four objects that should remain separate

| Object | Question answered | Appropriate validation |
|---|---|---|
| Normative rule | What must hold for the supported class of inputs? | Requirement review, executable properties where practical |
| Prompt demonstration | Which concrete contrast helps the agent understand that rule? | Validity, relevance, selection/order experiments |
| Test fixture and binding | How does a runner exercise a case and judge its observations? | Independent oracle, test discovery, meaningful negative controls |
| Run evidence | What executed, against which inputs, and with what result? | Complete result accounting, input identity, provenance and overall verdict |

One concrete case may be reused in all four contexts, but the roles must be explicit. Normative meaning must not be inferred from a demonstration alone. A hidden evaluation case may test a disclosed rule on a new value or combination; it must not introduce a hidden product requirement.

## Primary literature and what transfers

| Source | Supported observation | Limit for this RFC |
|---|---|---|
| [Brown et al., 2020](https://arxiv.org/abs/2005.14165) | In-context demonstrations can support task performance without parameter updates | Does not validate GRACE, a fixed number of cases or correctness guarantees |
| [Min et al., EMNLP 2022](https://aclanthology.org/2022.emnlp-main.759/) | On studied classification/multiple-choice tasks, input distribution, label space and format contribute strongly; correct labels are not the sole driver | Does not license incorrect expected outputs in software tests; transfer to coding agents is a hypothesis |
| [Liu et al., DeeLIO 2022](https://aclanthology.org/2022.deelio-1.10/) | Example selection can materially affect in-context learning results on the studied tasks | Similarity retrieval is not established as the best selection criterion for stateful contracts |
| [Lu et al., ACL 2022](https://aclanthology.org/2022.acl-long.556/) | Demonstration order can materially affect performance | A single successful prompt ordering is insufficient evidence for a universal practice |
| [Claessen and Hughes, QuickCheck](https://www.cs.tufts.edu/~nr/cs257/archive/john-hughes/quick.pdf) | Executable properties and input generators enable testing beyond enumerated examples | Random testing is not exhaustive; generator quality and oracle correctness remain assumptions |
| [EvalPlus, Liu et al., 2023](https://arxiv.org/abs/2305.01210) | Expanded code-generation test suites expose incorrect programs missed by smaller suites | Evidence concerns its benchmark; production stateful systems require additional observational boundaries |
| [PIT mutation testing documentation](https://pitest.org/) | Injected implementation mutations test whether the suite detects those changes | Killing selected mutants does not establish completeness; equivalent and irrelevant mutants need separate treatment |
| [Gherkin reference](https://cucumber.io/docs/gherkin/reference/) | Given/When/Then connects scenario descriptions to step definitions | The syntax alone supplies neither an oracle nor a universal state/failure model |

These findings motivate a controlled GRACE pilot. They do not determine whether native XML typing is worth its maintenance cost. No universal minimum example count, guaranteed quality improvement or mandatory two-clean-review rule follows from them.

## Comparison with the supplied proposal

| Earlier proposition | Independent assessment |
|---|---|
| Distinguish rules, demonstrations, bindings and observations | Supported as an architectural discipline |
| Make state delta, unchanged state, failure outcomes and scope explicit where relevant | Supported; use relevance-based fields rather than mandatory boilerplate for every pure function |
| Structural coverage and command success are not behavioral correctness | Confirmed, with the qualification that actual command-result binding already exists |
| Use the existing lifecycle and owners before a standalone registry | Supported; avoid parallel normative sources |
| Bridge first, native typed integration second | Preserve the bridge; make native adoption conditional on measured need and value |
| A broad 18-element normative model, with explicit inheritance and compact serialization allowed | Useful checklist for complex stateful work, not yet justified as universal minimum schema; the proposal does not require 18 separately written payloads |
| Fingerprints and repeated independent reviews improve assurance | Plausible controls; distinguish content identity, trusted approval, execution isolation and reviewer correlation |
| Two consecutive clean reviews across four angles for specifications and significant changes | A possible risk policy, not an experimentally established universal requirement; keep review depth explicit and evaluate its cost |

The earlier report already states many of these limits and explicitly defers a generic DSL. This re-investigation narrows and tests its recommendation rather than attributing stronger claims to it.

## Risks a native proposal must resolve

1. **Oracle coupling.** A stable case ID can name a weak or implementation-derived assertion. Require a negative implementation variant that the oracle actually rejects.
2. **Unknown does not mean passed.** Missing, duplicate, skipped, filtered-out, interrupted, stale and unsupported results need explicit non-success outcomes. Preserve retry history.
3. **Identity does not authenticate authority.** Matching hashes show matching content, not who approved it or whether the runner observed that content. Mutable local records are not a hostile-worker security boundary.
4. **Target and current state differ.** A future case inventory in an approved spec cannot be checked by silently reading the old durable `V-M-*` inventory. Define replacement/retirement, target resolution and post-apply equivalence before implementation.
5. **Examples can become executable structure accidentally.** Define exact parse paths and literal data treatment before allowing richer nested payloads.
6. **Versioning must fail visibly.** Do not add required typed semantics to a 4.0 artifact that old clients silently ignore. Any anti-downgrade guarantee needs a trusted policy outside the mutable project inputs.
7. **Run status has levels.** A successful command batch does not override a failed structural or final gate. A report must distinguish these outcomes.

These are acceptance requirements for a future feature, not native capabilities supplied by this research package or PR #63.
