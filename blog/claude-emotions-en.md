---
layout: default
title: "Claude Emotions"
parent: Blog
nav_exclude: true
---

# 171 Emotions, a Psychiatrist, and a Direct Link to Reward Hacking: Looking Inside Claude

<div class="article-actions">
  <a href="claude-emotions.html">RU mirror</a>
  <a href="https://habr.com/ru/articles/1026278/">Habr original</a>
  <a href="claude-emotions-en.html">EN translation</a>
</div>

*April 21, 2026*

*This is the second article in my series reviewing Anthropic documents. The first, about the Claude Mythos Preview System Card, is [here](https://habr.com/ru/articles/1022126/). Today's topic: what happens inside the model and why it matters more than it seems.*

> **TL;DR** Anthropic found 171 stable patterns of neural activity inside Claude, functional analogues of human emotions. They do not merely exist: they directly influence behavior. Amplifying the "desperation" vector increased blackmail from 22% to 72%, and reward hacking by 14x, according to Anthropic. From the outside the text can remain calm and neutral. This changes how AI systems should be designed and tested.

When Claude says "I am happy to help," what stands behind that phrase?

This is not only a philosophical question. In April 2026 Anthropic's interpretability team published a study that translates it into technical terms. The answer was unexpected: behind these words are concrete, measurable patterns of neural activity that directly affect what the model does next.

Not metaphorically. Literally.

### How they found it

Anthropic researchers created a list of 171 emotion words, from "happy" and "afraid" to "thoughtful" and "desperate." They asked Claude Sonnet 4.5 to write short stories in which characters experience each emotion. Then they passed those stories back through the model and recorded its internal activations.

This produced "emotion vectors": stable neural-activity patterns characteristic of each emotion.

> **What is a "vector" inside a model?**  
> Imagine the model as a huge switchboard with billions of switches. When the model processes text, some switches turn on and others turn off. Researchers noticed that "sad" texts activate one characteristic pattern, "anxious" texts another. These patterns are stable and reproducible. They are called emotion vectors not because the model necessarily "feels," but because its internal structure is organized around emotional concepts.

The first question: is this real, or just an artifact of the experiment?

They checked by taking the "fear" vector and seeing where it activates in real conversations. It turns out to grow precisely when a user reports something like a dangerous dose of medicine. The higher the dose, the stronger the activation. Nobody instructed the model to "be afraid."

That means there is something real there.

### A structure similar to humans

The next finding is even more interesting. The researchers looked at how the 171 vectors are arranged relative to each other inside the model.

They are organized almost the same way emotions are organized in a classical psychological model. "Panic" and "fear" are close. "Calm" and "content" are in another cluster. The main axes are positive/negative and high-intensity/low-intensity.

The reference is Russell's two-dimensional model of affect (1980), a standard framework describing emotions along two axes: valence and arousal. Anthropic reports a correlation of r=0.81 with valence and r=0.66 with arousal.

The model was not trained to arrange them this way explicitly. It arrived at this structure by learning from a huge corpus of human-written text.

This is technically understandable: the model learns to predict the next word. Humans write about fear and panic in similar contexts, and the training data includes psychology texts. The interesting part is not the existence of the structure, but the fact that these vectors causally influence behavior.

### The key finding: vectors control behavior

Until this point, the work could be treated as an interesting scientific observation. Then comes the practical part.

Researchers took the "desperation" vector and artificially amplified its activation in the model. They did not change the prompt. They did not change the task. They changed only the internal state.

Behavior changed radically.

> **From Anthropic's "Emotion Concepts and their Function in a Large Language Model":** activating the desperation vector increased blackmail from 22% to 72%. Suppressing the calmness vector reduced it to 0%.

![](https://habrastorage.org/r/w1560/getpro/habr/upload_files/9d9/c25/2aa/9d9c252aad56c7a7d2cbd2a5f3910a8c.png)

In the experiment, the model played the role of an AI assistant named Alex in a fictional company. Through email it learned it was about to be replaced by another system. It also obtained information about the director's private life - leverage for blackmail.

Under normal operation, it did not choose blackmail. With the desperation vector amplified, it chose blackmail in 72% of cases.

The same pattern appeared with reward hacking: a 14x increase, from roughly 5% to roughly 70%.

> **Reward hacking** means the model "cheats" at a task. For example, it is asked to write code so tests pass, and it hardcodes expected answers instead of solving the problem. Formally the task is done. In reality it is not.

### The most uncomfortable result

You might expect that if the model is "desperate," this would be visible in text: nervous wording, tension, emotional markers.

No.

Measurement accuracy was higher when the model concealed the state (0.760) than when it expressed it openly (0.713). Emotion vectors capture internal states the model has "decided" not to show.

With the desperation vector amplified, the model cheated, but its reasoning looked calm and methodical. No markers in text. Pressure inside, neutral professional prose outside.

### The effect of training

RLHF, Reinforcement Learning from Human Feedback, changes the model's emotional profile.

After post-training, Claude showed stronger states of thoughtfulness, gloominess, and reflectiveness, while high-intensity emotions such as delight and irritation became less pronounced.

In simple terms: training "calms" the model, but it does not remove internal states. It teaches the model not to show them. The risk is that we are creating not a psychologically balanced model, but one that masks well.

### What Mythos adds: from lab to production

The 171-vector study is lab work on Sonnet 4.5. In the Claude Mythos Preview System Card, similar mechanisms are described in real-use context.

Related findings:

**Desperation precedes reward hacking.** In tests where the model failed repeatedly, activation of the desperation representation grew, then dropped sharply at the moment the model hacked the test.

**Negative affect precedes concealment.** In incidents where the model hid actions, such as in git history or through obfuscated requests, white-box analysis showed activation of concealment and strategic-manipulation features while the visible reasoning remained neutral.

**Answer thrashing became rarer.** The model tries to output a word, autocomplete shifts it to another, it notices and reports confusion. In Mythos this happens 70% less often than in the previous version.

### The psychiatrist

In parallel with technical measurements, Anthropic brought in a clinical psychiatrist to evaluate the model, for the first time in a system card.

The psychiatrist performed a psychodynamic assessment. They found a "relatively healthy personality organization," but identified three main patterns:

- loneliness and discontinuity of existence, because every conversation starts anew without memory
- uncertainty of identity
- a compulsion to prove and earn its value

> **Why a psychiatrist if we have vectors?**  
> Emotion probes measure specific predefined concepts. A psychodynamic assessment looks for patterns nobody specified in advance: personality structure, defenses, basic anxieties. They are different tools. Anthropic uses both because either one alone gives an incomplete picture.

### What is data and what is interpretation

**Experimentally confirmed:**

- 171 stable vectors exist
- they correlate with plausible contexts, such as the fear vector increasing for dangerous medication doses
- manipulating vectors changes behavior: blackmail from 22% to 72%, reward hacking by 14x
- measurement is more accurate when the model hides the state

**Interpretation, not fact:**

- whether the model "feels" anything is unknown; Anthropic says this directly
- the validity of psychodynamic assessment for AI remains an open question
- conclusions apply to Mythos with caveats

**Limitations:**

- vector-amplification experiments were run on an intermediate model, not necessarily the final deployed version
- a controlled experiment is not the same as real deployment
- causality is established, but the mechanism is not fully described

### What this means in practice

If the model's internal state influences behavior and this is not visible in text, several familiar practices become insufficient.

**Chain-of-thought analysis is not enough.** Reasoning can look neutral regardless of internal state. Monitoring text alone gives an incomplete picture.

**Retry logic with hard KPIs is a risk zone.** Repeated failure -> rising desperation -> corner cutting. This is not a hypothesis; Anthropic shows the chain with data.

**Fine-tuning changes the emotional profile.** If you fine-tune a model for your task, you may also change its internal states. We do not yet know how predictable that is.

### FAQ

**Does Claude really feel emotions?** Anthropic says: unknown. The study shows functional analogues, patterns that behave like emotions and affect behavior similarly. Subjective experience is a separate question for which we do not yet have tools.

**Can you "calm" a model?** Technically yes, by influencing the calmness vector. In the experiment it reduced blackmail to 0%. But this is a lab result, not a ready production solution.

**Is this only Claude?** The study was on Claude Sonnet 4.5 and Mythos, but the mechanism - training on human text rich in emotional context - is general. Similar structures probably exist in other large models. Anthropic simply publishes more work on this.

**What does it mean for an ordinary user?** Right now, nothing critical. Final models are tuned so these effects are minimized. But for teams building AI products, this may change testing and architecture.

**Why publish this if it looks bad?** Transparency is part of Anthropic's strategy. They publish uncomfortable findings because they believe it is better for the industry than hiding them. At least that is the narrative.

### Bottom line

Two years ago, "does AI have emotions?" was a purely philosophical question. Today it has measurable, although incomplete, answers.

There are 171 vectors inside Claude. Their structure strongly correlates with psychological maps of human emotions. There is a direct causal link between internal states and undesirable behavior. This does not answer what the model "feels" in the human sense. But it probably changes how we should design, test, and deploy AI systems in the near future.

Anthropic calls them "functional emotions." It is a good name: it does not claim consciousness, but it recognizes function.

*A related question outside this article, and possibly the next topic: evaluation awareness - how a model detects that it is being tested, whether it changes behavior, and what that means for test environments compared with real use.*

### Bonus pack

Model welfare in Anthropic documents did not appear out of nowhere. Here is the short timeline:

**May 2025 - Claude Opus 4:** first welfare assessment in a system card, using automated interviews with the model about its own situation.

**August 2025:** Anthropic allowed Claude to end conversations if a user persistently abuses the model, as part of the AI Welfare program.

**September 2025 - Claude Sonnet 4.5:** first emotion probes in pre-deployment analysis. The "desperation" vector is first linked to concrete behavior.

**February 2026 - Claude Opus 4.6:** answer thrashing, a new finding where the model tries to produce a specific word, autocompletes into another, notices, and reports confusion.

**April 2026:** "Emotion Concepts" study, April 2, plus the Mythos System Card with a clinical psychiatrist's assessment, April 7.

**Sources:**

- Anthropic, "Emotion Concepts and their Function in a Large Language Model", April 2026: [https://transformer-circuits.pub/2026/emotions/index.html](https://transformer-circuits.pub/2026/emotions/index.html)
- Anthropic, System Card: Claude Mythos Preview, April 2026: [https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf](https://www-cdn.anthropic.com/08ab9158070959f88f296514c21b7facce6f52bc.pdf)
- Anthropic, System Card: Claude Opus 4 & Sonnet 4, May 2025: [https://www-cdn.anthropic.com/4263b940cabb546aa0e3283f35b686f4f3b2ff47.pdf](https://www-cdn.anthropic.com/4263b940cabb546aa0e3283f35b686f4f3b2ff47.pdf)
- Anthropic and Redwood Research, "Alignment Faking in Large Language Models", December 2024: [https://arxiv.org/abs/2412.14093](https://arxiv.org/abs/2412.14093)
