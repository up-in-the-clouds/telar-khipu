# Telar User Documentation

Complete guide to creating digital storytelling exhibitions with Telar.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Google Sheets Setup](#google-sheets-setup)
3. [Project Configuration](#project-configuration)
4. [Adding Objects](#adding-objects)
5. [Creating Glossary Terms](#creating-glossary-terms)
6. [Building Stories](#building-stories)
7. [IIIF Coordinates](#iiif-coordinates)
8. [Layered Panels](#layered-panels)
9. [File Size Limits](#file-size-limits)
10. [Publishing](#publishing)
11. [Troubleshooting](#troubleshooting)

## Getting Started

Telar allows you to create digital exhibitions entirely through a web browser, with no local software installation required.

### Workflow Overview

1. Fork the Telar repository on GitHub
2. Set up your Google Sheet with exhibition content
3. Configure GitHub integration
4. Add images to your repository
5. Commit changes - site builds automatically
6. View your published exhibition

### Prerequisites

- GitHub account
- Google account (for Google Sheets)
- High-resolution images of your objects
- Exhibition narrative content

## Google Sheets Setup

### Creating Your Sheet

1. **Copy the Telar template** (link: [template URL])
2. **Rename** to your project name
3. **Organize tabs** - do not delete or reorder the first 4 tabs

### Tab Structure

Your Google Sheet should have these tabs in order:

#### Tab 1: Instructions
- Read-only reference
- Column definitions
- Example entries
- Keep this tab for reference

#### Tab 2: Project Setup
- Site configuration
- Stories list
- See [Project Configuration](#project-configuration) below

#### Tab 3: Objects
- Object metadata
- One row per object
- See [Adding Objects](#adding-objects) below

#### Tab 4: Glossary
- Term definitions
- One row per term
- See [Creating Glossary Terms](#creating-glossary-terms) below

#### Tab 5+: Stories
- One tab per story
- Story steps with coordinates
- See [Building Stories](#building-stories) below

### Publishing Your Sheet

Once your sheet is ready:

1. **File → Share → Publish to web**
2. **Choose**: "Entire document"
3. **Format**: "Comma-separated values (.csv)"
4. **Copy** the published URL
5. **Add** as GitHub repository secret (see [Publishing](#publishing))

## Project Configuration

The **Project Setup** tab has two sections:

### Section 1: Site Settings

Key-value pairs for site configuration:

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

Each row in the **Objects** tab represents one object in your collection.

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
- Add high-res image to `source_images/` folder
- Name file as `object_id.jpg` (e.g., `textile-001.jpg`)
- GitHub Actions generates IIIF tiles automatically

**Option B: External IIIF**
- Enter full info.json URL in `iiif_manifest` column
- Example: `https://iiif.example.org/image/abc123/info.json`

## Creating Glossary Terms

Each row in the **Glossary** tab represents one term.

### Required Columns

| Column | Description | Example |
|--------|-------------|---------|
| `term_id` | Unique identifier | `colonial-period` |
| `title` | Term name | `Colonial Period` |
| `short_definition` | One-sentence definition | `The era of Spanish colonial rule in the Americas (1492-1825).` |

### Optional Columns

| Column | Description | Example |
|--------|-------------|---------|
| `definition` | Full definition (can be long) | `The Colonial Period refers to...` |
| `image` | Image path | `/assets/images/glossary/colonial.jpg` |
| `related_terms` | Related term IDs (comma-separated) | `encomienda, viceroyalty` |

### Using Glossary Terms in Stories

Reference terms in your narrative text, and they'll automatically link to the glossary panel.

## Building Stories

Each **Story** tab contains story steps that make up your scrollytelling narrative.

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

**Method 1: Visual Estimation**
- Use a grid overlay to estimate positions
- Top-left quadrant: `x: 0.25, y: 0.25`
- Center: `x: 0.5, y: 0.5`
- Bottom-right quadrant: `x: 0.75, y: 0.75`

**Method 2: Interactive Preview** (future feature)
- Visual story editor will allow point-and-click coordinate selection

**Method 3: OpenSeadragon Inspector**
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

1. **Fork repository** on GitHub
2. **Enable GitHub Pages**:
   - Settings → Pages
   - Source: "GitHub Actions"
3. **Add repository secrets**:
   - Settings → Secrets → Actions
   - New secret: `GOOGLE_SHEETS_URL`
   - Value: Your published Google Sheets URL

### Workflow Triggers

The site rebuilds automatically when:
- You push commits to main branch
- You manually trigger "Build and Deploy" workflow
- (Optional) Daily at midnight (for Google Sheets updates)

### Deployment Process

1. GitHub Actions fetches CSVs from Google Sheets
2. Converts CSV to JSON
3. Generates IIIF tiles (if needed)
4. Builds Jekyll site
5. Deploys to GitHub Pages
6. Site live at: `https://[username].github.io/[repository]/`

### Update Workflow

**To update content:**
1. Edit Google Sheet
2. Go to GitHub → Actions
3. Run "Build and Deploy" workflow
4. Wait 2-5 minutes
5. Refresh your site

**To add images:**
1. Upload to `source_images/` via GitHub web interface
2. Commit changes
3. Workflow runs automatically
4. IIIF tiles generated

## Troubleshooting

### Site Not Building

**Check Actions tab:**
- Go to repository → Actions
- Look for red X (failed builds)
- Click failed workflow to see error logs

**Common issues:**
- Google Sheets URL not set
- Google Sheet not published
- CSV format errors (check column names)

### Images Not Displaying

**Checklist:**
- File name matches `object_id`
- File in `source_images/` directory
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

### Google Sheets Not Syncing

**Verify:**
- Sheet is published to web
- URL in repository secrets is correct
- Workflow has run since last sheet edit
- No CSV parsing errors in Actions logs

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
