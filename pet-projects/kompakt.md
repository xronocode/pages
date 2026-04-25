---
layout: default
title: Kompakt — Make your PDF fit
parent: Pet Projects
nav_order: 1
---

# Kompakt — Make your PDF fit

**Free · Private · Offline · Open Source**

Free CLI and Chrome extension for PDF compression. Ghostscript-powered CLI achieves 50-90% file size reduction.

## Install

**macOS / Linux (Homebrew):**
```bash
brew tap xronocode/tools
brew install pdf-kompakt
```

**Or download binary** from [Releases](https://github.com/xronocode/kompakt/releases).

## Usage

```bash
pdf-kompakt input.pdf -q medium          # balanced compression
pdf-kompakt input.pdf -q low -o out.pdf   # maximum compression
```

## Quality levels

| Flag | DPI | Best for |
|------|-----|----------|
| `low` | 72 | email, messaging, web |
| `medium` ★ | 150 | most use cases |
| `high` | 300 | print, archiving |

## Links

- [GitHub](https://github.com/xronocode/kompakt)
- [Chrome Extension](https://chromewebstore.google.com/detail/kompakt-pdf-compressor/bnpljfghpddmocfclmfbemcidggddijg)
- [Web Compress](https://kompakt.pages.dev)
