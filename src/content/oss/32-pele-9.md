---
date: 2026-10-22
status: merged
repo: obsidianmd/pele
pr: "#9"
title: "Sankey: accept Unicode node names"
description: "Merged upstream: pele #9, Unicode node names in Sankey diagrams, closing issue #8 — the request to make Sankey accept non-ASCII node names in the diagram engine Obsidian ships. The design that survived review splits the pipeline: the lexer keeps treating input as CSV bytes, while decoded Unicode names pass through as XML entities; rahul05ranjan signed off on that split in review. kepano merged it on 2026-10-22, folding in two main-sync merges and adding his own regression test for double-encoded entity codes. The merge landed the day after pele 1.8.0 shipped, so Unicode Sankey reaches users in the next release — and Mark, our Tauri 2 port of Mark Text currently on pele 1.6.0, inherits the fix with a dependency bump."
num: "32"
links:
  - label: "View PR"
    url: "https://github.com/obsidianmd/pele/pull/9"
---
