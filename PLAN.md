# Telar - Comprehensive Implementation Plan

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

## Technical Stack

### Core Technologies

- **Static Site Generator**: Jekyll 4.3+
- **IIIF Tile Generation**: Bodleian iiif-static-choices (Python)
- **Image Viewer**: UniversalViewer (with OpenSeadragon for scrollytelling)
- **Scrollytelling**: Scrollama
- **CSS Framework**: Bootstrap 5
- **Data Source**: Google Sheets (published as CSV)
- **Automation**: GitHub Actions
- **Hosting**: GitHub Pages

### Dependencies

**Ruby Gems:**
- jekyll (~> 4.3.4)
- minima (~> 2.5)
- jekyll-feed (~> 0.12)

**Python:**
- iiif-static-choices (for tile generation)
- Poetry (dependency management)

**JavaScript Libraries (CDN):**
- Bootstrap 5.3
- UniversalViewer 4.0
- Scrollama (latest)

### Why UniversalViewer?

UniversalViewer was chosen after careful evaluation, inspired by Exhibit.so's successful implementation:

1. **Universal IIIF Support**: Native support for both IIIF Presentation manifests AND Image API info.json:
   - Handles external IIIF manifests from any institution (Huntington, Harvard Art Museums, etc.)
   - Works with locally-generated IIIF tiles
   - No hardcoded URL transformations needed

2. **Scrollytelling Compatibility**: UniversalViewer is built on OpenSeadragon, providing programmatic control:
   ```javascript
   // Access underlying OpenSeadragon viewer
   uvInstance.on('openseadragonExtension.opened', function() {
     osdViewer = uvInstance.extension.centerPanel.viewer;
     osdViewer.viewport.panTo(point, true);
     osdViewer.viewport.zoomTo(zoom, true);
   });
   ```

3. **Proven for Storytelling**: Exhibit.so demonstrates UV successfully supports scrollytelling narratives.

4. **Future-Ready**: Built-in support for multi-media (video, 3D) if Telar expands scope in future versions.

5. **Single Viewer Architecture**: Same viewer for both object pages (user exploration) and chapter pages (programmatic control).

6. **GLAM Standard**: Wide adoption by major cultural heritage institutions ensures longevity and support.

**Trade-off**: Slightly larger footprint than OpenSeadragon alone (~500KB vs 60KB), but eliminates custom manifest parsing and provides universal compatibility.

---

## Architecture

### Content Layers

**Telar supports four content types:**

1. **Objects/Collection** - Browsable gallery of all items with metadata
2. **Chapters** - Scrollytelling narratives referencing objects
3. **Story Steps** - Scrollable sections with question/answer format
4. **Glossary** - Shared reusable term definitions

### Information Depth

**Progressive disclosure through layered panels:**

1. **Main narrative** (left column) - Question + brief answer
2. **Layer 1** (offcanvas panel) - Detailed context
3. **Layer 2** (stacked overlay) - Deep scholarly content
4. **Glossary panels** (popup overlay) - Term definitions with `[[term-id]]` syntax

### Jekyll Collections

```yaml
collections:
  objects:
    output: true
    permalink: /collection/:name/
  chapters:
    output: true
    permalink: /chapters/:name/
  glossary:
    output: true
    permalink: /glossary/:name/
```

---

## Data Structure

### Single Google Sheet with Multiple Tabs

**Tab 1: Instructions** (read-only template guide)
- How to use the template
- Column definitions
- File size limits and best practices
- Example entries

**Tab 2: Project Setup**

*Section 1: Project Info (key-value pairs)*
```csv
setting,value
project_title,"Your Project Title"
project_subtitle,"Subtitle"
project_description,"Description of the project"
project_author,"Author Name"
institution,"Institution Name"
hero_image,"home-hero.jpg"
heading_font,"Crimson Text"
body_font,"Open Sans"
text_color,"#333333"
background_color,"#ffffff"
accent_color,"#8B4513"
logo_image,"logo.png"
```

*Section 2: Chapters (after blank row)*
```csv
chapter_id,title,subtitle,hero_image,author,description
ch_001,"Chapter Title","Subtitle","hero1.jpg","Author","Description text"
ch_002,"Chapter 2","Subtitle 2","hero2.jpg","Author","Description text"
```

**Tab 3: Objects**
```csv
object_id,label,artist,type,location,current_location,date,description,source,image,iiif_manifest
obj_001,"Object Title","Artist Name","Type","Location","Current Location","1500-1600","Description","Source URL","filename.jpg",
obj_002,"External Object","Unknown","Type","","Museum","1600","Description","","","https://example.org/iiif/manifest.json"
```

**Tab 4: Glossary**
```csv
term_id,term,title,text,image
colonial-landscape,"Paisaje Colonial","Colonial Landscape","Full definition text with multiple paragraphs...","glossary-image.jpg"
indigenous-resistance,"Resistencia Indígena","Indigenous Resistance","Definition text...","resistance.jpg"
```

**Tab 5+: Chapter [N] - Story Steps**
```csv
step_id,question,answer,object_id,image_behavior,x_coordinate,y_coordinate,zoom_level,layer1_title,layer1_text,layer1_image,layer2_title,layer2_text,layer2_image,chapter_break
1,"What is this?","Brief answer text","obj_001","zoom","1024","682","1","Layer 1 Title","Layer 1 text with [[term-id]] references","layer1.jpg","Layer 2 Title","Layer 2 text","layer2.jpg",
2,"Why does it matter?","Another answer","obj_001","zoom","1500","800","2","Title","Text","img.jpg","Title 2","Text 2","img2.jpg",
3,"","","","","","","","Chapter 2","","chapter2-hero.jpg","","","","yes"
```

### Column Definitions

**Story Steps:**
- `step_id` - Unique sequential number
- `question` - Main question/heading
- `answer` - Brief introductory text
- `object_id` - Reference to object in Objects tab
- `image_behavior` - "zoom" (same image, new coordinates) or "new" (different image)
- `x_coordinate`, `y_coordinate` - Camera position for IIIF viewer
- `zoom_level` - Zoom level (negative = out, positive = in)
- `layer1_title`, `layer1_text`, `layer1_image` - First depth panel
- `layer2_title`, `layer2_text`, `layer2_image` - Second depth panel
- `chapter_break` - "yes" for full-screen chapter intro cards

**Image Sources:**
- `image` - Local filename (generates IIIF tiles)
- `iiif_manifest` - External IIIF URL (no processing)
- One or the other required, not both

---

## File Structure

```
telar/
├── .github/
│   └── workflows/
│       └── build-deploy.yml          # GitHub Actions workflow
├── _config.yml                       # Jekyll configuration
├── _data/                            # Auto-populated from Google Sheets
│   ├── project_info.json
│   ├── chapters.json
│   ├── objects.json
│   └── glossary.json
├── _includes/
│   ├── head.html
│   ├── header.html
│   ├── footer.html
│   └── story/
│       ├── step.html                 # Story step template
│       ├── panel-layer1.html         # Offcanvas panel
│       ├── panel-layer2.html         # Stacked overlay
│       ├── panel-glossary.html       # Glossary popup
│       └── viewer.html               # UniversalViewer container
├── _layouts/
│   ├── default.html                  # Base layout
│   ├── home.html                     # Homepage
│   ├── chapter.html                  # Chapter scrollytelling page
│   ├── collection.html               # Collection gallery
│   ├── object.html                   # Object detail page
│   └── glossary-index.html           # Glossary list
├── _objects/                         # Auto-generated from data
│   └── [generated .md files]
├── _chapters/                        # Auto-generated from data
│   └── [generated .md files]
├── _glossary/                        # Auto-generated from data
│   └── [generated .md files]
├── assets/
│   ├── css/
│   │   └── telar.css                 # Custom styles (Paisajes aesthetic)
│   ├── js/
│   │   ├── chapter.js                # Scrollytelling runtime with UV/OSD
│   │   ├── telar.js                  # Core utilities
│   │   └── scrollama.min.js          # Scrollama library
│   └── images/                       # Placeholder images
├── images/
│   └── objects/                      # User uploads images here
│       ├── khipu.jpg
│       └── map.tif
├── iiif/
│   └── objects/                      # Auto-generated IIIF tiles
│       ├── obj_001/
│       │   ├── info.json
│       │   ├── manifest.json
│       │   └── [tile directories]
│       └── obj_002/
│           └── manifest.json         # External reference only
├── pages/
│   ├── index.md                      # Homepage
│   ├── collection.md                 # Collection gallery page
│   └── glossary.md                   # Glossary index page
├── scripts/
│   ├── fetch_sheets.py               # Fetch CSVs from Google Sheets
│   ├── process_data.py               # Transform CSVs to Jekyll data
│   └── generate_collections.py      # Create collection markdown files
├── .gitignore
├── Gemfile
├── Gemfile.lock
├── README.md                         # User documentation
└── PLAN.md                           # This file
```

---

## User Workflow

### For End Users (Zero Local Setup)

1. **Fork** the Telar template repository on GitHub
2. **Copy** the Google Sheet template
3. **Fill in** project info, chapters, objects, glossary
4. **Publish** Google Sheet to web as CSV
5. **Add** CSV URLs to `_config.yml` via GitHub web editor
6. **Upload** images to `images/objects/` via GitHub web interface
7. **Commit** changes
8. **Wait** for GitHub Actions to process (5-10 minutes)
9. **Visit** GitHub Pages URL - site is live

### For Developers (Optional Local Testing)

1. Clone repository
2. Install Ruby and Jekyll
3. `bundle install`
4. `bundle exec jekyll serve`
5. View at `localhost:4000`

---

## GitHub Actions Workflow

### Trigger
- On push to `main` branch
- Only when changes detected in:
  - `_config.yml`
  - `images/objects/`
  - Manual workflow dispatch

### Steps

1. **Checkout repository**

2. **Setup Python environment**
   - Python 3.9+
   - Install Poetry
   - Install iiif-static-choices

3. **Fetch Google Sheets data**
   - Read CSV URLs from `_config.yml`
   - Download published CSVs
   - Save to `_data/raw/`

4. **Process data**
   - Parse CSVs
   - Transform to JSON
   - Generate Jekyll collection files
   - Save to `_data/` and `_objects/`, `_chapters/`, `_glossary/`

5. **Generate IIIF tiles**
   - Detect new/changed images in `images/objects/`
   - Run Bodleian iiif-static-choices
   - Generate tiles in `iiif/objects/[object-id]/`
   - Generate manifests
   - Skip for objects with external IIIF URLs

6. **Setup Ruby environment**
   - Ruby 3.2+
   - Bundler
   - Install gems

7. **Build Jekyll site**
   - `bundle exec jekyll build`
   - Output to `_site/`

8. **Deploy to GitHub Pages**
   - Push `_site/` to `gh-pages` branch
   - Or use GitHub Pages deployment action

### Caching Strategy
- Cache Ruby gems
- Cache Python dependencies
- Cache generated IIIF tiles (only regenerate on image changes)

---

## Page Types

### 1. Homepage (`pages/index.md`)

**Layout:** `home.html`

**Content:**
- Hero section with project title, subtitle, hero image
- Project description
- Chapter list (cards with title, subtitle, hero image)
- Links to:
  - Collection gallery
  - Glossary index
  - About page (optional)

**Data sources:**
- `site.data.project_info`
- `site.data.chapters`

### 2. Chapter Page (`_layouts/chapter.html`)

**Layout:** Fixed viewer (right) + scrolling narrative (left)

**Components:**
- **Fixed right column:**
  - UniversalViewer initialized with first object's IIIF manifest
  - Updates smoothly on scroll via underlying OpenSeadragon API (zoom/pan or switch objects)
  - Handles both local IIIF tiles and external manifests

- **Scrolling left column:**
  - Story steps with question/answer
  - "More info" buttons trigger layer panels
  - Glossary term links (detected via `[[term-id]]`)
  - Scrollspy dots navigation

- **End-of-chapter navigation:**
  - Previous chapter (if not first)
  - Return to home
  - Next chapter (if not last)

**Interactions:**
- Scrollama detects scroll position
- JavaScript accesses OpenSeadragon viewer through UniversalViewer extension
- Updates viewer coordinates (pan/zoom) or switches manifests
- Opens/closes panels
- Manages glossary popups

### 3. Collection Gallery (`pages/collection.md`)

**Layout:** `collection.html` (Wax-style grid)

**Content:**
- Filterable/searchable grid of objects
- Thumbnail images
- Basic metadata (title, artist, date)
- Click to object detail page

**Data source:**
- `site.objects` collection

### 4. Object Detail Page (`_layouts/object.html`)

**Content:**
- UniversalViewer displaying IIIF manifest or info.json
- Complete metadata display:
  - Label, artist, type, location, date
  - Description
  - Source link
  - IIIF manifest link
- "View in story" links (which chapters reference this object)
- User can freely explore, zoom, pan (viewer in exploration mode)

### 5. Glossary Index (`pages/glossary.md`)

**Layout:** `glossary-index.html`

**Content:**
- Alphabetical list of all terms
- Click to open glossary panel
- Or dedicated glossary detail pages

---

## Styling

### Default Aesthetic (Paisajes Coloniales)

**Typography:**
- Headings: Serif font (e.g., Crimson Text)
- Body: Sans-serif (e.g., Open Sans)
- Clean, academic feel

**Colors:**
- Neutral backgrounds (off-white, light gray)
- Earth-tone accents (browns, ochres)
- High contrast for accessibility

**Layout:**
- Generous whitespace
- Clear hierarchy
- Responsive breakpoints

### Customization

Users can override defaults in Project Setup:
- `heading_font`, `body_font` (Google Fonts)
- `text_color`, `background_color`, `accent_color` (hex codes)
- `logo_image` (institution branding)

CSS custom properties make this simple:
```css
:root {
  --heading-font: var(--user-heading-font, 'Crimson Text', serif);
  --body-font: var(--user-body-font, 'Open Sans', sans-serif);
  --text-color: var(--user-text-color, #333);
  --bg-color: var(--user-bg-color, #fafafa);
  --accent-color: var(--user-accent-color, #8B4513);
}
```

---

## IIIF Implementation

### Local Images

**Workflow:**
1. User uploads image to `images/objects/filename.jpg`
2. References in Objects tab: `image` column = "filename.jpg"
3. GitHub Actions detects new file
4. Bodleian tool generates:
   - Tiles in `iiif/objects/obj_id/tiles/`
   - `info.json` (IIIF Image API)
   - `manifest.json` (IIIF Presentation API)
5. Jekyll references manifest URL

**File size limits (documented in Instructions tab):**
- Individual images: < 100MB (preferably < 50MB)
- Total project: < 1GB (GitHub recommendation)
- 20-50 objects optimal for performance

### External IIIF Resources

**Workflow:**
1. User has existing IIIF manifest URL
2. References in Objects tab: `iiif_manifest` column = "https://example.org/iiif/manifest.json"
3. GitHub Actions skips tile generation
4. Jekyll references external URL directly

### Mixed Projects

- Some objects local (generate tiles)
- Some objects external (reference only)
- OpenSeadragon handles both local and external IIIF sources seamlessly

---

## Glossary System

### Authoring

In any text field (story steps, layers), use `[[term-id]]` syntax:

```csv
layer1_text,"The [[colonial-landscape]] transformed indigenous territories through [[encomienda]] systems."
```

### Processing

1. Python script detects `[[...]]` patterns
2. Converts to HTML links with data attributes:
```html
<a href="#" class="glossary-term" data-term-id="colonial-landscape">colonial landscape</a>
```

3. JavaScript handler opens glossary panel on click

### Panel Behavior

- Opens as Bootstrap offcanvas overlay
- Shows full glossary content (title, text, image)
- Can open from any layer (main, layer1, layer2)
- Closes independently or stacks with other panels

---

## Implementation Phases

### Phase 1: Foundation (Week 1)
- [x] Finalize technical decisions
- [ ] Create folder structure
- [ ] Setup Jekyll configuration
- [ ] Create Google Sheet template
- [ ] Write documentation

### Phase 2: Core Features (Week 2)
- [x] Build homepage layout
- [x] Build chapter page layout
- [x] Integrate UniversalViewer
- [x] Implement Scrollama scrollytelling with OpenSeadragon API (via UV)
- [x] Create layer panel system

### Phase 3: Collections (Week 3)
- [ ] Build collection gallery page
- [ ] Build object detail pages
- [ ] Implement search/filter

### Phase 4: Glossary (Week 3)
- [ ] Build glossary index
- [ ] Implement `[[term]]` parser
- [ ] Create glossary panel component

### Phase 5: Automation (Week 4)
- [ ] Create Google Sheets fetch script
- [ ] Create data processing scripts
- [ ] Setup GitHub Actions workflow
- [ ] Integrate Bodleian IIIF tool

### Phase 6: Polish (Week 4)
- [ ] Style with Paisajes aesthetic
- [ ] Responsive design
- [ ] Accessibility improvements
- [ ] Performance optimization

### Phase 7: Documentation & Testing (Week 5)
- [ ] Complete user documentation
- [ ] Create video tutorials
- [ ] Test with sample data
- [ ] Deploy demo site

---

## Success Criteria

**For End Users:**
- Can create a complete exhibition without touching code
- Total time from fork to published: < 2 hours
- Clear error messages and guidance
- Works on mobile and desktop

**For Developers:**
- Clean, documented codebase
- Easy to extend and customize
- Can run locally for development
- Clear contribution guidelines

**For Sustainability:**
- Static site = low hosting costs
- No server dependencies
- Works on GitHub Pages free tier
- Portable to other hosts

**For Accessibility:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast ratios

---

## Future Enhancements (v2+)

### Phase 2 Features
- Visual editor for composing stories (drag-and-drop)
- Text highlighting tool for adding glossary links
- Multi-language support (i18n)
- Video and 3D model support
- Timeline view option
- Advanced search and filtering
- Export to static HTML package
- Migration to Eleventy (if needed for flexibility)

### Community Features
- Template gallery
- Example projects
- Plugin system
- Theming system

---

## Notes

- Follow minimal computing principles throughout
- Prioritize simplicity over features
- Document everything for non-technical users
- Test with real humanities scholars
- Keep dependencies minimal
- Plan for long-term sustainability

