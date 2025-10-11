# Telar - Research Documentation

This document summarizes the research conducted during the design and planning phase of the Telar project.

## Credits

Telar is developed by Adelaida Ávila, Juan Cobo Betancourt, Santiago Muñoz, and students and scholars at the [UCSB Archives, Memory, and Preservation Lab](https://ampl.clair.ucsb.edu), the UT Archives, Mapping, and Preservation Lab, and [Neogranadina](https://neogranadina.org).

---

## Table of Contents

1. [Minimal Computing Principles](#minimal-computing-principles)
2. [IIIF Ecosystem](#iiif-ecosystem)
3. [Existing Tools & Inspiration](#existing-tools--inspiration)
4. [Technical Stack Research](#technical-stack-research)
5. [Static Site Generators](#static-site-generators)
6. [Image Tile Generation](#image-tile-generation)
7. [Manifest Generation](#manifest-generation)
8. [Similar Projects](#similar-projects)
9. [IIIF Viewer Comparison](#iiif-viewer-comparison)

---

## Minimal Computing Principles

**Source:** https://lib-static.github.io/concepts/

### Core Values

**Openness and Accessibility:**
- Emphasizes open licenses, open-source software, and open content
- Supports collaborative and transparent development practices

**Sustainability and Simplicity:**
- Prioritizes plain text files as a simple, sustainable format to store project data
- Uses lightweight tools and approaches that are easy to maintain

### Technical Approaches

**Content Management:**
- Uses plain text, human-readable documents for content and metadata
- Enables flexible content transformation (to HTML, JSON, PDF)
- Treats content as "data" to enable powerful web feature transformations

**Development Environment:**
- Relies on version control (primarily Git)
- Uses text editors and programming languages
- Leverages static site generators to transform source code into websites

**Computational Efficiency:**
- Generates pre-rendered HTML, CSS, and JavaScript files
- Creates websites that are delivered to users exactly as they are on the server
- Utilizes computation to enable flexible web development

### Key Tools
- Static Site Generators
- Version Control Systems
- Command Line Interfaces
- Markup Languages (Markdown, HTML)
- Open-source Libraries and Frameworks

### Application to Telar

The Telar project embodies these principles through:
- Plain text data sources (CSV from Google Sheets)
- Static site generation (Jekyll)
- Git-based version control
- Open-source tools throughout
- Zero server requirements
- Sustainable, long-term hosting on GitHub Pages

---

## IIIF Ecosystem

**Sources:**
- https://iiif.io/get-started/explainers/using_iiif_resources/
- https://github.com/IIIF/awesome-iiif
- https://iiif.io/get-started/tools/

### What is IIIF?

The International Image Interoperability Framework provides a standardized method of describing and delivering images over the web.

### IIIF Manifests

A IIIF Manifest is "the package or envelope which contains links to all of the resources that make up a IIIF item." It's typically a JSON document accessible via a URL that represents a digital object like a book, artwork, or document.

### IIIF APIs

**Image API:**
- Standardizes image delivery
- Supports tiling for zoom functionality
- Defines conformance levels (0-3)

**Presentation API:**
- Describes structure and layout of digital objects
- Used by viewers to display content
- Versions 2.1 and 3.0 in common use

### Level 0 Implementation

Level 0 refers to pre-generated IIIF images. This is ideal for static sites because:
- No image server required
- All tiles generated ahead of time
- Can be hosted on simple web servers or CDNs
- Main limitation: cannot request arbitrary image sizes

### IIIF Viewers

Multiple open-source viewers support IIIF:
- **Universal Viewer** - supports audio/visual, feature-rich
- **Mirador** - supports annotation
- **OpenSeadragon** - lightweight, images only
- **Tify** - simple, modern
- **Diva.js** - manuscript focus

### Application to Telar

Telar uses IIIF to:
- Provide high-quality zoomable images
- Support both local and external image sources
- Ensure long-term interoperability
- Enable use of OpenSeadragon for lightweight, programmatically-controlled viewing

---

## Existing Tools & Inspiration

### Paisajes Coloniales

**URL:** http://paisajescoloniales.com

**Key Features:**
- Scroll-triggered panel system using GSAP ScrollTrigger
- Panels pin vertically as users scroll
- Multiple information layers
- "Palabras clave" (glossary) system
- Multilingual (Spanish/English)
- Focused on single historical map/painting from 1614

**Design Elements:**
- Sequential chapters
- Interactive storytelling
- Modular content presentation
- Visual exploration emphasis
- Scholarly but accessible

**Influence on Telar:**
- Layered panel architecture (3 layers + glossary)
- Scrollytelling interaction pattern
- Full-screen chapter breaks
- Question-driven narrative structure
- Academic aesthetic

### Wax

**URL:** https://minicomp.github.io/wax/

**Description:** Jekyll-based framework for minimal exhibitions with IIIF

**Key Features:**
- Rake tasks for IIIF derivative generation
- Collection-based architecture
- Search functionality
- Minimal dependencies
- Static site output

**Tools:**
- **wax_tasks** - Gem-packaged set of Rake tasks
- **wax_iiif** - Ruby gem for Level 0 IIIF generation (iiif_s3 minus the S3)

**Commands:**
```bash
bundle exec rake wax:derivatives:iiif collection-name
```

**Generates:**
- IIIF-compliant tiles
- Works with OpenSeadragon, Mirador, Leaflet IIIF
- info.json files
- Manifest files

**Influence on Telar:**
- IIIF generation workflow inspiration
- Collection gallery design
- Object detail pages
- Minimal computing approach

### CollectionBuilder

**URL:** https://collectionbuilder.github.io/

**Description:** Static site generator for digital collections

**Key Features:**
- CSV metadata-driven
- GitHub-only workflow option
- No local setup required
- GitHub Pages deployment

**IIIF Integration:**
- Consumes IIIF manifests (doesn't generate)
- Can reference external IIIF resources
- Displays using Universal Viewer
- object_location field can point to IIIF manifests

**Influence on Telar:**
- Zero local setup workflow
- CSV as data source
- GitHub Actions automation
- GitHub Pages deployment pattern

### KnightLab Tools

**URL:** https://storymap.knightlab.com

**Key Tools:**
- StoryMapJS
- TimelineJS
- JuxtaposeJS

**Google Sheets Integration:**
- Template spreadsheets with instructions
- "Make a Copy" workflow
- Publish to web
- Column headers must not change
- Cell-by-cell guidance in template

**TimelineJS Workflow:**
1. Copy template to Google Drive
2. Fill in spreadsheet
3. Publish to web
4. Generate embed code

**Influence on Telar:**
- Google Sheets as authoring interface
- Instructions tab in template
- Clear column definitions
- Non-technical user focus

### Exhibit.so

**URL:** https://www.exhibit.so/

**Description:** Digital platform for creating and sharing online exhibitions

**Key Features:**
- User-friendly editor for stories and quizzes
- Supports 3D models and high-resolution IIIF-compatible images
- Multiple presentation modes: scrollytelling, slideshows, kiosks
- Customization: background/font colors
- Public or password-protected exhibits
- Embed via iframe
- Duplicate and remix exhibits

**Target Audience:**
- Libraries, museums, educational institutions
- Organizations like University of St Andrews, British Library

**Key Strengths:**
- Built on Universal Viewer
- Promotes engagement and learning
- Designed for online learning environments

**Influence on Telar:**
- Validation of scrollytelling + IIIF approach
- Multiple presentation modes concept
- Educational context focus
- **Telar differentiator:** Open-source, self-hosted, minimal computing principles

---

## Technical Stack Research

### Static Site Generators Comparison

#### Jekyll

**Pros:**
- ✅ Native GitHub Pages support (zero config deployment)
- ✅ Mature, well-documented
- ✅ Strong DH/GLAM community (Wax, CollectionBuilder, Ed)
- ✅ Built-in Collections feature (perfect for objects/chapters)
- ✅ Liquid templating familiar to many
- ✅ Ruby gems ecosystem (wax_iiif available)

**Cons:**
- ❌ Slower builds than alternatives
- ❌ Limited data transformation in Liquid
- ❌ Ruby dependency less familiar to web developers
- ❌ Can't easily integrate IIIF generation into Jekyll build

**Best for:** Projects prioritizing simplicity, DH community alignment, and GitHub Pages native support

#### Eleventy (11ty)

**Pros:**
- ✅ JavaScript-based (easier data manipulation)
- ✅ Fast builds
- ✅ Flexible templating (Nunjucks, Liquid, etc.)
- ✅ Better CSV/JSON handling
- ✅ Can integrate IIIF generation into build
- ✅ Modern developer experience
- ✅ Active, growing community

**Cons:**
- ❌ Requires GitHub Actions for deployment (not native GitHub Pages)
- ❌ Less established in GLAM community
- ❌ More configuration needed
- ❌ No built-in Collections (but has pagination/collections)

**Best for:** Projects needing complex data processing or custom build pipelines

#### Hugo

**Pros:**
- ✅ Extremely fast builds
- ✅ Single binary (no dependencies)
- ✅ Built-in image processing
- ✅ Good data files support

**Cons:**
- ❌ Go templates less intuitive
- ❌ Steeper learning curve
- ❌ Less flexible for custom processing
- ❌ Smaller GLAM community

**Best for:** Large sites needing fast builds

#### Decision: Jekyll

**Rationale:**
- Target users are DH scholars, not developers
- GitHub Pages native support = simplest onboarding
- Wax patterns already proven in DH community
- IIIF generation can happen in GitHub Actions before Jekyll build
- Collections feature perfect for objects/chapters/glossary
- Can migrate to Eleventy in v2 if JavaScript processing becomes essential

---

## Image Tile Generation

**Research Sources:**
- https://training.iiif.io/dhsi/day-one/level-0-static.html
- https://training.iiif.io/iiif-5-day-workshop/day-one/level0-github-hosting.html
- https://github.com/IIIF/awesome-iiif

### Available Tools

#### 1. iiif-tiler (Java)

**Repository:** https://github.com/glenrobson/iiif-tiler

**Features:**
- Java-based static IIIF tile generator
- Compliant with IIIF Image API v2.1 and v3.0
- Simple usage: drag image onto .jar file
- Generates tiles in iiif directory

**Pros:**
- ✅ Simple, drag-and-drop interface
- ✅ IIIF 3.0 support
- ✅ Easy to use in GitHub Actions

**Cons:**
- ❌ Java dependency
- ❌ Less common in DH workflows

#### 2. Bodleian iiif-static-choices (Python)

**Repository:** https://github.com/bodleian/iiif-static-choices

**Features:**
- Python-based tile and manifest generator
- Specifically designed to "de-mystify" IIIF for static sites
- Generates both tiles AND manifests together
- YAML configuration
- Includes local server for testing

**Purpose:**
"Put together to de-mystify the process of creating and hosting IIIF content and allow implementations without the need for specialist infrastructure such as imaging servers (iip) and manifest servers."

**Pros:**
- ✅ Purpose-built for static sites without servers
- ✅ Generates tiles + manifests
- ✅ Well-documented
- ✅ Python 3.9 + Poetry
- ✅ Actively maintained by Bodleian Libraries

**Cons:**
- ❌ Python dependency (but common in DH)

#### 3. magick_tile (Python + ImageMagick)

**Repository:** https://github.com/cmu-lib/magick_tile

**Features:**
- Python script using ImageMagick
- Fast tile generation
- Level 0 compliant
- Structures directories for IIIF

**Pros:**
- ✅ Fast
- ✅ Uses ImageMagick (often already installed)

**Cons:**
- ❌ Doesn't generate manifests
- ❌ Less flexible than other options

#### 4. iiif_s3 / wax_iiif (Ruby)

**Repository:** https://github.com/minicomp/wax_iiif

**Features:**
- Ruby library for Level 0 IIIF generation
- Copy of iiif_s3 without S3 dependencies
- Used by Wax
- Rake tasks integration

**Command:**
```bash
bundle exec rake wax:derivatives:iiif collection-name
```

**Pros:**
- ✅ Ruby ecosystem match with Jekyll
- ✅ Proven with Wax
- ✅ Generates tiles + manifests

**Cons:**
- ❌ Ruby gem complexity
- ❌ Requires ImageMagick + Ghostscript

#### 5. iiif (Python)

**Repository:** https://github.com/zimeon/iiif

**Features:**
- Reference implementation of IIIF Image API
- Includes test server
- Static tile generator
- Python library

**Pros:**
- ✅ Reference implementation
- ✅ Well-documented

**Cons:**
- ❌ More complex setup
- ❌ Designed more for servers than static generation

### Decision: Bodleian iiif-static-choices

**Rationale:**
- Purpose-built for exactly Telar's use case (static sites without infrastructure)
- Generates both tiles and manifests
- Well-documented with clear examples
- Python is common in DH workflows
- Active maintenance by major institution
- Simpler than managing Ruby gems
- Clear configuration via YAML

---

## Manifest Generation

**Research Sources:**
- https://training.iiif.io/dhsi/day-two/auto-generate-manifest.html
- https://github.com/IIIF-Commons/biiif

### Available Tools

#### biiif (Node.js)

**Repository:** https://github.com/IIIF-Commons/biiif

**Description:** Organizes files according to a simple naming convention to generate IIIF Presentation API v3 JSON

**Naming Convention:**
- Folders without underscores = collections
- Folders with underscores = manifests/canvases
- Files in canvas folders (.jpg, .pdf) = automatically annotated
- Custom annotations with .yml files

**Example Structure:**
```
lord-of-the-rings/                 // Collection
├── info.yml                       // Metadata
├── thumb.jpg                      // Thumbnail
└── 0-fellowship-of-the-ring/      // Manifest
    ├── _page-1/                   // Canvas
    |   ├── page-1.jpg             // Image
    |   └── info.yml               // Canvas metadata
```

**Generation:**
```bash
biiif [folder] -u [url manifest/info]
```

**Output:**
- Generates index.json files
- Includes image tile services
- Supports metadata, thumbnails, linked manifests
- Compatible with Universal Viewer v3

**Pros:**
- ✅ Simple naming convention
- ✅ IIIF v3 compliant
- ✅ Elegant approach
- ✅ Template available for Netlify/Vercel

**Cons:**
- ❌ Node.js dependency (when using Jekyll)
- ❌ Requires specific folder structure

#### O'Sullivan (Ruby)

**Description:** Ruby API for creating IIIF manifests

**Pros:**
- ✅ Ruby ecosystem match

**Cons:**
- ❌ Less documented than alternatives
- ❌ Manual manifest construction

#### Bodleian Tool (Included)

Since Bodleian iiif-static-choices generates both tiles and manifests, we don't need a separate manifest generation tool.

### Decision: Use Bodleian Tool

**Rationale:**
- Already generating tiles with Bodleian tool
- Generates manifests simultaneously
- No need for separate tool
- Reduces dependencies
- Single workflow for both tasks

---

## Similar Projects Analysis

### Canopy IIIF

**URL:** https://canopy-iiif.github.io/docs/

**Description:** Next.js site generator sourced from IIIF Collections

**Key Features:**
- Generates browseable and searchable site from IIIF Collection
- Built with Next.js (React)
- Markdown for adding scholarly context
- Discovery-focused
- Fast creation and customization
- Curate works from multiple sources

**Target Audience:**
- Libraries, archives, museums
- Digital scholarship
- Collections display

**Comparison to Telar:**

| Feature | Canopy IIIF | Telar |
|---------|-------------|-------|
| Focus | Collection management + discovery | Storytelling + narrative |
| Framework | Next.js (React) | Jekyll (static) |
| Data source | IIIF Collections | Google Sheets + IIIF |
| Complexity | Medium-high | Low (minimal computing) |
| User workflow | Technical setup required | Zero setup (GitHub-only) |
| Narrative structure | Secondary | Primary |
| Panel system | No | Yes (3 layers + glossary) |
| Scrollytelling | No | Yes (core feature) |

**Conclusion:** Canopy far exceeds what Telar aims to do. Telar focuses on storytelling with objects, not comprehensive collection management.

### Juncture Digital

**URL:** Mentioned in IIIF tools

**Description:** Free-to-use, open-source framework for converting simple text files into visual essays

**Relevance:** Similar storytelling focus, but different approach

### Storiiies / Exhibit

**Description:** IIIF storytelling tools with guided navigation

**Relevance:** Validates market for IIIF + storytelling, but often requires technical setup or is proprietary

---

## Google Sheets Integration Research

**Research Sources:**
- KnightLab TimelineJS
- https://timeline.knightlab.com/docs/using-spreadsheets.html

### KnightLab Approach

**Workflow:**
1. User copies template spreadsheet
2. Fills in data following column headers
3. Publishes sheet to web
4. KnightLab reads published CSV
5. Generates interactive timeline

**Key Principles:**
- Don't change column headers
- Don't remove columns
- Don't leave blank rows
- Instructions built into template

**Publishing:**
- File > Share > Publish to Web
- Publish as CSV (not web page)
- Don't set to "anyone can edit" (security)
- Only "Publish to web" needed (not sharing settings)

### Application to Telar

**Chosen Approach: "Publish to Web" CSV Export**

**Workflow:**
1. User copies Telar template spreadsheet
2. Fills in tabs (Project Setup, Objects, Glossary, Chapters)
3. Publishes to web as CSV
4. Adds published CSV URL to `_config.yml`
5. GitHub Actions fetches CSV
6. Converts to JSON for Jekyll

**Benefits:**
- ✅ Simple for users (no API auth needed)
- ✅ Users can edit in familiar Google Sheets interface
- ✅ Works with private sheets (once published link generated)
- ✅ Automatic updates when sheet republished
- ✅ No external services or API keys

**`_config.yml` Configuration:**
```yaml
google_sheets:
  url: "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID"
  # Each tab will be fetched as CSV
```

---

## Storage Strategy Research

### GitHub Repository Size Limits

**GitHub Guidelines:**
- Recommended repository size: < 1 GB
- Repositories over 5 GB may receive warnings
- Individual file size limit: 100 MB (hard limit)
- Git Large File Storage (LFS):
  - Free tier: 1 GB storage + 1 GB/month bandwidth
  - Additional: $5/month for 50 GB

**GitHub Pages:**
- Published sites should be < 1 GB
- Soft bandwidth limit: 100 GB/month
- Soft build limit: 10 builds/hour

### IIIF Tile Size Estimates

**Typical Level 0 Implementation:**
- Source image: 5-50 MB (high-res TIFF or JPEG)
- Generated tiles: 2-10x source size
- Example: 20 MB source → 100-200 MB tiles
- 20 objects = 2-4 GB of tiles

**Implications:**
- Small projects (5-10 objects): No issues
- Medium projects (20-30 objects): Approaching limits
- Large projects (50+ objects): Consider external hosting

### Options Evaluated

**Option A: In-Repo Storage (`iiif/objects/`)**
- Store all tiles in repository
- Simple, transparent structure
- Works for small-medium projects
- Will document size limits clearly

**Option B: Separate Branch**
- Keep main branch clean
- Still counts toward repo size
- More complex workflow

**Option C: External Hosting (S3, etc.)**
- Unlimited storage
- Requires paid service
- Setup complexity
- Violates minimal computing principles

**Option D: Git LFS**
- Designed for large files
- GitHub free tier too limited (1 GB)
- Additional complexity

### Decision: Option A with Documentation

**Rationale:**
- Most Telar projects will be small-medium (10-30 objects)
- Simple structure for users
- Clear documentation about limits
- Recommendation to use external IIIF for large image sets
- Can add alternative strategies in future versions

**Documented Guidelines:**
- Keep projects < 50 objects for GitHub hosting
- Use external IIIF manifests for larger collections
- Compress images before upload (< 50 MB per file)
- Consider external hosting for 100+ object projects

---

## IIIF Viewer Comparison

**Research Sources:**
- https://universalviewer.io/
- https://openseadragon.github.io/
- https://projectmirador.org/
- https://training.iiif.io/intro-to-iiif/UNIVERSAL_VIEWER_AND_MIRADOR.html
- Omeka Forum discussions
- IIIF community resources

### Viewer Categories

IIIF viewers fall into two main categories:

1. **Image API viewers**: Focus on zoom/pan behavior (OpenSeadragon, Leaflet-IIIF)
2. **Presentation API viewers**: Handle full manifests with metadata, structure, annotations (Universal Viewer, Mirador)

### Universal Viewer

**Type:** Full IIIF Presentation API viewer

**Repository:** TypeScript-based, community-developed

**Key Features:**
- Zoomable images using OpenSeadragon and IIIF Image API
- Supports multiple media types: 3D, audio, video, PDF
- Embeddable with deep linking capabilities
- Highly configurable with customizable themes
- Searchable with autocomplete
- Internationalized UI (translatable)
- IIIF Authentication API support
- "YouTube-style embedding"

**Used By:**
- Wellcome Library
- British Library
- National Library of Wales
- Many major cultural heritage institutions

**Versions:**
- v2.0.2: Faster PDF handling, IIIF v2 only
- v3.1.1 & v4: Support IIIF v3

**Pros:**
- ✅ Feature-rich interface
- ✅ Multiple media type support
- ✅ Wide adoption in GLAM sector
- ✅ Professional appearance
- ✅ Built-in UI chrome (thumbnails, metadata panels)

**Cons:**
- ❌ Heavier weight (larger file size)
- ❌ TypeScript complexity
- ❌ Less straightforward JavaScript API for programmatic control
- ❌ Multi-media features unused in image-only projects
- ❌ May be overkill for simple use cases

**Best for:** Multi-media exhibitions with audio, video, 3D, or complex collections requiring rich UI

### Mirador

**Type:** Full IIIF Presentation API viewer

**Repository:** Open-source, web-based

**Origins:** Developed by Art History and Manuscripts scholars at Stanford University

**Key Features:**
- Multi-window "workspace" environment
- Zoom-pan-rotate functionality
- Compare multiple images side-by-side
- Annotation support (create, view, edit)
- Can disable workspace features for simpler display
- Support for IIIF Presentation API 2.x and 3.x

**Embedding:**
- Can embed via `<script>` tag from CDN (unpkg.com)
- Configurable via JavaScript options
- iframe embedding supported

**Pros:**
- ✅ Excellent for annotation workflows
- ✅ Comparative viewing (side-by-side)
- ✅ Scholarly research features
- ✅ Flexible configuration
- ✅ Active development community

**Cons:**
- ❌ Workspace paradigm doesn't fit fixed viewer model
- ❌ More complex than needed for scrollytelling
- ❌ Heavier than image-only viewers
- ❌ Learning curve for users

**Best for:** Scholarly annotation projects, manuscript comparison, research environments

### OpenSeadragon

**Type:** Image API viewer only

**Repository:** Pure JavaScript, open-source

**Origins:** High-resolution zoomable image viewer

**Key Features:**
- Pure JavaScript implementation, no dependencies
- Supports multiple tile source protocols:
  - IIIF (versions 1.0, 1.1, 2.x, 3.x)
  - DZI (Deep Zoom Image)
  - TMS (Tile Map Service)
  - Zoomify
  - Custom sources
- Works on desktop and mobile browsers
- Extensive plugin ecosystem
- Highly customizable
- Used as the zoom engine in other IIIF viewers (including Universal Viewer)

**JavaScript API:**
```javascript
// Initialize viewer
var viewer = OpenSeadragon({
  id: "viewer-div",
  tileSources: "/path/to/info.json"
});

// Programmatic control (critical for scrollytelling)
viewer.viewport.panTo(new OpenSeadragon.Point(x, y), true);
viewer.viewport.zoomTo(zoomLevel, null, true);
viewer.viewport.fitBounds(bounds, true);

// Event handling
viewer.addHandler('open', function() {
  // Viewer ready
});
```

**IIIF Integration:**
- Native support via info.json reference as tileSource
- Auto-detects IIIF by profile attribute
- Simple inline configuration

**Installation:**
- CDN: unpkg.com, jsDelivr
- npm package
- Direct download

**Pros:**
- ✅ **Lightweight** (60KB minified)
- ✅ **Excellent programmatic control** for scrollytelling
- ✅ **No dependencies**
- ✅ **Clean, well-documented JavaScript API**
- ✅ Native IIIF support (just point to info.json)
- ✅ Used as base component in other viewers
- ✅ Extensive plugin ecosystem (annotation, measurement, etc.)
- ✅ Fast performance
- ✅ Already proven in weaving_history proof of concept

**Cons:**
- ❌ Images only (no audio, video, PDF)
- ❌ No built-in UI chrome (no thumbnails, metadata panels)
- ❌ Requires plugin or custom code for Presentation API manifests
- ❌ Developer must build custom UI

**Best for:** Image-focused projects requiring programmatic control, lightweight implementations, custom UI

### Leaflet-IIIF

**Type:** Image API viewer

**Description:** Lightweight, extensible IIIF image viewer built on Leaflet.js

**Comparison to OpenSeadragon:**
- Lighter weight alternative
- Built on mapping library (Leaflet)
- Less extensive documentation
- Smaller plugin ecosystem
- Good for geographic context

**Used in:** weaving_history proof of concept

### Diva.js

**Type:** Image API viewer

**Focus:** Manuscript and document viewing

**Features:**
- Designed for page-turning interfaces
- Lighter than Universal Viewer
- Manuscript-specific features

**Status:** Less active development than alternatives

---

## Decision: UniversalViewer for Telar

### Rationale

After thorough comparison and inspired by **Exhibit.so's** successful implementation, **UniversalViewer** was selected over OpenSeadragon alone and Mirador for the following reasons:

#### 1. Universal IIIF Manifest Support

**The Critical Requirement:** Telar must support both local IIIF tiles AND external IIIF manifests from any institution (Huntington Library, Harvard Art Museums, British Museum, etc.).

**UniversalViewer advantages:**
- Native support for IIIF Presentation API (manifest.json)
- Native support for IIIF Image API (info.json)
- No hardcoded URL transformations needed
- Works with any IIIF-compliant resource universally

**OpenSeadragon limitation:**
- Primarily designed for Image API (info.json)
- Requires custom manifest parsing for Presentation API
- Would need institution-specific URL transformations
- Adds maintenance burden for diverse IIIF sources

#### 2. Scrollytelling Compatibility

**UniversalViewer is built on OpenSeadragon**, providing full programmatic control for scrollytelling:

```javascript
// Initialize UniversalViewer
var urlAdaptor = new UV.IIIFURLAdaptor();
const data = urlAdaptor.getInitialData({
  manifest: manifestUrl,
  embedded: true
});
uvInstance = UV.init('viewer-container', data);

// Access underlying OpenSeadragon viewer
uvInstance.on('openseadragonExtension.opened', function() {
  osdViewer = uvInstance.extension.centerPanel.viewer;

  // Full OSD API available for scrollytelling
  osdViewer.viewport.panTo(new OpenSeadragon.Point(x, y), true);
  osdViewer.viewport.zoomTo(zoom, true);
});
```

**Key insight:** We get OpenSeadragon's programmatic control PLUS universal manifest support.

#### 3. Proven for Storytelling

**Exhibit.so validation:**
- https://www.exhibit.so/ uses UniversalViewer
- Successfully implements scrollytelling with IIIF
- Supports multiple presentation modes
- Demonstrates UV can handle both exploration and programmatic control

This real-world example proved UniversalViewer was the right choice for Telar's use case.

#### 4. Single Viewer Architecture

**Simplified implementation:**
- Same viewer for object pages (exploration mode) and chapter pages (scrollytelling mode)
- No need to maintain two different viewer systems
- Consistent user experience across site
- Reduced JavaScript complexity

**OpenSeadragon-only approach would require:**
- Custom manifest parser for Presentation API
- Institution-specific URL transformations
- Fallback logic for unsupported manifests
- Ongoing maintenance as IIIF sources change

#### 5. Future-Ready

**Built-in support for:**
- 3D models (if Telar v2 expands scope)
- Video and audio (future multimedia stories)
- PDF documents
- Complex multi-canvas objects

**Progressive enhancement path:**
- Start with images (Telar v1)
- Add multimedia without changing viewer (v2)
- Leverage existing GLAM institution content

#### 6. GLAM Standard

**Wide adoption ensures:**
- Long-term support and maintenance
- Extensive documentation
- Active community
- Compatibility with major repositories

**Used by:**
- Wellcome Library
- British Library
- National Library of Wales
- Many cultural heritage institutions

### Trade-offs Accepted

**File Size:**
- UniversalViewer: ~500KB (includes OpenSeadragon + UI framework)
- OpenSeadragon alone: ~60KB

**Why this is acceptable:**
- Eliminates custom manifest parsing (~100KB saved)
- Provides universal IIIF compatibility (worth the bytes)
- Minimal computing principles still met (static site, no server)
- Bandwidth trade-off justified by functionality gain

**UI Chrome:**
- UV includes built-in controls (can be customized or hidden)
- Telar uses custom panels, so some UV UI is redundant
- But viewer quality and universal compatibility outweigh this

### Technical Implementation Notes

**Architecture:**
1. **Object pages**: UV in exploration mode (user controls viewer)
2. **Chapter pages**: UV in scrollytelling mode (JavaScript controls viewport via OSD)

**Manifest handling:**
```javascript
// Universal approach - works with ANY IIIF manifest
function getManifestUrl(objectId) {
  const object = objectsIndex[objectId];

  // External manifest URL?
  if (object.iiif_manifest && object.iiif_manifest.trim() !== '') {
    return object.iiif_manifest;  // Huntington, Harvard, BM, etc.
  }

  // Local IIIF tiles
  return `/iiif/objects/${objectId}/info.json`;
}

// UV handles both cases natively - no parsing needed
uvInstance = UV.init('viewer-container', {
  manifest: getManifestUrl(objectId),
  embedded: true
});
```

**Collection page thumbnails:**
- IIIF Image API: Standard thumbnail pattern
- IIIF Presentation manifests: Fetch and extract thumbnail from JSON
- Supports both IIIF v2 and v3 formats

### Comparison to Initial OpenSeadragon Plan

**What changed:**
- Initial plan: Use OpenSeadragon for lightweight, programmatic control
- User requirement: "We need to draw on images not hosted in the repo through IIIF manifests"
- Reality check: OpenSeadragon doesn't natively handle Presentation manifests
- Solution: Use UniversalViewer (which includes OpenSeadragon internally)

**What we kept:**
- Programmatic viewport control via OpenSeadragon API
- Scrollytelling interaction pattern
- Minimal computing principles (static site)
- IIIF compatibility

**What we gained:**
- Universal manifest support (any institution)
- No custom parsing needed
- Professional viewer UI (when useful)
- Future multimedia support

### Future Considerations

**If Telar v2+ needs:**
- Multi-media support → Already built-in (video, audio, 3D)
- Annotation → Consider UV annotation extensions
- Multi-image comparison → Could integrate Mirador alongside UV for specific use cases

**Migration path:**
- UniversalViewer is stable and actively maintained
- Based on OpenSeadragon (which is even more stable)
- Can always access underlying OSD if UV API changes
- Well-supported by IIIF community

---

## Lessons Learned

### Key Insights

1. **Simplicity Wins:** Jekyll + GitHub Pages is simpler than more powerful alternatives for target audience

2. **Purpose-Built Tools:** Bodleian tool designed specifically for our use case (static IIIF without servers)

3. **Community Matters:** DH/GLAM community familiarity with Jekyll is valuable

4. **Progressive Enhancement:** Start simple (Jekyll), can migrate to Eleventy if needed

5. **Documentation Critical:** Google Sheets Instructions tab must be excellent for non-technical users

6. **Storage Constraints:** GitHub repo limits are real but manageable for typical projects

7. **Mixed Sources:** Supporting both local and external IIIF adds flexibility without much complexity

8. **Layered Narrative:** Paisajes model of 3 layers + glossary is powerful for scholarly content

9. **Viewer Choice Matters:** UniversalViewer provides universal IIIF manifest support while still allowing OpenSeadragon's programmatic control for scrollytelling - best of both worlds

10. **Real-World Validation:** Exhibit.so's successful use of UniversalViewer for scrollytelling proved the approach works in production

### Design Principles Validated

- **Minimal computing:** Plain text, static generation, no database
- **Zero local setup:** GitHub-only workflow possible
- **Sustainability:** No ongoing costs, portable
- **Interoperability:** IIIF standards ensure longevity
- **Accessibility:** Focus on storytelling, not technical barriers

---

## References

### Documentation
- IIIF Training: https://training.iiif.io/
- IIIF Cookbook: https://iiif.io/api/cookbook/
- Jekyll Documentation: https://jekyllrb.com/docs/
- Wax Documentation: https://minicomp.github.io/wiki/wax/
- CollectionBuilder Documentation: https://collectionbuilder.github.io/cb-docs/

### Tools
- Awesome IIIF List: https://github.com/IIIF/awesome-iiif
- IIIF Tools Directory: https://iiif.io/get-started/tools/
- Bodleian IIIF Tools: https://github.com/bodleian/iiif-static-choices
- OpenSeadragon: https://openseadragon.github.io/
- Universal Viewer: https://universalviewer.io/
- Mirador: https://projectmirador.org/

### Projects
- Paisajes Coloniales: http://paisajescoloniales.com
- Wax: https://minicomp.github.io/wax/
- CollectionBuilder: https://collectionbuilder.github.io/
- Exhibit.so: https://www.exhibit.so/
- KnightLab: https://knightlab.northwestern.edu/

### Communities
- IIIF Community: https://iiif.io/community/
- Minimal Computing Working Group: https://go-dh.github.io/mincomp/
- Digital Humanities Slack channels

---

## Next Steps

With research complete, implementation can begin following the phases outlined in PLAN.md:

1. Create folder structure
2. Setup Jekyll configuration
3. Build Google Sheets template
4. Implement core layouts
5. Integrate IIIF and scrollytelling
6. Create GitHub Actions workflow
7. Document and test

