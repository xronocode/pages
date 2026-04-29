---
layout: default
title: "Pointing the Model"
parent: Blog
nav_order: 5
---

# Pointing the Model at What Matters

<div class="article-actions">
  <a href="pointing-finger.html">RU mirror</a>
  <a href="https://habr.com/ru/articles/1022862/">Habr original</a>
  <a href="pointing-finger-en.html">EN translation</a>
</div>

*April 13, 2026*

You have probably noticed this: the same question in ChatGPT or Claude sometimes produces an excellent answer, and sometimes the quality is not what you expected. Many people write this off as "AI unpredictability." In reality, there is also a structural reason.

In April 2025, Anthropic published official prompt-engineering guidance for Claude 4.6: [Prompting Best Practices](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices). It is a technical document for API developers, not something a mass user is expected to read.

But it contains a few insights that are useful for everyone.

### How a model "looks" at text

A transformer, the architecture behind modern language models, processes text through attention. Simplified: every token "looks" at other tokens and estimates how important each of them is for understanding the current one.

![Full attention vs sparse attention](https://habrastorage.org/r/w1560/getpro/habr/upload_files/075/a77/882/075a7788271f5e65b148ef9e3b528cf5.png)

*Full attention vs sparse attention*

This means the model does not read text left to right the way a human does. It builds a map of relationships between all parts of the input at once.

> **A non-obvious conclusion follows from this.** It feels natural for a human to give a task gradually: first the topic, then a clarification, then more context as the conversation develops. Iteration does refine the request, but it also accumulates risk. Each new clarification is layered on top of previous context. The model's attention is distributed across the whole conversation, earlier parts receive less weight, and interpretation may drift. The more complete and precise the context is from the start, the less uncertainty you create. That is a separate topic, but keep it in mind.

The problem with an ordinary prompt is that this map becomes blurry. Where do instructions end and data begin? Where is the example, and where is the actual task? The model has to guess, spending part of its attention budget on parsing instead of solving.

### What XML tags do

Take two prompts with identical content.

**Without structure:**

    You are an analyst. Here is March sales data. Write a conclusion in three sentences.
    Data: 1,200 transactions, average check 850 soms, churn 12%.
    Example of a good conclusion: concise, with numbers, without value judgments.

**With structure:**

```xml
<role>You are a data analyst</role>

<data>
  1,200 transactions, average check 850 soms, churn 12%
</data>

<instructions>
  Write a conclusion in three sentences
</instructions>

<example>
  Concise, with numbers, without value judgments
</example>
```

The content is identical. But in the second case, opening and closing tags create paired anchors. Tokens inside `<data>` receive high weight relative to each other and lower weight relative to `<instructions>`. The model no longer has to guess where things are. We are literally pointing at what matters relative to what.

![Full attention: nested anchors](https://habrastorage.org/r/w1560/getpro/habr/upload_files/d70/cd3/e6a/d70cd3e6ac140553381168faa3a88b4b.png)

*Full attention: nested anchors*

With nested tags, the hierarchy of weights is built automatically: the outer pair covers the whole content, the inner pair creates a local cluster inside it. The model "sees" the document structure without extra explanation.

This is not surprising. Models were trained on huge corpora of HTML, XML, and code. Attention has learned to recognize paired structures as semantic boundaries.

That is why Anthropic included XML tags in its official Claude 4.6 recommendations: *"XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs."* This is not a random blog tip. It is the model developer's position, based on how the model works internally.

> **Honest caveat**  
> For a short one-off prompt, XML is overkill. The structure is easy to infer. XML gives a noticeable benefit when the prompt is longer and contains semantically similar blocks. For a simple single request, plain text works fine.

### Why this shows up in long contexts

Full attention, where every token attends to every other token, works well on short texts. But it has quadratic complexity: twice the context means four times the computation. On long contexts, models switch to sparse attention: each token attends only to nearby neighbors plus a small number of "global" tokens.

This means a token at the beginning of a long prompt may have no direct connection to a token at the end. The model does not "see" the entire context as a single whole. It sees fragments.

XML tags act as structural beacons. The opening and closing tag create a local cluster with high mutual attention inside the block. The model does not have to reach across the whole context; the boundary is visible locally.

![Full attention vs sparse attention](https://habrastorage.org/r/w1560/getpro/habr/upload_files/075/a77/882/075a7788271f5e65b148ef9e3b528cf5.png)

*Full attention vs sparse attention*

> **Context, and therefore the prompt, grows.** Even if the first request is short, after several exchanges the context already contains the whole dialogue: your messages, the model's answers, and the data you inserted. By the fifth iteration, sparse attention may already be active. The more compact and structured each block is from the start, the longer the model keeps seeing the whole context rather than fragments. Prompt structure is an investment not only in the first answer, but in the whole session.

### Three patterns that work immediately

You do not need to rebuild all prompts at once. You do not need complex instructions. Use tags where one text mixes different kinds of content:

| Task | Tags |
| --- | --- |
| Mixed content: instructions + data | `<instructions>`, `<data>` |
| Examples inside a prompt | `<examples>`, `<example>` |
| Role + task + constraints | `<role>`, `<task>`, `<constraints>` |

### Boundary as a principle

Once you start thinking about this as a principle, not a syntax trick, the area of application expands.

If a model searches for boundaries, the prompt author's task is to make those boundaries explicit. Do not merely explain them through meaning. Mark them structurally. It works for a single request. It works for a long session. It works for a document.

This is the same principle behind document markup in the GRACE methodology, which [I wrote about earlier](https://habr.com/ru/articles/1020548/). When a model receives an unmarked document, it guesses the structure. When every semantic block is wrapped in a tag, it knows the boundaries of responsibility precisely. Same mechanism, different scale.

Prompt engineering is often presented as a bag of tricks. In reality, most techniques that work reduce to one thing: help the model avoid guessing.

XML tags are one of the most direct ways to do that. And this is not theory; Anthropic explicitly recommends them in the official documentation for its latest model.

### Bonus: what else to read on Habr

Before publishing, I collected Habr articles on adjacent topics. They range from practical advice to architectural details.

**XML and prompt structure**

- [Prompt Engineering: Design Patterns. Part 1 - XML tags](https://habr.com/ru/articles/946944/) - analysis of 26 agentic systems: almost 60% use custom tags. Agent-focused, but useful as evidence of the pattern.
- [How prompt optimization turned from shamanism into engineering](https://habr.com/ru/articles/994624/) - prompt as a model parameter, algorithmic optimization.
- [The basic minimum. Part 2: prompt engineering](https://habr.com/ru/articles/988920/) - a good overview with discussion in comments.

**Attention mechanism, technical level**

- [Anatomy of transformers: why ordinary self-attention is no longer used](https://habr.com/ru/articles/986140/) - NSA, global/local/selected branches, long-context anchors.
- [Native Sparse Attention from DeepSeek](https://habr.com/ru/articles/887136/) - sparse attention architecture.
- ["AI without borders": teaching Transformer to process long texts](https://habr.com/ru/articles/773312/) - long-context methods, sparse vs full attention.
- [Timeless thinking and the art of prompting](https://habr.com/ru/articles/1021108/) - how attention distinguishes "before" and "after" in a prompt.
- [Telegram discussion](https://t.me/c/1467914348/129733)
