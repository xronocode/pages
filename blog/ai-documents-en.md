---
layout: default
title: "GRACE-DOCX"
parent: Blog
nav_order: 7
---

# Your AI Cannot Edit Long Documents. Here Is Why - and How to Fix It

<div class="article-actions">
  <a href="ai-documents.html">RU mirror</a>
  <a href="https://habr.com/ru/articles/1020548/">Habr original</a>
  <a href="ai-documents-en.html">EN translation</a>
</div>

*April 7, 2026*

You open a chat. You upload an 80-page contract or a 200-page corporate policy. You write: *"Add a new clause to section 4.2 about the approval procedure."*

The AI reads the whole document. It finds, or fails to find, the right place. It inserts something. Sometimes it lands correctly, sometimes it does not. Sometimes it breaks formatting in nearby tables. Sometimes it forgets that the same section must also be synchronized with an appendix.

The problem is not model power. The problem is that the model is working blind: there is no document map, no editing policy, no understanding of what is connected to what or what must not be touched.

## Context rot and iterative drift: two symptoms of the same disease

The first reaction to this complaint is usually: "just use a model with a larger context window." Anyone who has tried this knows it does not solve the problem.

The problem is called **context rot**. A 2025 [Chroma study](https://www.trychroma.com/research/context-rot) tested 18 frontier models and found that every model degrades as context grows, including GPT-4.1, Claude Opus 4, and Gemini 2.5. This is not a bug in one vendor's model. It is an architectural property of transformers. Stanford showed the mechanism: accuracy drops by more than 30% when the relevant information is in the middle of the context rather than at the beginning or the end. There is also a Habr article on **BABILong** by AIRI/MIPT covering the same theme.

With documents, this appears in two modes. **The first** is one-off: the model reads the whole document, but misses the exact section or does not include all fragments needed for the edit. **The second** is cumulative iterative drift: the first edit is clean, the second almost clean, and by the fifth the model starts rephrasing things you did not ask to change, moving paragraphs, and rewriting tables in its own interpretation. Each iteration adds more history to the context, and the model loses track of what is the correct current document state and what is just an intermediate artifact.

### How AI currently works with .docx in chat

When you give a Word document to an AI assistant, something like this happens:

```text
1. Unpack the .docx, because it is a ZIP archive with XML inside
2. Extract text from word/document.xml
3. Put all of it into context
4. Ask the model to find the right place
5. Generate the edit
6. Pack the file back and return it to the chat
```

This approach has three fundamental problems.

**First: blind navigation.** The model scans thousands of paragraphs sequentially. There is no map, no bookmarks, no concept that paragraph 847 is the beginning of "Appendix B" and that the table after it has a strictly fixed column structure.

**Second: no editing rules.** The model does not know that column headers in this document must not be changed. It does not know that if threshold values are updated in one section, another section must be synchronized. It knows nothing beyond what you put into the prompt right now.

**Third: no verification.** After the edit, nobody checks that Word bookmarks still align, that a table has not lost a row, and that the XML structure remains valid.

Existing solutions work around this in different ways. Some chunk the document and use RAG. Some use templating tools such as `docxtpl` (Jinja2 + python-docx). These are valid methods, but for episodic work with large documents they are too complex for most users.

What if we go the other way?

## The idea: the document should teach the agent how to work with it

This idea came from software development. Vladimir Ivanov ([@turboplanner](https://t.me/turboplanner)) created **GRACE** (Graph-RAG Anchored Code Engineering) to fight context rot in codebases: each module gets a contract before code is written, each code block is marked semantically, and a knowledge graph keeps an up-to-date map of the project. The agent does not work blind. It reads the graph, finds the module, follows the contract, and verifies the result. The methodology repository is [osovv/grace-marketplace](https://github.com/osovv/grace-marketplace).

I took the same logic and applied it to `.docx`.

The idea: **instead of explaining the document structure to the agent in every prompt, embed that knowledge directly into the file**. Once. So that any agent opening the file immediately understands:

- what sections exist and where they are
- what can and cannot be touched
- what must be synchronized during an edit
- how to verify that nothing broke

I called this approach **GRACE-DOCX**: **G**overned, **R**ecoverable, **A**utonomous, **C**ontract-based **E**diting.

## One prompt, and the document becomes smart

Here is the [bootstrap prompt](https://github.com/xronocode/grace-docx/blob/main/grace-docx-bootstrap.md). It instructs the agent to perform several simple but important steps:

**Step 1 - Analysis.** Unpack `.docx`, walk through `word/document.xml`, record all H1/H2 headings, paragraph ranges, number of tables in each section, and cross-references between sections.

**Step 2 - Module map.** Assign a short Module ID to each H1 section (`M-PROC`, `M-APP-A`, `M-GLOSS`, and so on). Record exact paragraph ranges and subsections.

**Step 3 - XML metadata.** Create five files inside the `.docx` archive: manifest (entry point), graph (module map), contracts (editing rules), instructions (agent protocol), and verification (structural invariants).

**Step 4 - Bookmarks.** Inject `w:bookmarkStart/End` into each H1 paragraph in `document.xml`. This is a standard Word mechanism and is not visible to the user.

**Step 5 - Registration.** Register the new XML parts in `[Content_Types].xml` and `word/_rels/document.xml.rels`.

**Step 6 - Packaging.** Pack everything back into `.docx`.

**Step 7 - Report.** Print a summary: number of modules, bookmarks, cross-links, and Module IDs.

The whole process is one command, one file, a few minutes.

### Before and after

The difference is fundamental: the agent is no longer guessing. It follows the protocol that it generated.

![The document and prompt were provided as input. We check that Claude understood everything.](https://habrastorage.org/r/w1560/getpro/habr/upload_files/2d4/f95/0d9/2d4f950d905185b9b7d345f0b162f0ad.png)

*The document and prompt were provided as input. We check that Claude understood everything.*

![Claude describes how its life changed](https://habrastorage.org/r/w1560/getpro/habr/upload_files/db3/f36/6ce/db3f366cebf5a9d5bf30d45b2bc25a17.png)

*Claude describes how its life changed.*

### What it solves and what it does not

**Solves:**

- Navigation and surgical edits in large documents
- Iterative drift: the agent does not rewrite things it was not asked to change
- Synchronization of related sections
- Reproducibility: different sessions, different agents, same behavior because the document carries its own rules
- Token cost and context-window pressure in many scenarios

**Does not solve:**

- Semantic understanding of the content; the LLM is still responsible for that
- Content versioning; that is a separate problem, although changes can be recorded

**Open questions:**

- Extending the approach to `.xlsx` (sheets as modules) and `.pptx` (slides and objects as modules)
- Images, diagrams, embedded DOM-like objects, and finer work with tables
- Tooling and MCP integration so that agents can call this as a tool

### Repository

[**https://github.com/xronocode/grace-docx**](https://github.com/xronocode/grace-docx)

Pull requests are welcome. I am especially interested in unusual document cases and implementations for other formats.
