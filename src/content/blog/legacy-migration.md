---
title: "\"Where Are the New Features?\" — How AI-Driven Legacy Migration Is Returning the IT Budget to Business"
description: "~75% of bank IT budgets go to legacy upkeep. In 2026, rewriting became cheaper than maintaining for the first time."
date: 2026-05-23
num: "08"
tags: ["legacy", "banking", "ai-agents"]
mirrors:
  ru: /blog/legacy-migration-ru/
  habr: https://habr.com/ru/articles/1038146/
---

*Anyone who has operated and evolved enterprise systems knows this eternal complaint from the business side: "We spend so much on IT — and the result is zero. No new products. Or they appear painfully slowly." And the business is right, in its own way. If less than 20 cents of every IT dollar reaches the customer as new products, the speed of product delivery will be exactly what it is — unsatisfactory.*

## TL;DR

- ~75% of bank IT budgets are a legacy tax. Less than 20 cents of every IT dollar reaches the customer as new products. With a stagnating budget, that number approaches 5%.
- In 2026, the economics of rewriting fell below the economics of maintenance for the first time. Cloudflare: 194K lines in one week, $1,100. Yandex: 97K lines in 2 months instead of a year. CLPS: the first AI-driven core banking migration.
- AI agents cut routine development tasks by 46% (McKinsey, 4,500 developers). Banks on modern cores: +60% revenue growth, +40% profit (Accenture).
- Code has become a consumable. The knowledge inside it is the asset. AI migration is semantic extraction, not legacy destruction.
- "If it works, don't touch it" was a rational strategy — until the cost of not touching it exceeded the cost of rewriting.

---

## The scale of the problem: where 20 cents come from and where the other 80 go

| Source | Share | What's included | Year |
|--------|-------|----------------|------|
| [Deloitte Tech Trends](https://www2.deloitte.com/us/en/insights/focus/tech-trends.html) | **74%** | 55% maintenance + 19% mandatory upgrades | 2024 |
| [Gartner](https://www.gartner.com/en/information-technology) | **60–80%** | Maintenance + run-the-business | 2024–2025 |
| [Forrester](https://www.forrester.com/) | **60–72%** | Keeping the lights on | 2024 |
| [McKinsey (banking IT)](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/managing-bank-it-spending-five-questions-for-tech-leaders) | **~70–80%** | + 20% of "new" budget leaks back into tech debt | 2024 |
| **Average** | **~75%** | Nominally ~25% remains | — |

Nominally ~25% remains. But only if the IT budget keeps growing — and that is exactly the situation at large banks: [McKinsey reports](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/managing-bank-it-spending-five-questions-for-tech-leaders) 5–10% annual growth in banking IT spend. Each year the budget increases, and that increment is what allows at least some investment in new development while keeping the legacy afloat.

If the budget is flat (or grows slower than the inflation of technical costs), the arithmetic gets harsh. Every new product shipped to production starts generating its own tech debt: it needs support, updates, patches. The legacy share of the budget doesn't shrink — it only grows. In that scenario, the share of "free money for development" trends not toward 20% but toward 5%. This is mathematics, not pessimism.

To feel the scale: JPMorgan Chase is spending [$19.8 billion on technology in 2026](https://mlq.ai/news/jpmorgan-increases-tech-spending-to-nearly-20-billion-amid-ai-driven-transformation/). At a 75/25 split, that's ~$15 billion just to keep existing systems from falling apart. JPMorgan's CFO [spoke about this](https://www.constellationr.com/blog-news/insights/jpmorgan-chase-s-it-ai-bets-where-returns-are) at Investor Day in March 2026.

That was the old reality.

---

## What changed in 2026

Legacy wasn't exactly ignored. It was addressed — as best people could. By throwing bodies at it. Hiring teams for support, teams for modernization, teams for "parallel runs" of old and new. Budgets grew [5–10% annually](https://www.mckinsey.com/capabilities/tech-and-ai/our-insights/tech-forward/managing-bank-it-spending-five-questions-for-tech-leaders) — and that growth was absorbed by legacy. This is the rate of personnel cost indexation. More people — more code — more tech debt — more people. A closed loop.

In 2026, three circumstances converged to break that loop.

### Rewriting became cheaper than maintaining

This is the key shift. Previously, "rewrite from scratch" was synonymous with catastrophe and doubling budgets for the duration of a transformation with timelines over a year. A year or more of doubled IT budget? Only a handful of organizations could afford that, and only in desperate situations where the entire business was at stake. Now [IDC reports](https://www.ai-infra-link.com/balancing-legacy-systems-with-modern-platform-engineering-in-2026/): 45% of modernization budgets in 2026 are directed at AI-driven solutions. Not experiments — budget line items. The [Stanford AI Index 2025](https://aiindex.stanford.edu/report/) estimates the accuracy of AI legacy-code conversion at ~85%. A year ago it was 60–70%.

### AI agents learned to work with project context

The difference is like that between a calculator and an accountant. [67% of developers](https://habr.com/ru/articles/1014910/) already use AI tools, but a next-generation agent can read an entire codebase, build a dependency graph, plan a migration, and execute it iteratively — with self-verification via tests after each step. The developer checks control points, essentially accepting work, adjusting priorities and formulations, refining tasks.

### Documented public case studies appeared

Before 2026, AI migration was a theoretical possibility. Now there are concrete results — and they are what change the conversation with the board and stakeholders from "let's try" to "let's calculate."

> According to [SoftServe 2025](https://www.softserveinc.com/en-us/blog/cobol-modernisation-with-llms) and [Bandarupalli et al. 2025](https://arxiv.org/abs/2504.11335), agentic AI achieves 85–93% accuracy in COBOL→Java conversion — versus 75% for manual migration. Similar measurements from [FreshBrew](https://arxiv.org/pdf/2510.04852) show AI agent accuracy at 5x that of rule-based tools.

---

## Case 1: Cloudflare vinext — $1,100 for a framework

On February 24, 2026, [Cloudflare published a blog post](https://blog.cloudflare.com/vinext) that sparked discussion across the entire IT community.

The story: a single engineer — Steve Faulkner, Engineering Director at Cloudflare — rewrote Next.js from scratch in one week using AI (Claude Opus, OpenCode). Next.js is the world's most popular React framework, built by a large Vercel team over 10 years. The result was named vinext. This is not a prototype. Cloudflare already has customers running vinext in production.

---

## Case 2: Yandex Browser — 97,000 lines in 2 months instead of a year

In May 2026, Yandex [published a case study on Habr](https://habr.com/ru/companies/yandex/articles/1028494/) that is particularly telling because of its proximity to real-world enterprise conditions.

**The problem:** the iOS app of Yandex Browser contained 10,038 files and 541,856 lines of Objective-C. The team had imposed a "moratorium on new ObjC code" and begun manual migration to Swift. Over five years — from 2020 to 2025 — they had rewritten just over 50%.

**The reasons:** a massive volume of legacy, tangled inter-module dependencies, and the constant need to ship product. Manual rewriting is monotonous work, prone to errors.

In 2025 the team began automating the migration with LLMs. The result: 97,000 lines migrated from Objective-C to Swift in 2 months — instead of over a year with the manual approach. Yandex [open-sourced the tooling](https://habr.com/ru/companies/yandex/articles/1028494/). "Infinite tech debt" became a "reproducible process."

---

## Case 3: CLPS — core banking in Hong Kong

In March 2026, CLPS Technology — a [Nasdaq-listed IT company](https://www.prnewswire.com/news-releases/clps-incorporation-announces-ai-driven-cobol-to-java-migration-solution-to-accelerate-core-banking-modernization-302712319.html) based in Hong Kong specializing in banking software — announced the completion of a PoC for AI-driven migration of a major bank's core banking system.

The bank's core was migrated from a legacy COBOL stack to Java. The key difficulty in such cases: there is no documentation, and there are virtually no COBOL developers left in the world. The business logic — decades of accumulated rules, edge cases, and workarounds — was recovered from the "black box" through a knowledge graph: the AI agent analyzed the code and built a graph of dependencies and business processes.

> Knowledge graphs as a development tool for recovering and transferring business logic to an agent are not exotic — they are an emerging standard. I advocate the GRACE methodology (Graph-RAG Anchored Code Engineering), developed by Vladimir Ivanov ([@turboproject](https://t.me/turboproject)), and actively apply the standards built on its foundation in my projects — including [AI Standards](https://github.com/aka-NameRec/ai-standards) and the open [GRACE specification](https://github.com/osovv/grace-marketplace). The essence: semantic markup of the codebase, knowledge graphs, module contracts, and verification plans — everything that turns code (including legacy "black boxes") into a structure that both AI agents and humans can work with. If this interests you, I recommend looking into it — it fundamentally changes the approach to development and especially migration.

**Why this matters:** this is the first publicly documented AI migration of a core banking system. Not a frontend. Not a mobile app. Hard-core banking on COBOL. With business logic that "nobody remembers, but everything depends on."

---

## The economics of transition: what it means for business

Three case studies — proof of possibility. But when you go to the board with a proposal to "rewrite our core with AI," the first question won't be about technology. It will be about money.

There are two levels of answer.

**First — operational.** [McKinsey conducted the largest study to date](https://www.mckinsey.com/capabilities/quantumblack/our-insights) (4,500 developers, 150 companies, February 2026) and found: AI tools cut routine development tasks by **46%**. Not an abstract "productivity boost" — but concrete hours freed from writing tests, documentation, and refactoring. Hours that can be redirected to what the customer actually sees.

**Second — strategic.** [Accenture Banking Trends 2026](https://www.accenture.com/content/dam/accenture/final/industry/banking/document/Banking-Top-Trends-FY26-Report-Final.pdf) provides the business outcome: banks that moved to a modern core show **+60% revenue growth and +40% profit** compared with banks on legacy. The GenAI potential for the world's top 200 banks: **$289 billion per year**. That is the number the board understands.

Translated into our metaphor: if AI migration can reduce the maintenance share from 75% to even 30–40% of the budget (which is what JPMorgan achieved over several years and billions of dollars), the ratio flips. Instead of less than 20 cents per dollar, 60–70 cents go toward building product. The business finally gets an answer to the eternal question "where does our IT money go." And IT can finally stop burning out, stop making excuses, and start building.

---

## The honest section: where this doesn't work yet

### AI doesn't touch architecture

The ["Agentic Refactoring" study](https://habr.com/ru/articles/967380/) showed: 52% of AI refactorings target maintainability, 28% target readability. Architectural changes — less than 10%. AI handles 80% of the work excellently — routine, monotonous, voluminous. But the decision to "break a monolith into microservices" or "switch from event sourcing to CQRS" remains a human task. AI is an amplifier, not a replacement for the architect.

### Without discipline — disaster

There is a [cautionary case from T2 on Habr](https://habr.com/ru/companies/t2/articles/1027862/): a team tried AI migration without changing their process. On the surface, everything looked impressive — productivity surged. But on review, "large chunks of ready code" appeared that nobody had understood. Speed without comprehension is not speed — it's deferred problems.

### 1:1 migration ≠ modernization

It's tempting to think that rewriting equals improving. It doesn't. An AI agent excels at 1:1 porting — the same logic on a new stack. But if the architecture was poor in COBOL, it will be poor in Java too. You'll get "new legacy on modern technology." The right approach: lift-and-shift first (move 1:1, fast, cheap), then refactor on the modern stack with modern tools.

### The regulator doesn't speed up

AI speeds up code, but it doesn't speed up central bank approvals. In banks, a full core migration means reverse-engineering business rules for audit, regulatory approval, parallel system runs under compliance oversight. That's months of paperwork that cannot be automated.

### Proprietary code and the cloud

The value of code as text approaches zero — it can be generated for pennies. But the business logic inside that code — decades of edge cases, compromises, regulatory workarounds — remains the asset. Code has become a consumable; the knowledge inside it is intellectual property. AI migration is not the destruction of legacy — it's semantic extraction.

### PoC ≠ production

Cloudflare vinext — production. Yandex Browser — production with millions of users. CLPS core banking — still a PoC. Full-scale industrial AI migration of core banking is still ahead. But judging by the pace of tool development, "PoC passed in 2026" means "production within 12–18 months."

---

## Summary

Today a bank spends a dollar on IT — and less than 20 cents of it reach the customer as new products. The rest is a tax on the past. With a stagnating budget — even less.

AI-driven legacy migration is not a silver bullet. It's not "fire the developers and replace them with a neural network." It's a tool that allows doing what was previously economically impossible: rewriting systems for which there were never enough people, budget, or — let's be honest — motivation. Because "if it works, don't touch it" was a rational strategy. Until the cost of not touching it exceeded the cost of rewriting.

The question is not "should we migrate off legacy?" The question is — will you flip the ratio before someone else does it for you?
