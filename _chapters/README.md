# Chapters Collection

This directory contains chapter files for your Telar exhibition. Each chapter is a scrollytelling narrative that guides viewers through IIIF objects.

## File Naming

- Use numbers and descriptive names: `01-introduction.md`, `02-colonial-period.md`, etc.
- The number prefix helps maintain order

## Required Front Matter

```yaml
---
layout: chapter
title: "Chapter Title"
chapter_number: 1
description: "Brief description of the chapter"
first_object: "object-id"  # The IIIF object to display initially
previous_chapter: null  # or /chapters/previous-chapter/
next_chapter: /chapters/next-chapter/  # or null
objects:
  - object-id-1
  - object-id-2
glossary_terms:
  - term-id-1
steps:
  - id: step-1
    object: object-id
    x: 0.5
    y: 0.5
    zoom: 1
    layer1:
      title: "Layer 1 Title"
      text: "Layer 1 content"
      media: "/path/to/image.jpg"
    layer2: null
---
```

## Story Steps

Story steps are the scrollable sections that make up your narrative. Each step should include:

```html
<div class="story-step"
     data-step="1"
     data-object="object-id"
     data-x="0.5"
     data-y="0.5"
     data-zoom="1">
  <h2>Question or heading</h2>
  <p>Main narrative content...</p>
  <p><button class="panel-trigger" data-panel="layer1" data-step="step-1">Read more →</button></p>
</div>
```

## Coordinates

- `x`, `y`: Normalized coordinates (0-1) for pan position
- `zoom`: Zoom level (1 = fit to viewer, higher = zoomed in)
- `region`: Alternative to x/y/zoom, use IIIF region format "x,y,w,h"

See `01-example-chapter.md` for a complete example.
