# Telar User Documentation

**Version:** 0.2.0-beta | **Release Date:** October 20, 2025

Complete guide to creating digital storytelling exhibitions with Telar.

> **⚠️ Beta Release Note**
> This documentation covers v0.2.0-beta which uses CSV files for content management. Google Sheets integration is planned for a future release.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Configuration](#project-configuration)
4. [Adding Objects](#adding-objects)
5. [Creating Glossary Terms](#creating-glossary-terms)
6. [Building Stories](#building-stories)
7. [IIIF Coordinates](#iiif-coordinates)
8. [Layered Panels](#layered-panels)
9. [File Size Limits](#file-size-limits)
10. [Publishing](#publishing)
11. [Troubleshooting](#troubleshooting)

## Getting Started

Telar allows you to create digital exhibitions using CSV files and markdown for content management.

### Workflow Overview

1. **Use the Telar template** on GitHub (click "Use this template" button)
2. **Edit CSV files** in `components/structures/` directory
   - `project.csv` - Site settings and stories list
   - `objects.csv` - Object metadata
   - `story-1.csv`, `story-2.csv`, etc. - Story steps with coordinates
3. **Edit markdown files** in `components/texts/` directory
   - `stories/` - Layer content for each story step
   - `glossary/` - Term definitions
4. **Add images** to `components/images/objects/` directory
5. **Commit changes** - GitHub Actions builds automatically
6. **View your published exhibition** at your GitHub Pages URL

### Prerequisites

- GitHub account
- Text editor or GitHub's web interface
- High-resolution images of your objects
- Exhibition narrative content

### Content Structure

Telar uses a **components-based architecture**:

```
components/
├── structures/        # CSV files (project, objects, stories)
├── texts/            # Markdown files (layers, glossary)
└── images/           # Source images for IIIF
```

## Project Configuration

The `components/structures/project.csv` file has two sections:

### Section 1: Site Settings

Key-value pairs for site configuration in CSV format:

| Key | Value | Description |
|-----|-------|-------------|
| `project_title` | Your Exhibition Title | Main site title |
| `tagline` | Brief description | Subtitle/tagline |
| `author` | Your Name | Site author |
| `primary_color` | `#2c3e50` | Main color (hex code) |
| `secondary_color` | `#8b4513` | Accent color (hex code) |
| `font_headings` | `Playfair Display, serif` | Heading font |
| `font_body` | `Source Sans Pro, sans-serif` | Body text font |
| `logo` | `/assets/images/site/logo.png` | Logo path (optional) |

### Section 2: Stories List

After site settings, add a row with key `STORIES`, then list stories:

| Key | Value |
|-----|-------|
| `STORIES` | (leave blank) |
| `1` | Introduction |
| `2` | Colonial Period |
| `3` | Modern Era |

## Adding Objects

Each row in `components/structures/objects.csv` represents one object in your collection.

### Required Columns

| Column | Description | Example |
|--------|-------------|---------|
| `object_id` | Unique identifier (no spaces) | `textile-001` |
| `title` | Object name | `Colonial Textile Fragment` |
| `description` | Brief description (1-2 sentences) | `A woven textile from the colonial period...` |

### Optional Columns

| Column | Description | Example |
|--------|-------------|---------|
| `creator` | Artist/maker | `Unknown Artist` |
| `date` | Creation date | `circa 1650-1700` |
| `medium` | Materials/technique | `Wool, natural dyes` |
| `dimensions` | Size | `45 x 60 cm` |
| `location` | Current location | `Metropolitan Museum` |
| `credit` | Photo credit | `Photo © Museum Name` |
| `thumbnail` | Thumbnail path | `/assets/images/thumbs/textile-001.jpg` |
| `iiif_manifest` | External IIIF URL | `https://iiif.example.org/...` |

### IIIF Options

**Option A: Local Images** (recommended)
- Leave `iiif_manifest` blank
- Add high-res image to `components/images/objects/` folder
- Name file as `object_id.jpg` (e.g., `textile-001.jpg`)
- GitHub Actions generates IIIF tiles automatically

**Option B: External IIIF**
- Enter full info.json URL in `iiif_manifest` column
- Example: `https://iiif.example.org/image/abc123/info.json`

## Creating Glossary Terms

Create markdown files in `components/texts/glossary/` for each term.

### File Format

Each term is a markdown file with YAML frontmatter:

```markdown
---
term_id: colonial-period
title: "Colonial Period"
related_terms: encomienda,viceroyalty
---

The Colonial Period in the Americas began with European colonization in 1492...
```

### Required Frontmatter Fields

| Field | Description | Example |
|-------|-------------|---------|
| `term_id` | Unique identifier | `colonial-period` |
| `title` | Term name | `Colonial Period` |

### Optional Frontmatter Fields

| Field | Description | Example |
|-------|-------------|---------|
| `related_terms` | Related term IDs (comma-separated) | `encomienda,viceroyalty` |

### Accessing Glossary Terms

In v0.1.0-beta, glossary terms are standalone pages accessible at `/glossary/{term_id}/`. Each term page shows:
- Full term definition
- Related terms (if specified)
- Back link to glossary index

**Note:** Automatic linking of terms within story narrative text is planned for v0.2.

## Building Stories

Each story CSV file in `components/structures/` (e.g., `story-1.csv`) contains story steps that make up your scrollytelling narrative.

### Required Columns

| Column | Description | Example |
|--------|-------------|---------|
| `step` | Step number | `1` |
| `question` | Step heading | `What is this textile?` |
| `answer` | Main narrative text | `This textile fragment shows...` |
| `object` | Object ID to display | `textile-001` |
| `x` | Pan position (horizontal, 0-1) | `0.5` |
| `y` | Pan position (vertical, 0-1) | `0.5` |
| `zoom` | Zoom level (1 = fit, higher = zoom in) | `1.5` |

### Optional Columns (Layer 1)

| Column | Description |
|--------|-------------|
| `layer1_title` | Panel heading |
| `layer1_text` | Detailed context |
| `layer1_media` | Image path |

### Optional Columns (Layer 2)

| Column | Description |
|--------|-------------|
| `layer2_title` | Panel heading |
| `layer2_text` | Scholarly detail |
| `layer2_media` | Image path |

### Example Story Row

```
step: 1
question: What is this textile?
answer: This textile fragment shows patterns typical of the colonial period.
object: textile-001
x: 0.5
y: 0.5
zoom: 1
layer1_title: Weaving Techniques
layer1_text: The interlocking warp pattern visible here indicates...
layer1_media: /assets/images/stories/weaving-detail.jpg
```

## IIIF Coordinates

Understanding the coordinate system for positioning the viewer.

### Coordinate System

- **Origin**: Top-left corner is `(0, 0)`
- **X-axis**: Horizontal, left (0) to right (1)
- **Y-axis**: Vertical, top (0) to bottom (1)
- **Zoom**: `1` = fit to viewer, `2` = 2x zoom, etc.

### Finding Coordinates

**Method 1: Built-in Coordinate Tool** (recommended)

Each object detail page includes an interactive coordinate identification tool:

1. **Navigate to object page**: Visit `/objects/{object_id}` while running Jekyll locally (or on your published site)
2. **Click "Identify coordinates"**: Button appears below the IIIF viewer
3. **Pan and zoom**: Click and drag the image, scroll to zoom in/out
4. **Watch coordinates update**: X, Y, and Zoom values update in real-time as you explore the image
5. **Copy values**: Use the copy buttons to grab:
   - **"Copy x,y,zoom"**: Copies just the three coordinate values (e.g., `0.654,0.312,2.5`)
   - **"Copy entire row"**: Copies a complete CSV row template with the object_id and coordinates pre-filled

**Workflow tip:** Keep the object page open in one browser tab while editing your story CSV file in another. As you identify important details in the image, copy the coordinates directly into your story step rows.

**Method 2: Visual Estimation**
- Use a grid overlay to estimate positions
- Top-left quadrant: `x: 0.25, y: 0.25`
- Center: `x: 0.5, y: 0.5`
- Bottom-right quadrant: `x: 0.75, y: 0.75`

**Method 3: OpenSeadragon Inspector** (for advanced users)
1. Open your story in browser
2. Open browser console (F12)
3. Type: `TelarStory.viewer.viewport.getCenter()`
4. Returns current x, y coordinates

### Common Patterns

```
Full view:     x: 0.5,  y: 0.5,  zoom: 1
Top detail:    x: 0.5,  y: 0.3,  zoom: 2
Bottom detail: x: 0.5,  y: 0.7,  zoom: 2
Left detail:   x: 0.3,  y: 0.5,  zoom: 2
Right detail:  x: 0.7,  y: 0.5,  zoom: 2
Extreme zoom:  x: 0.x,  y: 0.y,  zoom: 4
```

## Layered Panels

Telar supports three layers of progressive content disclosure.

### Layer 1: Additional Context

- Opens from main narrative
- Provides more detailed information
- Can include images
- Use for: extended descriptions, related context

### Layer 2: Scholarly Detail

- Opens from Layer 1
- Deep scholarly analysis
- Citations and references
- Use for: academic context, methodology, provenance

### Glossary Panels

- Opens from any layer
- Term definitions
- Related concepts
- Use for: specialized vocabulary, key concepts

### Panel Workflow

```
Main Narrative
    ↓ "Read more"
Layer 1
    ↓ "Learn more"
Layer 2

Any Layer
    ↓ "Term"
Glossary Panel
```

### Writing for Panels

**Main Narrative:**
- Engaging, accessible prose
- 2-4 short paragraphs per step
- Pose questions, invite exploration

**Layer 1:**
- 3-5 paragraphs
- Provide historical context
- Include supporting images

**Layer 2:**
- Scholarly depth
- Citations and references
- Technical analysis

**Glossary:**
- Clear definition
- Historical background
- Related terms

## File Size Limits

### GitHub Repository Limits

- **Individual file**: 100 MB maximum
- **Repository total**: 1 GB recommended
- **IIIF tiles**: Generated tiles count toward total

### Image Guidelines

**Source Images:**
- Format: JPEG or TIFF
- Resolution: 300 DPI minimum
- Size: 4000-8000 pixels on long edge
- Color: RGB or grayscale
- Compression: Minimal (high quality)

**For images > 100 MB:**
1. Compress with quality tools (e.g., Photoshop "Save for Web")
2. Use external IIIF (Option B)
3. Use Git LFS (advanced users)

**Generated IIIF Tiles:**
- A 5000x7000px image generates ~5-10 MB of tiles
- A 10000x14000px image generates ~20-40 MB of tiles
- 20-30 high-res objects = ~500 MB tiles

### Managing Large Collections

**Strategy 1: Selective High-Res**
- Hero objects: Full resolution
- Supporting objects: Medium resolution (3000px)
- Background objects: Low resolution (1500px)

**Strategy 2: External IIIF**
- Host large images on institutional IIIF server
- Use Telar for interface only
- No GitHub storage limits

**Strategy 3: Multiple Repositories**
- Split large project into multiple exhibitions
- Cross-link between exhibitions
- Each stays under 1 GB

## Publishing

### Initial Setup

1. **Use this template** - Click "Use this template" button on GitHub
2. **Enable GitHub Pages**:
   - Settings → Pages
   - Source: "GitHub Actions"

### Workflow Triggers

The site rebuilds automatically when:
- You push commits to main branch
- You manually trigger "Build and Deploy" workflow in Actions tab

### Deployment Process

1. GitHub Actions processes CSV files from `components/structures/`
2. Converts CSV to JSON for Jekyll
3. Generates IIIF tiles from images in `components/images/objects/`
4. Builds Jekyll site
5. Deploys to GitHub Pages
6. Site live at: `https://[username].github.io/[repository]/`

### Update Workflow

**To update content:**
1. Edit CSV files in `components/structures/` or markdown in `components/texts/`
2. Commit and push changes to GitHub
3. GitHub Actions runs automatically
4. Wait 2-5 minutes for build
5. Refresh your site

**To add images:**
1. Upload images to `components/images/objects/` via GitHub web interface
2. Name files as `{object_id}.jpg` to match your objects.csv entries
3. Commit changes
4. GitHub Actions generates IIIF tiles automatically

## Troubleshooting

### Site Not Building

**Check Actions tab:**
- Go to repository → Actions
- Look for red X (failed builds)
- Click failed workflow to see error logs

**Common issues:**
- CSV format errors (check column names match exactly)
- Missing required CSV files in `components/structures/`
- Syntax errors in CSV files (unclosed quotes, extra commas)
- Missing images referenced in objects.csv

### Images Not Displaying

**Checklist:**
- File name matches `object_id` in objects.csv
- File in `components/images/objects/` directory
- File size under 100 MB
- Image format supported (JPEG, PNG, TIFF)

**Debug:**
- Check browser console for errors
- Verify IIIF info.json exists: `/iiif/objects/[id]/info.json`
- Check GitHub Actions logs for IIIF generation errors

### Viewer Not Panning/Zooming

**Check coordinates:**
- `x` and `y` between 0 and 1
- `zoom` is positive number
- All values are numbers, not text

**Debug:**
- Open browser console
- Check for JavaScript errors
- Verify OpenSeadragon loaded

### Panels Not Opening

**Check story data:**
- `layer1_title` and `layer1_text` both filled
- Step has panel trigger button
- JavaScript loaded without errors

## Advanced Topics

### Custom Styling

Edit `assets/css/telar.css` to customize colors, fonts, and layout.

### Multiple Languages

Future feature - contact maintainers for early access.

### Custom Domains

Configure custom domain in GitHub Pages settings.

### Local Development

See README.md for local Jekyll setup instructions.

## Getting Help

- GitHub Issues: Report bugs and request features
- Documentation: [link to docs site]
- Email: [support email]
- Community: [Discord/forum link]
