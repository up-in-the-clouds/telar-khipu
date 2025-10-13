# Telar

A minimal computing framework for creating digital storytelling exhibitions with IIIF images and scrollytelling narratives.

## Overview

Telar (Spanish for "loom") is a static site generator built on Jekyll that weaves together IIIF images, narrative text, and layered contextual information into interactive digital exhibitions. It follows minimal computing principles: plain text authoring, static generation, and sustainable hosting.

Telar is developed by Adelaida Ávila, Juan Cobo Betancourt, Santiago Muñoz, and students and scholars at the [UCSB Archives, Memory, and Preservation Lab](https://ampl.clair.ucsb.edu), the UT Archives, Mapping, and Preservation Lab, and [Neogranadina](https://neogranadina.org).

## Key Features

- **Zero-installation authoring**: Edit content via Google Sheets web interface
- **IIIF integration**: Support for both local images (auto-generated tiles) and external IIIF resources
- **Scrollytelling**: Fixed IIIF viewer with scrolling narrative that controls viewport
- **Layered panels**: Progressive disclosure with three content layers plus glossary
- **Objects gallery**: Browsable object grid with detail pages
- **Minimal computing**: Plain text, static generation, GitHub Pages hosting

## Quick Start

### For Content Creators (Web-Only Workflow)

1. **Fork this repository** on GitHub
2. **Enable GitHub Pages** in repository settings
3. **Create your Google Sheet** (template link below)
4. **Publish to web** and get CSV URLs
5. **Add secret** GOOGLE_SHEETS_URL to repository
6. **Commit to main branch** - site builds automatically

No local installation required!

### For Developers (Local Development)

```bash
# Clone the repository
git clone https://github.com/UCSB-AMPLab/telar.git
cd telar

# Install dependencies
bundle install

# Serve locally
bundle exec jekyll serve

# View at http://localhost:4000
```

## Installation

### Prerequisites

- Ruby 3.0+ (for Jekyll)
- Bundler
- Python 3.9+ (for IIIF generation, GitHub Actions only)

### Local Setup

1. Install Ruby and Bundler:
   ```bash
   # macOS (using Homebrew)
   brew install ruby
   gem install bundler

   # Ubuntu/Debian
   sudo apt-get install ruby-full build-essential
   gem install bundler
   ```

2. Install Jekyll dependencies:
   ```bash
   bundle install
   ```

3. Optional - Install Python dependencies (for IIIF generation):
   ```bash
   pip install -r requirements.txt
   ```

## Content Structure

Telar uses a **components-based architecture** that separates content from structure:

### Components Folder

The `components/` folder is the **source of truth** for all content:

```
components/
├── images/
│   ├── objects/          # Source images for IIIF processing
│   └── additional/       # Layer images, supplementary media
└── texts/
    ├── stories/          # Story layer content (markdown)
    │   └── story1/
    │       ├── step1-layer1.md
    │       ├── step1-layer2.md
    │       └── ...
    └── glossary/         # Glossary definitions (markdown)
        ├── colonial-period.md
        └── ...
```

**Key principle:** Long-form content lives in markdown files, not in spreadsheets.

### Google Sheets Data Source

Google Sheets provides **structural data** that references component files:

1. **Instructions** (Tab 1): Read-only guidance
2. **Project Setup** (Tab 2): Site settings + stories list
3. **Objects** (Tab 3): Object metadata
4. **Story [N]** (Tab 4+): Story structure with file references

**Example story CSV:**
```csv
step,question,answer,object,x,y,zoom,layer1_file,layer2_file
1,"Question","Answer","obj-001",0.5,0.5,1.0,"story1/step1-layer1.md","story1/step1-layer2.md"
```

**Note:** No CSV/spreadsheet needed for glossary terms. Create markdown files directly in `components/texts/glossary/` with minimal frontmatter:

```markdown
---
term_id: colonial-period
title: "Colonial Period"
related_terms: encomienda,viceroyalty
---

The Colonial Period in the Americas began with...
```

[Link to Google Sheets template - TBD]

### Jekyll Collections

Auto-generated in `_jekyll-files/` directory:

- `_jekyll-files/_stories/`: Scrollytelling narratives (from project.csv + story CSVs)
- `_jekyll-files/_objects/`: Object metadata (from objects.json)
- `_jekyll-files/_glossary/`: Glossary terms (from components/texts/glossary/)

**Note:** Files in `_jekyll-files/` are auto-generated. Edit source files in `components/` or `_data/` instead.

## IIIF Integration

### Option 1: Local Images (Recommended)

1. Add high-resolution images to `components/images/objects/` directory
2. Name files to match object IDs (e.g., `example-bogota-1614.jpg`)
3. Run `python scripts/generate_iiif.py` to generate IIIF tiles
4. Tiles are saved to `iiif/objects/[object-id]/`

**File Size Limits:**
- Individual images: Up to 100 MB
- Total repository: Keep under 1 GB
- For larger collections, use external IIIF or Git LFS

### Option 2: External IIIF

Reference external IIIF resources in object metadata:

```yaml
iiif_manifest: https://example.org/iiif/image/abc123/info.json
```

## Configuration

### Site Settings (_config.yml)

```yaml
title: Your Exhibition Title
baseurl: /repository-name  # For GitHub Pages
url: https://username.github.io

telar:
  project_title: "Exhibition Title"
  primary_color: "#2c3e50"
  font_headings: "Playfair Display, serif"
```

### Google Sheets Integration

1. Publish your Google Sheet to web (File → Share → Publish to web)
2. Get the shareable link
3. Add as repository secret: `GOOGLE_SHEETS_URL`
4. Update GID values in `.github/workflows/build.yml` for each tab

## GitHub Actions Workflow

The automated build process:

1. **Fetch**: Download CSVs from published Google Sheets
2. **Convert**: Transform CSV to JSON for Jekyll
3. **Generate**: Create IIIF tiles from source images
4. **Build**: Compile Jekyll site
5. **Deploy**: Publish to GitHub Pages

Triggers:
- Push to main branch
- Manual workflow dispatch
- Daily schedule (optional, for auto-updates)

## Customization

### Styling

Edit `assets/css/telar.css` to customize:
- Colors (CSS variables in `:root`)
- Typography
- Layout spacing
- Responsive breakpoints

### Layouts

Modify layouts in `_layouts/`:
- `default.html`: Base template
- `story.html`: Scrollytelling page
- `object.html`: Object detail page
- `glossary.html`: Term definition page

### JavaScript

Core functionality in `assets/js/`:
- `telar.js`: Base utilities
- `story.js`: UniversalViewer + Scrollama integration

## Development

### Local Testing

```bash
# Serve with live reload
bundle exec jekyll serve --livereload

# Build only (output to _site/)
bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean
```

### Adding a Story

1. Create markdown file in `_stories/`
2. Add front matter with story metadata
3. Include story steps with data attributes
4. Reference object IDs and coordinates

See `_stories/README.md` for complete documentation.

### Adding Objects

1. Create markdown file in `_objects/`
2. Add front matter with object metadata
3. Add source image to `source_images/` (if using local IIIF)
4. OR specify external `iiif_manifest` URL

### Adding Glossary Terms

1. Create markdown file in `components/texts/glossary/`
2. Add minimal frontmatter with `term_id`, `title`, and optional `related_terms`
3. Write full definition in markdown content
4. Run `python scripts/generate_collections.py` to create Jekyll collection file
5. Reference `term_id` in stories

**Example:**
```markdown
---
term_id: encomienda
title: "Encomienda"
related_terms: colonial-period,tribute
---

The encomienda was a labor system instituted by the Spanish crown...
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Static HTML generation
- CDN delivery via GitHub Pages
- Progressive IIIF tile loading
- Lazy loading for object images
- Mobile-optimized responsive design

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support
- Alt text for all images
- Sufficient color contrast

## License

[Specify your license - e.g., MIT, GPL, CC BY]

## Credits

Telar is developed by Adelaida Ávila, Juan Cobo Betancourt, Santiago Muñoz, and students and scholars at the [UCSB Archives, Memory, and Preservation Lab](https://ampl.clair.ucsb.edu), the UT Archives, Mapping, and Preservation Lab, and [Neogranadina](https://neogranadina.org).

Telar is built with:
- [Jekyll](https://jekyllrb.com/) - Static site generator
- [UniversalViewer](https://universalviewer.io/) - IIIF viewer
- [Scrollama](https://github.com/russellgoldenberg/scrollama) - Scrollytelling library
- [Bootstrap 5](https://getbootstrap.com/) - CSS framework
- [iiif-static](https://github.com/bodleian/iiif-static-choices) - IIIF tile generator

It is based on [Paisajes Coloniales](https://paisajescoloniales.com/), and inspired by:
- [Wax](https://minicomp.github.io/wax/) - Minimal computing for digital exhibitions
- [CollectionBuilder](https://collectionbuilder.github.io/) - Static digital collections

## Support

For issues, questions, or contributions:
- GitHub Issues: https://github.com/UCSB-AMPLab/telar/issues
- Documentation: https://github.com/UCSB-AMPLab/telar

## Roadmap

- [ ] Visual story editor
- [ ] Annotation support
- [ ] Multi-language support
- [ ] 3D object support
- [ ] Timeline visualizations
- [ ] Mobile-friendly responsive design