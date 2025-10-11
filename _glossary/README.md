# Glossary Collection

This directory contains glossary term definitions. Terms can be referenced from chapters and displayed in panels or as standalone pages.

## File Naming

- Use the term name in lowercase with hyphens: `colonial-period.md`, `iiif-protocol.md`, etc.
- Keep names URL-friendly

## Required Front Matter

```yaml
---
layout: glossary
term_id: unique-term-id  # Used to reference in chapters
title: "Term Name"
short_definition: "A brief one-sentence definition (appears in glossary index)"
image: /assets/images/site/term-image.jpg  # Optional
related_terms:  # Optional
  - other-term-id
  - another-term-id
---
```

## Content

The markdown content below the front matter provides the full definition and explanation. You can use:

- Multiple paragraphs
- Markdown formatting
- Headings with `##` for subsections
- Lists for related concepts
- Links to external resources

## Usage in Chapters

To reference a glossary term in a chapter, use:

```html
<button class="panel-trigger" data-panel="glossary" data-term="term-id">
  Term Name
</button>
```

The term will open in a glossary panel overlay.

## Index Page

All terms are automatically listed alphabetically at `/glossary/`.

See `example-term.md` for a complete example.
