# Telar - Implementation Plan and Roadmap

## Project Overview

**Telar** (Spanish: "loom") is a minimal computing framework for creating object-based digital storytelling projects with scrollytelling narratives, IIIF image support, and layered content panels.

### Project Goals

- Enable non-technical users to create sophisticated digital narratives
- Follow minimal computing principles: plain text, static generation, sustainability
- Focus on storytelling rather than collection management
- Support both local images and external IIIF resources
- Zero local setup required for end users

### Inspiration

- **Paisajes Coloniales** - Layered panel narrative structure
- **Wax** - Minimal computing approach for digital exhibitions
- **CollectionBuilder** - GitHub-only workflow
- **KnightLab Tools** - Google Sheets as authoring interface

### Credits

Telar is developed by Adelaida Ávila, Juan Cobo Betancourt, Santiago Muñoz, and students and scholars at the [UCSB Archives, Memory, and Preservation Lab](https://ampl.clair.ucsb.edu), the UT Archives, Mapping, and Preservation Lab, and [Neogranadina](https://neogranadina.org).

---

## Version History

### v0.1.0-beta (October 14, 2025)

**Status:** Released

**Current Features:**
- IIIF integration (local images with auto-generated tiles)
- External IIIF support (remote IIIF Image API)
- Scrollytelling with coordinate-based navigation using UniversalViewer
- Layered panels (two content layers for progressive disclosure)
- Glossary pages (standalone term definition pages at `/glossary/{term_id}/`)
- Object gallery (browsable grid with detail pages)
- Coordinate identification tool (interactive tool to find x,y,zoom values on object pages)
- Components architecture (CSV files + markdown content separation)
- CSV to JSON workflow (Python scripts for data processing)
- IIIF tile generation (automated image pyramid creation with iiif-static)
- GitHub Actions ready (automated builds and deployment pipeline)

**Known Limitations:**
- Content must be edited as CSV files and markdown (no web interface yet)
- Local development requires Python 3.9+ and Ruby 3.0+ setup
- Coordinate identification tool requires running Jekyll locally or on published site
- Story coordinates must be manually entered in CSV files
- Glossary terms are standalone pages only (no auto-linking in narrative text)

---

## Technical Stack

### Core Technologies

- **Static Site Generator**: Jekyll 4.3+
- **IIIF Tile Generation**: Bodleian iiif-static (Python)
- **Image Viewer**: UniversalViewer 4.0 (with OpenSeadragon)
- **Scrollytelling**: Custom discrete step-based card stacking system (enables multiple IIIF objects per story)
- **CSS Framework**: Bootstrap 5
- **Data Source**: CSV files (v0.2.0-beta), Google Sheets planned for future release
- **Automation**: GitHub Actions
- **Hosting**: GitHub Pages

### Dependencies

**Ruby Gems:**
- jekyll (~> 4.3.4)
- minima (~> 2.5)
- jekyll-feed (~> 0.12)
- jekyll-seo-tag

**Python:**
- iiif-static (for tile generation)

**JavaScript Libraries (CDN):**
- Bootstrap 5.3
- UniversalViewer 4.0
- Custom step-based scrolling (no external library)

### Why UniversalViewer?

UniversalViewer was chosen after careful evaluation, inspired by Exhibit.so's successful implementation:

1. **Universal IIIF Support**: Native support for both IIIF Presentation manifests AND Image API info.json:
   - Handles external IIIF manifests from any institution
   - Works with locally-generated IIIF tiles
   - No hardcoded URL transformations needed

2. **Scrollytelling Compatibility**: Built on OpenSeadragon, providing programmatic control:
   ```javascript
   // Access underlying OpenSeadragon viewer
   uvInstance.on('openseadragonExtension.opened', function() {
     osdViewer = uvInstance.extension.centerPanel.viewer;
     osdViewer.viewport.panTo(point, true);
     osdViewer.viewport.zoomTo(zoom, true);
   });
   ```

3. **Proven for Storytelling**: Exhibit.so demonstrates UV successfully supports scrollytelling narratives

4. **Future-Ready**: Built-in support for multi-media (video, 3D) if Telar expands scope in future versions

5. **Single Viewer Architecture**: Same viewer for both object pages (user exploration) and story pages (programmatic control)

6. **GLAM Standard**: Wide adoption by major cultural heritage institutions ensures longevity and support

**Trade-off**: Slightly larger footprint than OpenSeadragon alone (~500KB vs 60KB), but eliminates custom manifest parsing and provides universal compatibility

---

## Architecture

### Content Layers

**Telar supports four content types:**

1. **Objects** - Browsable gallery of all items with metadata
2. **Stories** - Scrollytelling narratives referencing objects
3. **Story Steps** - Scrollable sections with question/answer format
4. **Glossary** - Standalone term definition pages

### Information Depth

**Progressive disclosure through layered panels:**

1. **Main narrative** (left column) - Question + brief answer
2. **Layer 1** (offcanvas panel) - Detailed context
3. **Layer 2** (stacked overlay) - Deep scholarly content
4. **Glossary** (standalone pages) - Term definitions (auto-linking planned for v0.2)

### Jekyll Collections

```yaml
collections:
  stories:
    output: true
    permalink: /stories/:name/
  objects:
    output: true
    permalink: /objects/:name/
  glossary:
    output: true
    permalink: /glossary/:name/
```

---

## Current Data Structure (v0.1.0-beta)

### Components Architecture

Content is organized in the `components/` folder:

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

### CSV File Formats

**project.csv** - Site settings and story list
```csv
key,value
project_title,Your Exhibition Title
tagline,A brief description
author,Your Name
email,contact@example.com
primary_color,#2c3e50
secondary_color,#8b4513
font_headings,Playfair Display, serif
font_body,Source Sans Pro, sans-serif
logo,/assets/images/site/logo.png

STORIES,
1,Story Title One
2,Story Title Two
```

**objects.csv** - Object metadata
```csv
object_id,title,description,creator,date,medium,dimensions,location,credit,thumbnail,iiif_manifest
textile-001,Colonial Textile Fragment,A woven textile from...,Unknown Artist,circa 1650-1700,Wool,45 x 60 cm,,,
museum-001,External Object,Description,Artist,1720,Ceramic,,,https://example.org/iiif/image/abc/info.json,
```

**story-1.csv** - Story step structure
```csv
step,question,answer,object,x,y,zoom,layer1_button,layer1_file,layer2_button,layer2_file
1,What is this textile?,This fragment shows...,textile-001,0.5,0.5,1.0,,story1/step1-layer1.md,,story1/step1-layer2.md
2,Notice the pattern,The geometric motifs...,textile-001,0.3,0.4,2.5,,story1/step2-layer1.md,,
```

**Markdown files** - Layer and glossary content

Layer file example (`components/texts/stories/story1/step1-layer1.md`):
```markdown
---
title: "Weaving Techniques"
---

The interlocking warp pattern visible here indicates...
```

Glossary file example (`components/texts/glossary/colonial-period.md`):
```markdown
---
term_id: colonial-period
title: "Colonial Period"
related_terms: encomienda,viceroyalty
---

The Colonial Period in the Americas began with...
```

---

## File Structure

```
telar/
├── .github/
│   └── workflows/
│       └── build.yml                  # GitHub Actions workflow
├── _config.yml                        # Jekyll configuration
├── _data/                             # Auto-generated JSON from CSVs
│   ├── project.json
│   ├── objects.json
│   ├── story-1.json
│   └── ...
├── _includes/
│   ├── head.html
│   ├── header.html
│   ├── footer.html
│   └── story/
│       ├── step.html                  # Story step template
│       ├── adapter.html               # Data processing adapter
│       ├── panel-primary.html         # Layer 1 offcanvas panel
│       └── panel-secondary.html       # Layer 2 stacked panel
├── _layouts/
│   ├── default.html                   # Base layout
│   ├── page.html                      # Simple page layout
│   ├── story.html                     # Story scrollytelling page
│   ├── objects-index.html             # Object gallery
│   ├── object.html                    # Object detail page
│   ├── glossary-index.html            # Glossary list
│   └── glossary.html                  # Glossary term page
├── _jekyll-files/                     # Auto-generated collection files
│   ├── _stories/
│   │   └── [generated .md files]
│   ├── _objects/
│   │   └── [generated .md files]
│   └── _glossary/
│       └── [generated .md files]
├── assets/
│   ├── css/
│   │   └── telar.css                  # Custom styles
│   ├── js/
│   │   ├── story.js                   # Scrollytelling runtime with UV
│   │   └── telar.js                   # Core utilities
│   └── images/                        # Site assets
├── components/                        # Source content (editable)
│   ├── structures/                    # CSV data files
│   ├── images/                        # Source images
│   └── texts/                         # Markdown content
├── iiif/
│   └── objects/                       # Auto-generated IIIF tiles
│       ├── object-id/
│       │   ├── info.json
│       │   ├── manifest.json
│       │   └── [tile directories]
│       └── ...
├── pages/
│   ├── index.md                       # Homepage
│   ├── about.md                       # About page
│   ├── objects.md                     # Objects gallery page
│   └── glossary.md                    # Glossary index page
├── scripts/
│   ├── csv_to_json.py                 # Transform CSVs to JSON
│   ├── generate_collections.py        # Create Jekyll collection files
│   └── generate_iiif.py               # Generate IIIF tiles
├── .gitignore
├── Gemfile
├── Gemfile.lock
├── LICENSE
├── README.md                          # User documentation
├── CHANGELOG.md                       # Version history
└── PLAN.md                            # This file
```

---

## User Workflows

### Track 1: GitHub Web Interface Only (For Storytellers)

**No installation required!** Edit everything directly on GitHub.

1. **Use template** - Click "Use this template" button on GitHub
2. **Enable GitHub Pages** - Settings → Pages → Source: GitHub Actions
3. **Gather images** - Upload to `components/images/objects/` OR use external IIIF manifests
4. **Write narrative text** - Create markdown files in `components/texts/stories/`
5. **Catalog objects** - Edit `components/structures/objects.csv` on GitHub
6. **Preview objects** - Wait for build, view on GitHub Pages
7. **Find coordinates** - Use coordinate tool on object pages
8. **Build story** - Create `story-1.csv` with coordinates
9. **Add glossary** (optional) - Create markdown files in `components/texts/glossary/`
10. **Commit changes** - GitHub Actions rebuilds automatically

**Total time:** 2-4 hours for a complete exhibition

### Track 2: Local Development (For Developers)

**Best for:** Testing changes locally before publishing

1. Clone repository
2. Install Ruby 3.0+ and Bundler
3. Install Python 3.9+ and dependencies
4. `bundle install`
5. Edit content in `components/` folder
6. Run conversion: `python3 scripts/csv_to_json.py`
7. Generate IIIF: `python3 scripts/generate_iiif.py`
8. Serve locally: `bundle exec jekyll serve`
9. View at `http://localhost:4000`
10. Commit and push to deploy

---

## GitHub Actions Workflow

### Trigger
- Push to `main` branch
- Manual workflow dispatch

### Steps

1. **Checkout repository**
2. **Setup Python environment**
   - Install iiif-static
3. **Convert CSVs to JSON**
   - Run `scripts/csv_to_json.py`
   - Generates `_data/*.json` files
4. **Generate Jekyll collection files**
   - Run `scripts/generate_collections.py`
   - Creates `_jekyll-files/_stories/`, `_objects/`, `_glossary/`
5. **Generate IIIF tiles**
   - Run `scripts/generate_iiif.py`
   - Creates tiles in `iiif/objects/`
   - Skips objects with external IIIF URLs
6. **Setup Ruby environment**
   - Install Jekyll and dependencies
7. **Build Jekyll site**
   - `bundle exec jekyll build`
   - Output to `_site/`
8. **Deploy to GitHub Pages**
   - Publish `_site/` directory

---

## Page Types

### 1. Homepage (`pages/index.md`)

**Layout:** `default.html`

**Content:**
- Project title, tagline, logo
- Story list (links to story pages)
- Links to Objects gallery and Glossary index
- Optional about page

**Data sources:**
- `site.data.project`
- `site.stories` collection

### 2. Story Page (`_layouts/story.html`)

**Layout:** Fixed viewer (right) + scrolling narrative (left)

**Components:**
- **Fixed right column:**
  - UniversalViewer with IIIF manifest
  - Updates on scroll (zoom/pan via OpenSeadragon)
  - Handles local and external IIIF sources

- **Scrolling left column:**
  - Story steps with question/answer
  - Buttons to open layer panels
  - Custom discrete step system with scroll event handling

**Interactions:**
- Custom scroll handler detects step transitions
- JavaScript updates viewer coordinates (pan/zoom)
- Opens/closes layer panels

### 3. Objects Gallery (`pages/objects.md`)

**Layout:** `objects-index.html`

**Content:**
- Grid of object thumbnails
- Basic metadata (title, creator, date)
- Click to object detail page

**Data source:**
- `site.objects` collection

### 4. Object Detail Page (`_layouts/object.html`)

**Content:**
- UniversalViewer displaying IIIF manifest
- Complete metadata display
- Coordinate identification tool (collapsible panel)
- "Appears in Stories" section (links to stories using this object)

### 5. Glossary Index (`pages/glossary.md`)

**Layout:** `glossary-index.html`

**Content:**
- Alphabetical list of all terms
- Short definitions
- Links to full glossary pages

### 6. Glossary Term Page (`_layouts/glossary.html`)

**Content:**
- Term title
- Full definition (markdown)
- Optional image
- Related terms (links to other glossary pages)

---

## Styling

### Default Aesthetic (Inspired by Paisajes Coloniales)

**Typography:**
- Headings: Playfair Display (serif)
- Body: Source Sans Pro (sans-serif)
- Clean, academic feel

**Colors:**
- Primary: #2c3e50 (dark blue-gray)
- Secondary: #8b4513 (saddle brown)
- Layer 1 panel: #A8C5D4 (light blue)
- Layer 2 panel: #3d2645 (dark purple)
- Glossary panel: #F5EDE1 (cream)

**Layout:**
- Generous whitespace
- Clear hierarchy
- Bootstrap 5 responsive grid

### Customization

Users can override defaults in `components/structures/project.csv`:
- `primary_color`, `secondary_color` (hex codes)
- `font_headings`, `font_body` (Google Fonts)
- `logo` (path to logo image)

CSS variables make customization straightforward.

---

## IIIF Implementation

### Local Images

**Workflow:**
1. User uploads image to `components/images/objects/filename.jpg`
2. References in objects.csv: `object_id` = filename without extension
3. GitHub Actions detects new file
4. Python script generates:
   - Tiles in `iiif/objects/object-id/tiles/`
   - `info.json` (IIIF Image API)
   - `manifest.json` (IIIF Presentation API)
5. UniversalViewer references manifest URL

**File size limits:**
- Individual images: Up to 100MB
- Total repository: Keep under 1GB
- For larger collections, use external IIIF or Git LFS

### External IIIF Resources

**Workflow:**
1. User has existing IIIF info.json URL
2. References in objects.csv: `iiif_manifest` column = URL
3. GitHub Actions skips tile generation
4. UniversalViewer references external URL directly

**Finding IIIF resources:**
- See [IIIF Guide to Finding Resources](https://iiif.io/guides/finding_resources/)
- Many museums, libraries, and archives publish IIIF-compatible collections

### Mixed Projects

- Some objects local (generate tiles)
- Some objects external (reference only)
- UniversalViewer handles both seamlessly

---

## Implementation Status

### ✓ Completed (v0.1.0-beta)

**Foundation:**
- [x] Folder structure
- [x] Jekyll configuration
- [x] CSV data structure
- [x] Documentation (README, CHANGELOG, DOCS)

**Core Features:**
- [x] Homepage layout
- [x] Story page layout with scrollytelling
- [x] UniversalViewer integration
- [x] Custom step-based scrolling with OpenSeadragon API
- [x] Layer panel system (2 layers)
- [x] Object gallery page
- [x] Object detail pages
- [x] Glossary index page
- [x] Glossary term pages (standalone)

**Automation:**
- [x] CSV to JSON conversion script
- [x] Collection generation script
- [x] IIIF tile generation script
- [x] GitHub Actions workflow
- [x] Automated deployment

**Polish:**
- [x] Paisajes-inspired aesthetic
- [x] Bootstrap 5 responsive design
- [x] Coordinate identification tool
- [x] Template repository setup

### Future Features

**Google Sheets Integration (v0.3):**
- [ ] Google Sheet template with 5+ tabs
- [ ] GitHub Actions fetch from published sheets
- [ ] Instructions tab with usage guide
- [ ] Automatic CSV export and processing

**Enhanced Features:**
- [ ] Glossary auto-linking (detect `[[term-id]]` in text)
- [ ] Visual story editor (point-and-click coordinate selection)
- [ ] Improved documentation (video tutorials, examples)

**Additional Planned Features:**

**User Experience:**
- [ ] Mobile-optimized responsive design
- [ ] Image lazy loading for galleries
- [ ] Advanced search and filtering for objects

**Accessibility:**
- [ ] Comprehensive ARIA labels
- [ ] Keyboard navigation improvements
- [ ] Color contrast verification
- [ ] Screen reader testing

**Advanced Features:**
- [ ] Theme system (implement dynamic theming using project.csv configuration: colors, fonts, logos)
- [ ] Annotation support (IIIF annotations)
- [ ] Multi-language support (i18n)
- [ ] 3D object support
- [ ] Timeline visualizations
- [ ] Video embedding

**Community:**
- [ ] Template gallery
- [ ] Example projects directory
- [ ] Plugin system
- [ ] Community contributions

---

## Success Criteria

**For Storytellers:**
- Can create a complete exhibition without touching code
- Total time from template to published: 2-4 hours
- Clear documentation and guidance
- Works on GitHub Pages free tier

**For Developers:**
- Clean, documented codebase
- Easy to extend and customize
- Can run locally for development
- Clear contribution guidelines

**For Sustainability:**
- Static site = low hosting costs
- No server dependencies
- Works on GitHub Pages free tier
- Portable to other static hosts

**For Accessibility:**
- Semantic HTML structure
- Alt text for images
- Keyboard accessible (future enhancement)
- High contrast design

---

## Roadmap

### v0.3 (Next Release)

**Focus:** Web-based authoring with Google Sheets

**Timeline:** TBD

**Goals:**
1. Google Sheets integration for easier content editing
2. Glossary auto-linking in narrative text
3. Visual coordinate selection tool
4. Video tutorials and improved onboarding

### v0.4 and Beyond

**Focus:** Enhanced accessibility and advanced features

**Potential Features:**
- Full mobile optimization
- Accessibility audit and improvements
- IIIF annotations support
- Multi-language support
- Timeline view option
- 3D model support

**Community-Driven:**
- Feature requests via GitHub Issues
- Community contributions welcome
- Template and example gallery

---

## Notes

- Follow minimal computing principles throughout
- Prioritize simplicity over features
- Document everything for non-technical users
- Test with real humanities scholars
- Keep dependencies minimal
- Plan for long-term sustainability
- Version control all content
- Maintain backward compatibility when possible

---

## Resources

- **Documentation**: [README.md](../README.md)
- **Changelog**: [CHANGELOG.md](../CHANGELOG.md)
- **Technical Docs**: [DOCS.md](DOCS.md)
- **Example Site**: https://ampl.clair.ucsb.edu/telar
- **GitHub Repository**: https://github.com/UCSB-AMPLab/telar
- **Issues/Feedback**: https://github.com/UCSB-AMPLab/telar/issues
