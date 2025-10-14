# Telar

![Version](https://img.shields.io/badge/version-0.1.0--beta-orange) ![License](https://img.shields.io/badge/license-MIT-blue)

A minimal computing framework for creating digital storytelling exhibitions with IIIF images and scrollytelling narratives.

> **⚠️ Beta Release - v0.1.0**
> This is a beta release for testing. The current workflow uses CSV files and markdown for content editing. Google Sheets integration is planned for v0.2.

## Overview

Telar (Spanish for "loom") is a static site generator built on Jekyll that weaves together IIIF images, narrative text, and layered contextual information into interactive digital exhibitions. It follows minimal computing principles: plain text authoring, static generation, and sustainable hosting.

Telar is developed by Adelaida Ávila, Juan Cobo Betancourt, Santiago Muñoz, and students and scholars at the [UCSB Archives, Memory, and Preservation Lab](https://ampl.clair.ucsb.edu), the UT Archives, Mapping, and Preservation Lab, and [Neogranadina](https://neogranadina.org).

## Key Features

- **IIIF integration**: Support for both local images (auto-generated tiles) and external IIIF resources
- **Scrollytelling**: Fixed IIIF viewer with scrolling narrative that controls viewport
- **Layered panels**: Progressive disclosure with three content layers plus glossary
- **Objects gallery**: Browsable object grid with detail pages
- **Minimal computing**: Plain text, static generation, GitHub Pages hosting

## Quick Start

### GitHub Pages Deployment (Automated Workflow)

**Best for:** Content creators who want to publish online with minimal setup

1. **Use this template** - Click "Use this template" button above to create your repository
2. **Enable GitHub Pages** in repository settings (Settings → Pages → Source: GitHub Actions)
3. **Edit your content** directly on GitHub:
   - Edit CSV files in `components/structures/` (project setup, objects, stories)
   - Edit markdown files in `components/texts/` (story layers, glossary)
   - Upload images to `components/images/objects/`
4. **Commit changes** to main branch
5. **GitHub Actions automatically**:
   - Converts CSVs to JSON
   - Generates IIIF tiles from images
   - Builds Jekyll site
   - Deploys to GitHub Pages

No local installation required for basic editing!

### Local Development

**Best for:** Developers who want to preview changes locally before publishing

```bash
# Clone the repository
git clone https://github.com/UCSB-AMPLab/telar.git
cd telar

# Install Ruby dependencies
bundle install

# Install Python dependencies (for IIIF generation)
pip install -r requirements.txt

# Edit content in components/ folder
# Then run the build pipeline:

# 1. Convert CSVs to JSON
python3 scripts/csv_to_json.py

# 2. Generate IIIF tiles (if images changed)
python3 scripts/generate_iiif.py --source-dir components/images/objects --base-url http://localhost:4000

# 3. Serve locally with live reload
bundle exec jekyll serve --livereload

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

Telar uses a **components-based architecture** that separates content from generated files:

### Components Folder (Source of Truth)

The `components/` folder contains all **editable source content**:

```
components/
├── structures/           # CSV files with organizational data
│   ├── project.csv       # Site settings and story list
│   ├── objects.csv       # Object catalog metadata
│   └── story-1.csv       # Story structure with step coordinates
├── images/
│   ├── objects/          # Source images for IIIF processing
│   └── additional/       # Other images used around the site
└── texts/
    ├── stories/          # Story layer content (markdown)
    │   └── story1/
    │       ├── step1-layer1.md
    │       ├── step1-layer2.md
    │       └── ...
    └── glossary/         # Glossary definitions (markdown)
        ├── term1.md
        └── ...
```

**Key principles:**
- CSV files contain structural data (coordinates, file references)
- Markdown files contain long-form narrative content
- Images are processed into IIIF tiles automatically

### CSV Data Files

CSV files in `components/structures/` define your site's structure and reference content files.

#### Story CSV Structure

Each story CSV (e.g., `story-1.csv`) contains step-by-step navigation data:

```csv
step,question,answer,object,x,y,zoom,layer1_button,layer1_file,layer2_button,layer2_file
1,"Question text","Brief answer","obj-001",0.5,0.5,1.0,"","story1/step1-layer1.md","","story1/step1-layer2.md"
```

**Columns:**
- `step`: Step number
- `question`: Heading displayed in story
- `answer`: Brief answer text
- `object`: Object ID from objects.csv
- `x, y, zoom`: IIIF viewer coordinates (0-1 normalized)
- `layer1_button`: Custom button text (empty = "Learn more")
- `layer1_file`: Path to markdown file in `components/texts/stories/`
- `layer2_button`: Custom button text (empty = "Go deeper")
- `layer2_file`: Path to markdown file in `components/texts/stories/`

**Button behavior:** If button columns are empty, default text appears. If you provide text, it will be used instead.

#### Glossary Terms

No CSV needed! Create markdown files directly in `components/texts/glossary/`:

```markdown
---
term_id: colonial-period
title: "Colonial Period"
related_terms: encomienda,viceroyalty
---

The Colonial Period in the Americas began with...
```

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

## GitHub Actions Workflow

When you deploy via GitHub Pages, the build process is **fully automated**. Here's what happens:

### What YOU Do (User Actions)

Edit content directly on GitHub or push from local:

1. **Edit CSVs** in `components/structures/` (story structure, object metadata)
2. **Edit markdown** in `components/texts/` (narrative content)
3. **Add images** to `components/images/objects/` (IIIF source images)
4. **Commit and push** to main branch

### What GitHub Actions Does (Automated)

The workflow (`.github/workflows/build.yml`) automatically:

1. **Convert CSVs to JSON**: Runs `scripts/csv_to_json.py`
   - Reads CSVs from `components/structures/`
   - Embeds markdown content from `components/texts/`
   - Generates JSON files in `_data/` for Jekyll
2. **Generate IIIF tiles**: Runs `scripts/generate_iiif.py`
   - Processes images from `components/images/objects/`
   - Creates tiled image pyramids in `iiif/objects/`
3. **Build Jekyll site**: Runs `bundle exec jekyll build`
   - Compiles site from templates and data
   - Outputs to `_site/` directory
4. **Deploy to GitHub Pages**: Publishes `_site/` directory

**Triggers:**
- Push to main branch
- Manual workflow dispatch (Actions tab)

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

### Local Development Workflow

When developing locally, you need to manually run the build pipeline:

```bash
# 1. Edit content
# - CSVs in components/structures/
# - Markdown in components/texts/
# - Images in components/images/objects/

# 2. Convert CSVs to JSON (run after editing CSVs)
python3 scripts/csv_to_json.py

# 3. Generate IIIF tiles (run after adding/updating images)
python3 scripts/generate_iiif.py --source-dir components/images/objects --base-url http://localhost:4000

# 4. Serve with live reload
bundle exec jekyll serve --livereload

# Build only (output to _site/)
bundle exec jekyll build

# Clean build artifacts
bundle exec jekyll clean
```

### Adding a Story

1. **Create CSV file** in `components/structures/` (e.g., `story-2.csv`)
2. **Add columns**: `step,question,answer,object,x,y,zoom,layer1_button,layer1_file,layer2_button,layer2_file`
3. **Create markdown files** in `components/texts/stories/story2/` for layer content
4. **Run conversion**: `python3 scripts/csv_to_json.py`
5. **Add to project.csv**: List story in project setup
6. **Build and test**: `bundle exec jekyll serve`

### Adding Objects

1. **Add to CSV**: Create entry in `components/structures/objects.csv` with `object_id`
2. **Add image**: Place high-res image in `components/images/objects/` (named `{object_id}.jpg`)
3. **Generate IIIF**: `python3 scripts/generate_iiif.py --source-dir components/images/objects --base-url http://localhost:4000`
4. **OR use external IIIF**: Specify `iiif_manifest` URL in objects.csv

### Finding Coordinates for Stories

Each object detail page includes a built-in **coordinate identification tool** that helps you find precise x, y, zoom values for story steps:

1. **Navigate to object page**: Visit `/objects/{object_id}` while running Jekyll locally
2. **Click "Identify coordinates"**: Button appears below the IIIF viewer
3. **Pan and zoom**: Click and drag the image, scroll to zoom
4. **Watch coordinates update**: X, Y, and Zoom values update in real-time
5. **Copy values**: Use copy buttons to grab coordinates or entire CSV row

**Coordinate system:**
- `x, y`: Normalized 0-1 coordinates where (0,0) is top-left corner
- `zoom`: Relative zoom where 1 = full image, >1 zooms in

**Workflow tip:** Keep the object page open in one browser tab while editing your story CSV in another. As you identify important details in the image, copy the coordinates directly into your story steps.

### Adding Glossary Terms

1. **Create markdown file** in `components/texts/glossary/` (e.g., `encomienda.md`)
2. **Add frontmatter**:
   ```markdown
   ---
   term_id: encomienda
   title: "Encomienda"
   related_terms: colonial-period,tribute
   ---

   The encomienda was a tribute system instituted by the Spanish crown...
   ```
3. **Generate collection**: `python3 scripts/generate_collections.py`

**Access glossary terms:** In v0.1.0-beta, glossary terms are standalone pages at `/glossary/{term_id}/`. Automatic linking within narrative text is planned for v0.2.

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

MIT License - see [LICENSE](LICENSE) file for details.

**Note:** This license covers the Telar framework code and documentation. It does NOT cover user-created content (stories, images, object metadata, narrative text) which remains the property of content creators and may have separate licenses.

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

### Planned for v0.2
- [ ] **Google Sheets integration**: Edit content via web interface without CSV files
- [ ] **Visual story editor**: Point-and-click coordinate selection
- [ ] **Improved documentation**: Video tutorials and examples

### Future Features
- [ ] **Annotation support**: Clickable markers on IIIF images that open panels with additional information (IIIF annotations)
- [ ] **Glossary auto-linking**: Automatic detection and linking of terms within narrative text
- [ ] **Multi-language support**: Internationalization and localization
- [ ] **3D object support**: Integration with 3D viewers
- [ ] **Timeline visualizations**: Temporal navigation for chronological narratives
- [ ] **Advanced theming options**: Customizable design templates