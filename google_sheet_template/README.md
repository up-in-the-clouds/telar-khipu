# Telar Google Sheets Template - Instructions

Welcome to the Telar Google Sheets template! This spreadsheet is your authoring interface for creating digital storytelling exhibitions.

## Overview

This template has **5 CSV files**:

1. **01-instructions.csv** - Read-only reference
2. **02-project-setup.csv** - Site configuration and stories list
3. **03-objects.csv** - Collection metadata
4. **04-glossary.csv** - Term definitions
5. **05-stories.csv** - All story steps for all stories

## Example Data

The template includes an **"example" column** in most tabs with real data from the [Colonial Landscapes](https://colonial-landscapes.com) project. These examples show:

- **Story titles** (Project Setup): Four stories from a real exhibition
- **Objects** (Objects tab): The 1614 Bogotá painting and related items
- **Glossary terms** (Glossary tab): Colonial history terminology
- **Story steps** (Story tabs): A complete narrative arc with coordinates and layers

**You can**:
- Study the examples to understand the format
- Use them as a starting point for your own content
- Delete the "example" column when you're ready

The examples complement the placeholder data in the main columns.

## Important Rules

⚠️ **DO NOT**:
- Change column header names (case-sensitive)
- Delete required columns
- Leave empty rows between data rows
- Remove this Instructions tab

✅ **DO**:
- Fill in all required fields
- Use consistent naming for object_id and term_id
- Keep coordinates between 0 and 1
- Publish to web when ready

---

## Tab 2: Project Setup

### Section 1: Site Settings (Key-Value Pairs)

| Column A: key | Column B: value | Description |
|---------------|-----------------|-------------|
| `project_title` | Your Exhibition Title | Main site title |
| `tagline` | Brief description | Subtitle/tagline |
| `author` | Your Name | Site author |
| `email` | contact@example.com | Contact email |
| `primary_color` | #2c3e50 | Main color (hex) |
| `secondary_color` | #8b4513 | Accent color (hex) |
| `font_headings` | Playfair Display, serif | Heading font |
| `font_body` | Source Sans Pro, sans-serif | Body font |
| `logo` | /assets/images/site/logo.png | Logo path |

### Section 2: Stories List

After site settings, leave a blank row, then:

| Column A: key | Column B: value | Column C: example |
|---------------|-----------------|-------------------|
| `STORIES` | *(leave blank)* | example |
| `1` | Story 1 Title | A painting of the savannah |
| `2` | Story 2 Title | Villages for the "indios" |
| `3` | Story 3 Title | From terraces to grasslands |
| `4` | *(optional)* | A divided landscape |

*Note: Column C shows examples from Colonial Landscapes. Delete this column when customizing.*

---

## Tab 3: Objects

One row per object in your collection.

### Required Columns:
- **object_id**: Unique identifier (no spaces, e.g., `textile-001`)
- **title**: Object name
- **description**: Brief description (1-2 sentences)

### Optional Columns:
- **creator**: Artist or maker
- **date**: Creation date (e.g., `circa 1650-1700`)
- **medium**: Materials and technique
- **dimensions**: Physical size
- **location**: Current location
- **credit**: Photo credit
- **thumbnail**: Thumbnail path (optional)
- **iiif_manifest**: External IIIF URL (optional)
- **example**: Marks example rows (delete this column when customizing)

### IIIF Options:
- **Local images**: Leave `iiif_manifest` blank, add image to `source_images/` folder
- **External IIIF**: Fill `iiif_manifest` with full info.json URL
- **Never use both** for the same object

---

## Tab 4: Glossary

One row per term.

### Required Columns:
- **term_id**: Unique identifier (e.g., `colonial-period`)
- **title**: Term name (e.g., `Colonial Period`)
- **short_definition**: One-sentence definition (for glossary index)

### Optional Columns:
- **definition**: Full definition (can be multiple paragraphs)
- **image**: Image path
- **related_terms**: Comma-separated term IDs (e.g., `encomienda,viceroyalty`)
- **example**: Marks example rows (delete this column when customizing)

---

## File 5: Stories (05-stories.csv)

All story steps for all stories in a single CSV file.

### Required Columns:
- **step**: Step number (1, 2, 3...)
- **question**: Step heading/question
- **answer**: Main narrative text
- **object**: Object ID from Objects tab
- **x**: Pan X coordinate (0-1)
- **y**: Pan Y coordinate (0-1)
- **zoom**: Zoom level (1 = fit, higher = zoom in)

### Optional Columns (Layer 1):
- **layer1_button**: Button label (e.g., "Learn more")
- **layer1_title**: Panel heading (content-specific title)
- **layer1_text**: Detailed context
- **layer1_media**: Image path

### Optional Columns (Layer 2):
- **layer2_button**: Button label (e.g., "Go deeper")
- **layer2_title**: Panel heading (content-specific title)
- **layer2_text**: Scholarly detail
- **layer2_media**: Image path
- **example**: Marks example rows (delete this column when customizing)

**Note**: The `layer1_button` and `layer2_button` fields contain generic button labels that appear in the narrative ("Learn more", "Go deeper"). The `layer1_title` and `layer2_title` fields contain specific content titles that appear when the panels open.

### Coordinate System:
- Origin (0, 0) = top-left corner
- X-axis: 0 (left) to 1 (right)
- Y-axis: 0 (top) to 1 (bottom)
- Center: x=0.5, y=0.5
- Zoom: 1=full view, 2=2x zoom, etc.

---

## File Size Limits

### GitHub Repository Limits:
- **Individual images**: 100 MB maximum
- **Total repository**: Keep under 1 GB
- **20-30 high-res objects**: Optimal for GitHub Pages

### Image Guidelines:
- **Format**: JPEG or TIFF
- **Resolution**: 300 DPI minimum
- **Size**: 4000-8000 pixels on long edge
- **Compression**: High quality

### For Large Collections:
- Use external IIIF for large images
- Compress images before upload
- Consider multiple repositories for 50+ objects

---

## Publishing Your Sheet

When ready to use:

1. **File → Share → Publish to web**
2. Select: **Entire document**
3. Format: **Comma-separated values (.csv)**
4. Check: **Automatically republish when changes are made**
5. **Publish** and copy the URL
6. Add URL to GitHub repository secrets as `GOOGLE_SHEETS_URL`

---

## Getting GID Values

Each tab has a unique GID for GitHub Actions:

1. Click on a tab
2. Look at URL: `...#gid=1234567890`
3. Note the GID number
4. Update `.github/workflows/build.yml` with GIDs

---

## Help & Documentation

- **Full Documentation**: See DOCS.md in repository
- **Template Specification**: See GOOGLE_SHEETS_TEMPLATE.md
- **GitHub Issues**: Report bugs and ask questions
- **Repository**: https://github.com/UCSB-AMPLab/telar

---

## Quick Validation Checklist

Before publishing:

- [ ] All required CSV files present (01-instructions, 02-project-setup, 03-objects, 04-glossary, 05-stories)
- [ ] Column headers match exactly (case-sensitive)
- [ ] No empty rows between data
- [ ] Object IDs consistent across files
- [ ] Coordinates are decimals (0.5 not 50%)
- [ ] File paths start with `/`
- [ ] External IIIF URLs are complete
- [ ] Button labels (layer1_button, layer2_button) are generic
- [ ] Panel titles (layer1_title, layer2_title) are content-specific
- [ ] Sheet published to web as CSV
- [ ] Auto-republish enabled

---

**You're ready to create your exhibition!** Fill in the other tabs and publish when complete.
