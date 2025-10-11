# Objects Collection

This directory contains metadata files for objects in your collection. Each object can be viewed individually and referenced in chapters.

## File Naming

- Use descriptive, URL-friendly names: `textile-001.md`, `ceramic-plate-blue.md`, etc.
- Avoid spaces and special characters

## Required Front Matter

```yaml
---
layout: object
object_id: unique-object-id  # Used to reference in chapters and IIIF paths
title: "Object Title"
description: "Brief description (1-2 sentences)"
creator: "Artist or maker name"
date: "circa 1800" or "1850-1860"
medium: "Oil on canvas" or "Ceramic"
dimensions: "50 x 70 cm"
location: "Museum or collection name"
credit: "Photo credit or copyright info"
thumbnail: /assets/images/site/thumbnail.jpg  # Optional
iiif_manifest: https://example.com/iiif/object/info.json  # OR use local IIIF
---
```

## IIIF Sources

You have two options for IIIF images:

### Option 1: Local Images (Recommended)

1. Place high-resolution images in a source directory (configured in GitHub Actions)
2. GitHub Actions will automatically generate IIIF tiles using Bodleian iiif-static-choices
3. Reference objects by `object_id` only (no `iiif_manifest` field)
4. Generated tiles will be at `/iiif/objects/{object_id}/`

### Option 2: External IIIF

- Use `iiif_manifest` field with full URL to external IIIF info.json
- Example: `https://iiif.example.org/image/abc123/info.json`

## Content

The markdown content below the front matter will be displayed on the object detail page. You can use:

- Multiple paragraphs
- Markdown formatting (bold, italic, links)
- Headings with `##`
- Lists
- Block quotes

See `example-object-01.md` for a complete example.
