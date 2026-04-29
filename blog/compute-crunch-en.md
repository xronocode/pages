---
layout: default
title: "Compute Crunch"
parent: Blog
nav_order: 4
---

# Compute Crunch Is Here: How to Calculate LLM Economics in 2026

<div class="article-actions">
  <a href="compute-crunch.html">RU mirror</a>
  <a href="https://habr.com/ru/articles/1024850/">Habr original</a>
  <a href="compute-crunch-en.html">EN translation</a>
</div>

*April 17, 2026*

> *Build, buy, or hybrid: thinking about TCO. This is an invitation to discuss the framework, not an expert narrative with universal numbers.*

### "I told you so" - what happened to LLM API pricing

The two largest API providers changed their rhetoric at the same time. Anthropic introduced [usage-based billing for agentic frameworks](https://habr.com/ru/companies/bothub/news/1019222/): tokens instead of fixed subscriptions. Some third-party wrappers lost the ability to work through flat-rate plans. OpenAI simultaneously introduced [flexible pricing for Enterprise, Business, and EDU plans](https://help.openai.com/ru-ru/articles/11487671-flexible-pricing-for-the-enterprise-edu-and-business-plans): the subscription cost now scales with usage, not only with seats.

The trend of the last two years - "API prices get cheaper every quarter" - has not disappeared, but it now has an important caveat. **Price per token** has indeed fallen in public price lists. But in 2026 the key budget metric is no longer price per token. It is **cost per completed task**.

Several reasons:

1. **Reasoning modes consume output.** Opus 4.7, GPT-5.4 Thinking, and similar models generate hidden reasoning on complex tasks. You do not see it in the answer, but you pay for it as output tokens. Providers do not publish exact public tables for "effort level -> token overhead." Developer observations around GPT-5.4 suggest levels such as none, low, medium, high, and xhigh, with each step increasing output. Industry estimates range from 1.5-2x at medium to 3-4x at xhigh, but this is empirical, not a specification. Measure it on your own logs.

2. **New tokenizers can be more expensive in practice.** Opus 4.7 shipped with an updated tokenizer that may produce up to 35% more tokens on the same text. Anthropic release notes indicate 1.0-1.35x depending on content type, with the high end usually on code, structured data, and non-English text. If the price per token stays unchanged, the bill still grows: the same text costs more because it becomes more tokens.

3. **More complex tasks and broader organizational use.** As quality and autonomy improve, organizations give models more tasks of greater complexity. This indirectly increases usage inside the same departments and processes.

With the same token price, these effects can push actual spend well beyond planned budgets. In parallel, compute crunch is real: GPU demand grows faster than supply. H100 and B200 hardware in Russia and Central Asia comes with delivery delays and a serious markup. Self-hosting starts appearing in budgets of mid-sized companies not as an "optimization," but as a hedge against pricing shocks and supply risks.

So we need a decision framework.

### Three workload modes

I use three modes that affect calculations and planning.

**Experiments.** PoCs, hypotheses, prompt engineering, quality A/B tests. Here you want maximum quality to find a working solution. Almost always this means API, even an expensive frontier API, with minimal infrastructure investment. The exception is an experiment specifically designed to evaluate a local model, for example whether Llama 3.3 70B handles your domain task. Then you do need local infrastructure, but for the experiment, not production. An ML lead asking for a GPU cluster "to try an idea" without explaining why the idea requires a local model is questionable.

**Production workload.** Predictable traffic, strict SLA, sensitive data, stable quality. Here it makes sense to calculate the volume at which API stops being optimal. Open-source competes with API not on maximum quality, but on the cost floor at a "good enough" level.

**Resilience.** Protection from price shocks, supply risk such as rate limits and terms changes, and regulatory shock such as data-localization requirements. In 2024 this was the last slide in a deck called "possible risks." In 2026 it is often a separate budget line.

### Example TCO calculation for 100M tokens per month

The goal is to show calculation logic and boundaries of applicability, not produce an engineering specification for your case. Real costs depend on logs, task mix, and regulatory context.

#### Base assumptions

- **Token mix:** 70M input + 30M output. This is closer to RAG and analytical tasks. For generation-heavy tasks, shift toward output.
- **Task mix:** 80% simple tasks such as classification, extraction, summarization; 20% reasoning-heavy tasks such as analysis, agents, and complex generation with context.
- **Reasoning modes:** high/xhigh effort can generate much more output. Providers do not publish official tables. Measure on your logs before budgeting.
- **Tokenizer inflation:** 1.15x as an average for mixed Russian-English content, for example with Opus 4.7.
- **Overhead:** +15-30% for retries on 5xx errors, fallback to a more expensive model, and cache misses.
- **GPU utilization for self-hosting:** 60% as a production baseline. Below 40%, economics break.
- **Hardware amortization:** 36 months.
- **Team rates:** fully loaded: $100K/year global, $60K Russia, $40K Central Asia.

#### API formula

```text
TCO_tokens = (input x price_in + output x price_out x effective_mult)
             x 12 x tok_inflation x (1 + overhead)
```

where:

```text
effective_mult = simple_share + reasoning_share x reasoning_multiplier
```

`effective_mult` is the weighted average output multiplier across traffic. Simple tasks use 1.0. Reasoning tasks use 2-4. The result is the coefficient by which naive output must be multiplied to estimate real cost. Important: reasoning multiplier applies only to output tokens, not to the entire token sum.

Full TCO beyond tokens includes support FTE, compliance, and ML Ops tooling. Calculate them separately.

#### Frontier API example: Opus 4.7 at $5/$25

- effective_mult = 0.80 x 1 + 0.20 x 2.5 = **1.30**
- monthly base: 70M x $5 + 30M x $25 x 1.30 = $350 + $975 = **$1,325**
- annual: x 12 = **$15,900**
- with tokenizer factor 1.15: **$18,285**
- with 20% overhead: **$21,942**
- plus support FTE (0.2 x $100K = $20K) and compliance (~$15K): **~$57K/year**

With more aggressive assumptions, such as 50% reasoning, 4x multiplier, and 30% overhead, the range can reach roughly $75K/year.

Use this model as a directional guide.

### Example TCO across five deployment options

Annual TCO for the base scenario: 100M tokens/month, 80/20 mix, global region, typical team.

| Cost item | Frontier API | Mid-tier API | Hosted OSS | Self-host 14B | Self-host 70B |
| --- | ---: | ---: | ---: | ---: | ---: |
| Tokens / inference | $22K | $8K | $3K | - | - |
| GPU amortization | - | - | - | $18K | $55K |
| FTE | $20K | $20K | $40K | $200K | $350K |
| ML Ops tools | - | - | $23K | $45K | $45K |
| Compliance | $15K | $15K | $20K | $45K | $45K |
| **Annual TCO** | **~$57K** | **~$43K** | **~$86K** | **~$308K** | **~$495K** |
| Cost per 1M tokens | $48 | $36 | $72 | $257 | $413 |

#### Why 60-75% of self-host cost is people, not hardware

This is counterintuitive, so here is a concrete example.

Take self-hosted 70B with vLLM: 3 x A100, moderate region.

- GPU: 3 x $2,200/month x 12 = **$79,200/year**
- FTE: 3.5 engineers x $100K = **$350,000/year**
- ML Ops tools: **$45,000/year**
- Compliance: **$45,000/year**
- **Total: ~$519K/year**

Hardware share: $79K / $519K = **15%**. People: $350K / $519K = **67%**.

Why 3.5 FTE? This is not an abstract number. Production self-hosted LLM includes:

- Deployment and configuration of the inference stack: vLLM, batching, quantization
- **Eval pipeline:** without systematic quality evaluation, you will not know when the model degraded
- **Model updates:** Llama 3.3 -> Llama 4 is not one config line. It means evals, prompt retuning, A/B tests, rollback plans
- **Security and compliance:** log audit, access control, certification, especially in regulated verticals
- **Infra on-call:** GPU nodes fail, VRAM OOM happens at peaks, and your own rate limiter becomes a production system

For a 14B model with simpler tasks, 2.0 FTE and ~$308K TCO may be enough. For 70B, 3.5 FTE is more realistic.

> **Conclusion:** before counting GPUs, count people. Self-hosting becomes economically attractive only where the FTE already exists and is not hired solely for LLMs - that is, in teams with a mature ML platform.

### Self-host as anonymization infrastructure

This deserves a separate article, but the short pattern is important: **use a small local model as an anonymization gateway** before sending data to a frontier API.

Scenario: you have documents containing personal customer data or commercial information that cannot be sent outside in raw form. A local 7-14B model works as a preprocessing layer: it finds sensitive entities (names, taxpayer IDs, amounts, bank details), replaces them with synthetic placeholders, sends depersonalized text to the frontier API, receives the answer, and maps placeholders back to real data.

What changes in the calculation:

- self-hosted 7-14B for anonymization is much cheaper than self-hosting the main inference
- with 2 x A100, vLLM, and high utilization, the ballpark is $30-50K/year
- frontier API remains the main "brain" and costs about $57K/year in the 100M-token scenario
- total hybrid TCO: roughly $90-120K/year versus $308-495K for full self-host

This is effectively a **hybrid**. Many regulated companies will probably converge on this. The exact mix will differ: some need a simple 7B NER gateway, some need context-aware 14B preprocessing, and some can use classic ML classifiers and anonymization libraries such as Microsoft Presidio or DataFog.

The main point: this scenario does not eliminate self-host overhead. You still need ML infrastructure, DevOps, compliance, and security because the risk and regulatory questions do not disappear. But offloading the main reasoning workload to frontier API is much cheaper than full self-hosting.

### Decision matrix

Binary "build or buy" is dead. The decision is made across four axes.

**Axis 1 - Volume**

- <10M tokens/month: almost always API, unless regulation forces otherwise
- 10-500M: decision zone
- 500M+: self-host or hosted OSS can win on unit economics if the team is mature

**Axis 2 - Regulatory perimeter**

- Data can leave the perimeter: API
- Data is sensitive but DPA is acceptable: enterprise API contract
- Data cannot leave the perimeter: self-host or hybrid with anonymization

**Axis 3 - Latency and SLA**

- P95 above 2 seconds acceptable: API
- P95 below 500 ms and 99.9% uptime: self-host gives more control
- Streaming UX without strict SLA: API with fallback

**Axis 4 - Team maturity**

- No ML team: API
- 1-2 ML engineers: hosted OSS as an intermediate step
- 3+ ML/DevOps engineers with GPU experience: self-host is realistic

**Pure API.** Startup, PoC, unregulated domain, <10M tokens/month. Optimize prompts and model choice.

**Hosted OSS.** You need model flexibility, budget matters, and you do not want to operate hardware. Together AI, Fireworks, DeepInfra globally; Selectel and MTS AI in Russia. Open-source economics without the operational burden.

**Hybrid - the 2026 default for medium and large companies.** Frontier API for reasoning-heavy tasks (10-20%) plus local SLM or mid-tier API for routine tasks (80-90%). The anonymization pattern belongs here too.

**Full self-host.** Regulated verticals, >500M tokens/month, mature team, critical IP protection.

### Regional context: CIS and Central Asia

**Regulation is not a checkbox, it is a cost driver.** Russia's 152-FZ, Kyrgyzstan's personal-data law, and similar norms in Kazakhstan and Uzbekistan create a concrete constraint: if an LLM pipeline processes customer personal data, sending it to Anthropic or OpenAI may simply be impossible.

**GPU availability means scarcity, markup, and logistics overhead.** High-performance GPUs such as H100 and A100 are difficult for Russian and Central Asian companies to obtain under export restrictions. Deliveries go through intermediaries with logistics and compliance overhead, which creates a 20-40% markup and unstable supply.

### Code and API are a special case

Code is rarely personal data, and many organizations are willing to send it to external APIs.

Practical rule:

- refactoring, bug fixes, test generation -> mid-tier or local 7-14B; 5-10x savings without visible quality loss
- architecture decisions, security review, complex generation with 100K+ context -> frontier API with usage control
- hybrid approach: drafts locally, final review through frontier API with logging

### Checklist before making a decision

Measure:

1. Current and forecast token volume, input + output, by task
2. Share of tasks solved by mid-tier models versus requiring frontier models
3. Regulatory status of data: whether it can leave the perimeter and under what conditions
4. Available ML/DevOps FTE and their current load
5. Target SLA: latency P50/P95, uptime
6. Current API spend and six-month dynamics
7. Cost of downtime: how much the business loses per hour without LLM functionality

### Bottom line

The right question is not "subscription or hardware." The right question is: **which part of the AI stack are you ready to control, and do you have enough people for that control not to become a new source of risk?**

Self-hosting "to save on tokens" in 2026 is a weak case for almost everyone. Self-hosting for data control, latency, and supply hedge is a different conversation.

## Further reading

- [Anthropic removed "unlimited" for Claude agent scenarios - Habr/BotHub](https://habr.com/ru/companies/bothub/news/1019222/)
- [GPT-5.4 API Developer Guide: reasoning effort levels - NxCode](https://www.nxcode.io/resources/news/gpt-5-4-api-developer-guide-reasoning-computer-use-2026)
- [Claude Opus 4.7: The Real Cost Story Behind the Unchanged Price Tag - Finout](https://www.finout.io/blog/claude-opus-4.7-pricing-the-real-cost-story-behind-the-unchanged-price-tag)
- [Procurement strategies for Russian businesses under sanctions - TimeSavingMachine](https://timesavingmachine.com/blog/delivery/procurement-strategies-for-russian-businesses-sanctioned-it-equipment-supply/)
- [Avito: local LLMs for automation - Habr](https://habr.com/ru/companies/avito/articles/950926/)

*Disclaimer: all numbers are directional planning estimates. Before investment decisions, validate them on logs from your real traffic.*
