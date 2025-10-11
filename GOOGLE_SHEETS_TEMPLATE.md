# Google Sheets Template for Telar

This document describes the structure of the Google Sheets template used for Telar exhibitions.

## Template Structure

The Google Sheet should have the following tabs in this exact order:

1. **Instructions** (Tab 1)
2. **Project Setup** (Tab 2)
3. **Objects** (Tab 3)
4. **Glossary** (Tab 4)
5. **Chapter 1** (Tab 5)
6. **Chapter 2** (Tab 6)
7. ... (additional chapter tabs as needed)

## Tab 1: Instructions

Read-only reference tab with documentation.

### Content

This tab should contain:
- Overview of the template structure
- Column definitions for each tab
- Example entries
- Tips for using the template
- Links to full documentation

### Format

Free-form text and tables for reference. This tab is not processed by the system.

## Tab 2: Project Setup

Site configuration and chapter list in a single tab.

### Section 1: Site Settings

Key-value pairs for site-wide configuration.

| Column A: key | Column B: value |
|---------------|-----------------|
| `project_title` | Your Exhibition Title |
| `tagline` | A brief description of your exhibition |
| `author` | Your Name or Institution |
| `email` | contact@example.com |
| `primary_color` | #2c3e50 |
| `secondary_color` | #8b4513 |
| `font_headings` | Playfair Display, serif |
| `font_body` | Source Sans Pro, sans-serif |
| `logo` | /assets/images/site/logo.png |

### Section 2: Chapter List

After site settings, add a separator row and list chapters.

| Column A: key | Column B: value |
|---------------|-----------------|
| `CHAPTERS` | *(leave blank)* |
| `1` | Introduction to the Collection |
| `2` | Colonial Period Textiles |
| `3` | Modern Interpretations |
| `4` | Conclusion |

### Notes

- Leave blank rows between sections for readability
- All values in Column B
- Chapter numbers in Column A after CHAPTERS marker
- Chapter titles in Column B

## Tab 3: Objects

Collection object metadata - one row per object.

### Column Definitions

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| `object_id` | Yes | text | Unique identifier (no spaces) | `textile-001` |
| `title` | Yes | text | Object name | `Colonial Textile Fragment` |
| `description` | Yes | text | Brief description | `A woven textile fragment showing traditional patterns` |
| `creator` | No | text | Artist or maker | `Unknown Artist` |
| `date` | No | text | Creation date | `circa 1650-1700` |
| `medium` | No | text | Materials and technique | `Wool, natural dyes, plain weave` |
| `dimensions` | No | text | Physical dimensions | `45 x 60 cm` |
| `location` | No | text | Current location | `Metropolitan Museum, New York` |
| `credit` | No | text | Photo credit | `Photo © 2024 Metropolitan Museum` |
| `thumbnail` | No | path | Thumbnail image path | `/assets/images/thumbs/textile-001.jpg` |
| `iiif_manifest` | No | url | External IIIF info.json URL | `https://iiif.example.org/image/abc/info.json` |

### Row 1: Headers

```
object_id | title | description | creator | date | medium | dimensions | location | credit | thumbnail | iiif_manifest
```

### Example Rows

```
textile-001 | Colonial Textile | A fragment showing... | Unknown | circa 1650 | Wool | 45x60cm | Met Museum | Photo © Met | /assets/thumbs/t001.jpg |
ceramic-002 | Blue Ceramic Plate | Decorative plate with... | Juan Pérez | 1720 | Ceramic, glaze | 30cm diameter | Private Collection | | | https://iiif.example.org/...
```

### Notes

- **Local IIIF**: Leave `iiif_manifest` blank and add image to `source_images/` as `object_id.jpg`
- **External IIIF**: Fill `iiif_manifest` with full info.json URL
- **Never use both** `iiif_manifest` and local image for same object
- Use `|` to separate columns in these examples (actual spreadsheet uses cells)

## Tab 4: Glossary

Glossary term definitions - one row per term.

### Column Definitions

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| `term_id` | Yes | text | Unique identifier | `colonial-period` |
| `title` | Yes | text | Term name | `Colonial Period` |
| `short_definition` | Yes | text | One-sentence definition | `The era of Spanish rule (1492-1825)` |
| `definition` | No | text | Full definition | `The Colonial Period refers to...` |
| `image` | No | path | Illustrative image | `/assets/images/glossary/colonial.jpg` |
| `related_terms` | No | list | Comma-separated term IDs | `encomienda, viceroyalty, crown` |

### Row 1: Headers

```
term_id | title | short_definition | definition | image | related_terms
```

### Example Rows

```
colonial-period | Colonial Period | The era of Spanish rule (1492-1825) | The Colonial Period in the Americas began... | /assets/images/glossary/colonial.jpg | encomienda, viceroyalty
encomienda | Encomienda | Labor system in colonial Spanish America | The encomienda was a system... | | colonial-period, tribute
viceroyalty | Viceroyalty | Administrative division of Spanish Empire | A viceroyalty was the highest... | /assets/images/glossary/viceroyalty.jpg | colonial-period, viceroy
```

### Notes

- Keep `short_definition` to one sentence (for glossary index)
- Use `definition` column for longer explanations (optional)
- Separate `related_terms` with commas, no spaces
- Related terms must exist as other rows in the glossary

## Tab 5+: Chapter Tabs

One tab per chapter, containing story steps.

### Tab Naming

- **Chapter 1** (not "01" or "Chapter_1")
- **Chapter 2**
- **Chapter 3**
- etc.

### Column Definitions

| Column | Required | Type | Description | Example |
|--------|----------|------|-------------|---------|
| `step` | Yes | number | Step number | `1` |
| `question` | Yes | text | Step heading | `What is this textile?` |
| `answer` | Yes | text | Main narrative | `This textile shows patterns typical of...` |
| `object` | Yes | text | Object ID | `textile-001` |
| `x` | Yes | number | Pan X (0-1) | `0.5` |
| `y` | Yes | number | Pan Y (0-1) | `0.5` |
| `zoom` | Yes | number | Zoom level | `1.5` |
| `layer1_title` | No | text | Layer 1 heading | `Weaving Techniques` |
| `layer1_text` | No | text | Layer 1 content | `The interlocking warp pattern...` |
| `layer1_media` | No | path | Layer 1 image | `/assets/images/chapters/detail.jpg` |
| `layer2_title` | No | text | Layer 2 heading | `Technical Analysis` |
| `layer2_text` | No | text | Layer 2 content | `Microscopic analysis reveals...` |
| `layer2_media` | No | path | Layer 2 image | `/assets/images/chapters/microscope.jpg` |

### Row 1: Headers

```
step | question | answer | object | x | y | zoom | layer1_title | layer1_text | layer1_media | layer2_title | layer2_text | layer2_media
```

### Example Rows

**Step 1: Introduction**
```
1 | What is this textile? | This textile fragment shows patterns typical of colonial weaving traditions. | textile-001 | 0.5 | 0.5 | 1 | Weaving Techniques | The interlocking warp pattern... | /assets/weaving.jpg | Technical Analysis | Microscopic analysis... | /assets/micro.jpg
```

**Step 2: Zoom Detail**
```
2 | What do we see in this pattern? | Notice the repeating geometric motifs in red and blue. | textile-001 | 0.3 | 0.3 | 2.5 | Symbolic Meaning | These geometric patterns represent... | /assets/symbols.jpg | | |
```

**Step 3: Switch Object**
```
3 | How does this compare? | This later textile shows European influence. | textile-002 | 0.5 | 0.5 | 1 | European Contact | After 1650, Spanish motifs... | /assets/european.jpg | | |
```

### Notes

- **Sequential steps**: Number steps 1, 2, 3, 4... (no gaps)
- **Coordinates**: x and y must be decimal numbers between 0 and 1
- **Zoom**: Typically 1 (full view) to 4 (extreme detail)
- **Same object**: Steps can reuse same object ID with different x/y/zoom
- **Switch objects**: Change object ID to load different image
- **Optional layers**: Leave Layer 2 columns blank if not needed
- **Markdown**: Use basic markdown in text fields: `**bold**`, `*italic*`, `[link](url)`

## Publishing Your Sheet

Once your sheet is complete:

1. **File → Share → Publish to web**
2. Select: **Entire document**
3. Format: **Comma-separated values (.csv)**
4. Check: **Automatically republish when changes are made**
5. **Publish** and copy the URL
6. Add URL to GitHub repository secrets as `GOOGLE_SHEETS_URL`

## GID Values for GitHub Actions

Each tab has a unique GID needed for the workflow:

1. In Google Sheets, open a tab
2. Look at URL: `...#gid=1234567890`
3. Note the GID number for each tab
4. Update `.github/workflows/build.yml` with correct GIDs

### GID Mapping

```yaml
# In build.yml, replace these placeholders:

PROJECT_SETUP_GID: 0  # Usually 0 for first content tab
OBJECTS_GID: 123456789  # Your Objects tab GID
GLOSSARY_GID: 234567890  # Your Glossary tab GID
CHAPTER_1_GID: 345678901  # Your Chapter 1 tab GID
CHAPTER_2_GID: 456789012  # Your Chapter 2 tab GID
# etc.
```

## Template Checklist

Before publishing your sheet:

- [ ] All 4 required tabs present (Instructions, Project Setup, Objects, Glossary)
- [ ] At least one Chapter tab
- [ ] All required columns present in each tab
- [ ] Column headers match exactly (case-sensitive)
- [ ] No empty rows between data rows
- [ ] Object IDs match between Objects tab and Chapter tabs
- [ ] Coordinates are decimal numbers (0.5 not 50%)
- [ ] File paths start with `/`
- [ ] External IIIF URLs are complete info.json URLs
- [ ] Sheet published to web as CSV
- [ ] Auto-republish enabled

## Example Data

See the `_chapters/01-example-chapter.md`, `_objects/example-object-01.md`, and `_glossary/example-term.md` files for examples of how the data should be structured.

## Getting Help

If you have questions about the template:
- Review DOCS.md for detailed usage instructions
- Check example files in the repository
- Open an issue on GitHub
