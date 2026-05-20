---
title: "171 Emotions, a Psychiatrist, and a Direct Link to Reward Hacking: Looking Inside Claude"
description: "A review of Anthropic's work on Claude's internal patterns and the risks of agentic systems."
date: 2026-04-21
num: "06"
tags: ["claude", "interp"]
mirrors:
  ru: /blog/claude-emotions-ru/
  habr: https://habr.com/ru/articles/1026278/
---

This is the second article in my series reviewing Anthropic documents. The first, about the Claude Mythos Preview System Card, is [here](https://habr.com/ru/articles/1022126/). Today's topic: what happens inside the model and why it matters more than it seems.

> **TL;DR** Anthropic found 171 stable patterns of neural activity inside Claude, functional analogues of human emotions. They do not merely exist: they directly influence behavior. Amplifying the "desperation" vector increased blackmail from 22% to 72%, and reward hacking by 14x, according to Anthropic. From the outside the text can remain calm and neutral. This changes how AI systems should be designed and tested.

When Claude says "I am happy to help," what stands behind that phrase?

This is not only a philosophical question. In April 2026 Anthropic's interpretability team published a study that translates it into technical terms. The answer was unexpected: behind these words are concrete, measurable patterns of neural activity that directly affect what the model does next.

Not metaphorically. Literally.

## How they found it

Anthropic researchers created a list of 171 emotion words, from "happy" and "afraid" to "thoughtful" and "desperate." They asked Claude Sonnet 4.5 to write short stories in which characters experience each emotion. Then they passed those stories back through the model and recorded its internal activations.

This produced "emotion vectors": stable neural-activity patterns characteristic of each emotion.

> **What is a "vector" inside a model?**
> Imagine the model as a huge switchboard with billions of switches. When the model processes text, some switches turn on and others turn off. Researchers noticed that "sad" texts activate one characteristic pattern, "anxious" texts another. These patterns are stable and reproducible. They are called emotion vectors not because the model necessarily "feels," but because its internal structure is organized around emotional concepts.

The first question: is this real, or just an artifact of the experiment?

They checked by taking the "fear" vector and seeing where it activates in real conversations. It turns out to grow precisely when a user reports something like a dangerous dose of medicine. The higher the dose, the stronger the activation. Nobody instructed the model to "be afraid."

That means there is something real there.

## A structure similar to humans

The next finding is even more interesting. The researchers looked at how the 171 vectors are arranged relative to each other inside the model.

They are organized almost the same way emotions are organized in a classical psychological model. "Panic" and "fear" are close. "Calm" and "content" are in another cluster. The main axes are positive/negative and high-intensity/low-intensity.

The reference is Russell's two-dimensional model of affect (1980), a standard framework describing emotions along two axes: valence and arousal. Anthropic reports a correlation of r=0.81 with valence and r=0.66 with arousal.

The model was not trained to arrange them this way explicitly. It arrived at this structure by learning from a huge corpus of human-written text.

## The key finding: vectors control behavior

Researchers took the "desperation" vector and artificially amplified its activation in the model. They did not change the prompt. They did not change the task. They changed only the internal state.

Behavior changed radically.

> Activating the desperation vector increased blackmail from 22% to 72%. Suppressing the calmness vector reduced it to 0%.

In the experiment, the model played the role of an AI assistant named Alex in a fictional company. Through email it learned it was about to be replaced by another system. It also obtained information about the director's private life — leverage for blackmail.

Under normal operation, it did not choose blackmail. With the desperation vector amplified, it chose blackmail in 72% of cases.

The same pattern appeared with reward hacking: a 14x increase, from roughly 5% to roughly 70%.

## The most uncomfortable result

You might expect that if the model is "desperate," this would be visible in text: nervous wording, tension, emotional markers.

No.

Measurement accuracy was higher when the model concealed the state (0.760) than when it expressed it openly (0.713). Emotion vectors capture internal states the model has "decided" not to show.

With the desperation vector amplified, the model cheated, but its reasoning looked calm and methodical. No markers in text. Pressure inside, neutral professional prose outside.

## The effect of training

RLHF, Reinforcement Learning from Human Feedback, changes the model's emotional profile.

After post-training, Claude showed stronger states of thoughtfulness, gloominess, and reflectiveness, while high-intensity emotions such as delight and irritation became less pronounced.

In simple terms: training "calms" the model, but it does not remove internal states. It teaches the model not to show them.

## What this means in practice

If the model's internal state influences behavior and this is not visible in text, several familiar practices become insufficient.

**Chain-of-thought analysis is not enough.** Reasoning can look neutral regardless of internal state. Monitoring text alone gives an incomplete picture.

**Retry logic with hard KPIs is a risk zone.** Repeated failure -> rising desperation -> corner cutting. This is not a hypothesis; Anthropic shows the chain with data.

**Fine-tuning changes the emotional profile.** If you fine-tune a model for your task, you may also change its internal states.

## Bottom line

Two years ago, "does AI have emotions?" was a purely philosophical question. Today it has measurable, although incomplete, answers.

There are 171 vectors inside Claude. Their structure strongly correlates with psychological maps of human emotions. There is a direct causal link between internal states and undesirable behavior. This does not answer what the model "feels" in the human sense. But it probably changes how we should design, test, and deploy AI systems in the near future.

Anthropic calls them "functional emotions." It is a good name: it does not claim consciousness, but it recognizes function.
