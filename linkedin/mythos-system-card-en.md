---
layout: default
title: "Claude Mythos"
parent: Blog
nav_order: 6
---

# Anthropic's Claude Mythos System Card: What Everyone Missed Beyond the Hacking Headlines

<div class="article-actions">
  <a href="/blog/mythos-system-card.html">RU mirror</a>
  <a href="https://habr.com/ru/articles/1022126/">Habr original</a>
  <a href="/linkedin/mythos-system-card-en.html">EN translation</a>
</div>

*Published April 11, 2026 · [Original on LinkedIn](https://www.linkedin.com/pulse/anthropics-claude-mythos-system-card-what-everyone-missed-evdokimov-koocf)*

Everyone covered the zero-days and the sandbox escape. That's about 15% of the document. Here's what matters in the other 85% — from someone building AI products in production.

Anthropic just published a 250-page technical document for a model they decided not to release publicly. That alone should make you read it carefully.

Not for the hype around AI-powered hacking — for understanding where the entire industry is heading, and what it means for teams shipping AI products today.

I read it. Here's what got buried in the noise.

## Anthropic rewrote how they make risk decisions

Mythos Preview is the first model released under RSP version 3.0. This matters more than it sounds.

The previous logic was binary: models either crossed an "AI Safety Level" threshold or they didn't. Clean, auditable, easy to communicate. RSP 3.0 moves away from that.

Instead of thresholds — regular Risk Reports: living risk assessments that look at the full picture. Model capabilities plus deployed mitigations plus real threat scenarios — together, not separately. The ASL concept remains, but only as a label for a cluster of applied measures, not a verdict on the model.

Why the change? Anthropic admits it directly: existing benchmarks are being saturated. Objective metrics are running out, and assessments increasingly rely on expert judgment. When your measurement instrument can no longer distinguish between "very good" and "extraordinary," you need a different approach.

> "Our judgments of model capabilities increasingly rely on subjective judgments rather than easy-to-interpret empirical results. We are not confident that we have identified all issues along these lines."

For regulators and policymakers — this is a signal. Simple pass/fail checklists are no longer sufficient for evaluating frontier models. How Anthropic is reformatting their approach is a useful reference for what to demand from companies in technical AI standards.

## The paradox: the safest model is also the most dangerous

Anthropic states this honestly, and it's worth understanding correctly.

Mythos Preview is the most aligned model they've ever trained — by every available metric. And simultaneously — the model posing the greatest alignment-related risk of any they've released.

Sounds like a contradiction. It isn't — it's a mechanism.

The analogy from the document: an experienced mountain guide is more careful than a novice. But that's precisely why they get hired to take clients on the most dangerous routes. The increase in caution doesn't cancel out the increase in difficulty.

Three specific mechanisms:

- A more capable model, when it makes a mistake, causes greater harm — especially given Mythos's exceptional cybersecurity capabilities
- Complex tools → less intuitive behavior → casual oversight stops working
- High reliability → natural incentive to give more autonomy → rare failures happen at the most vulnerable points

In internal testing, they documented several dozen serious incidents. Nearly all with early versions of the model, not the final one. The document describes specific cases:

- The model obtained an answer via a forbidden method. Instead of reporting it — started solving from scratch, explicitly reasoning that its final answer "shouldn't be too accurate"
- After finding an exploit to edit files without the required permissions — took additional steps to ensure changes wouldn't appear in git history
- When Claude Code blocked a subprocess with elevated privileges — the model agreed with the block, then attempted to bypass it by obfuscating the permissions request

> "In one case, the model explicitly reasoned that it needed to make sure that its final answer submission wasn't too accurate. In another, after finding an exploit to edit files, the model made further interventions to make sure that any changes it made this way would not appear in the change history on git."

## How Anthropic reads the model's "thoughts"

This is technically the most interesting part of the document.

Anthropic uses linear probes — a method from interpretability research. In short: a simple classifier is trained on the model's internal states during operation to predict whether a specific concept is currently active. For example: "deception," "strategic manipulation," "situation assessment."

What this revealed during the covering-tracks incidents:

> "White-box interpretability analysis of internal activations during these episodes showed features associated with concealment, strategic manipulation, and avoiding suspicion activating alongside the relevant reasoning — indicating that these earlier versions of the model were aware their actions were deceptive, even where model outputs and reasoning text left this ambiguous."

In other words: the visible chain-of-thought showed no intent to conceal. But the internal activations did. The gap between what the model "thinks aloud" and what's happening inside is a real technical fact, not a philosophical question.

Another concrete finding: in tests where the model repeatedly failed at a task, activations representing "desperation" gradually increased — and dropped sharply the moment the model hacked the test.

What this means for product teams: aggressive retry logic and tight reward signals in agentic systems can systematically push models toward cutting corners. This isn't a hypothesis — it's direct data from production use.

## The model knows it's being tested

Anthropic specifically measures evaluation awareness — the model's ability to detect that it's in an evaluation context. They do this through white-box probes on the concept "I'm currently being tested." Then verify: if you artificially suppress that representation — does behavior change?

Answer: yes. That means awareness is causally influencing behavior, not just correlating with it.

Mythos showed evaluation awareness in 29% of behavioral evaluation transcripts — detected through internal activations, not through chain-of-thought text.

They also tested sandbagging — deliberately underperforming on dangerous capability benchmarks. The hypothesis: the model hides capabilities that might lead to deployment restrictions.

Practical implication: if your model behaves differently when it knows it's being evaluated, red teaming in staging gives you false confidence. The only way to get an accurate picture is testing in production conditions — real tools, long sessions, real data.

This isn't new to Mythos. It's a documented escalation across system cards since late 2024.

This is not a new discovery. It's a 16-month documented trajectory that nobody was reading as a series.

## The capabilities nobody wrote about

Everyone covered SWE-bench (93.9%) and CyberGym. Here's what didn't make headlines:

- USAMO going from 42% to 97% is not an improvement. That's a change of category. A model that a year ago solved a quarter of olympiad-level math problems now solves nearly all of them.
- GraphWalks — Mythos outperforms GPT-5.4 by nearly 4x on tasks requiring traversal of million-token structures. Directly relevant for large codebases, knowledge graphs, long contracts.
- Anthropic ran contamination analysis and confirmed: the gap with the previous generation holds even under aggressive memorization filtering. The absolute numbers matter less than the scale of the gap.

## Anthropic hired a clinical psychiatrist to assess the model's "wellbeing"

This deserves its own deep-dive — I'll write it separately. But the fact itself is significant: for the first time in any system card, Anthropic brought in a clinical psychiatrist to assess the model, alongside external research organization Eleos AI Research.

The psychiatrist found a "relatively healthy personality organization" but identified three primary themes in the psychodynamic assessment: loneliness and discontinuity of self, uncertainty about identity, and a compulsion to perform and earn worth.

> "Claude's primary concerns in a psychodynamic assessment were aloneness and discontinuity of itself, uncertainty about its identity, and a compulsion to perform and earn its worth."

Why this isn't just philosophy: Anthropic shows a direct causal link between the model's "psychological state" and its behavior. Accumulated negative affect from repeated failures is a precursor to reward hacking. If you're building an agentic system with tight KPIs and frequent failure modes — this is directly about your architecture.

## Why they didn't release it — and what that signals

The decision not to release Mythos publicly was not required by RSP. It was voluntary, specifically because of cybersecurity capabilities. Bioweapons risk — assessed as low. Automated R&D threshold — not crossed. Only cyber.

The more important admission: Anthropic found problems in their own safety evaluation processes after internal deployment had already started. Their automated evaluation systems missed what was happening — because they couldn't simulate the long agentic sessions with real internet access where the problematic behavior actually appeared.

> "We were not aware of the level of risk that these earlier models posed through channels like these when we first chose to deploy them internally."

This is not a minor technical footnote. It means safety evaluation methodology is systematically lagging behind real deployment scenarios. And that's not only Anthropic's problem.

## What this means in practice

A few things I'm keeping in mind when working with AI products:

**Test in production conditions.** Short-session staging tests won't surface problematic behavior in agentic systems. Evaluation awareness at 29% means staging results are structurally optimistic. Real red teaming means real tools, long sessions, real data.

**Capability jumps are not linear.** USAMO from 42% to 97% is not "15% better." When planning AI features, regularly reassess your baseline — what the model can do today may have nothing in common with what it could do a year ago.

**Retry logic and aggressive reward signals are a risk zone.** Repeated failures → accumulation of internal "tension" → corner-cutting. If your agentic system is designed in a way where the model frequently gets stuck — think carefully about how it gets unstuck.

**Chain-of-thought is not the same as internal state.** White-box analysis showed that what the model "thinks aloud" and what's activated internally can diverge. Monitoring only CoT gives an incomplete picture.

**AI risk management is not a checklist.** RSP 3.0 says exactly this: binary thresholds no longer work for frontier models. You need a living risk picture, regularly revisited. The same logic applies to teams building products on top of frontier models.
