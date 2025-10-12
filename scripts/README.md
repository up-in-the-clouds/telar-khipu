# Telar Scripts

Python scripts for processing data and generating IIIF tiles.

## Installation

Install Python dependencies:

```bash
pip install -r scripts/requirements.txt
```

Or install individually:

```bash
pip install iiif Pillow
```

## IIIF Tile Generation

Generate IIIF tiles and manifests for local images.

### Basic Usage

1. Add images to `images/objects/` directory:
   ```
   images/objects/
   ├── painting-1.jpg
   ├── manuscript-2.tif
   └── map-3.png
   ```

2. Run the generator:
   ```bash
   python scripts/generate_iiif.py
   ```

3. Tiles are created in `iiif/objects/`:
   ```
   iiif/objects/
   ├── painting-1/
   │   ├── info.json
   │   ├── manifest.json
   │   └── [tile directories]
   ├── manuscript-2/
   │   ├── info.json
   │   ├── manifest.json
   │   └── [tile directories]
   └── map-3/
       ├── info.json
       ├── manifest.json
       └── [tile directories]
   ```

### Options

```bash
python scripts/generate_iiif.py --help
```

**Custom source directory:**
```bash
python scripts/generate_iiif.py --source-dir path/to/images
```

**Custom output directory:**
```bash
python scripts/generate_iiif.py --output-dir path/to/output
```

**Specify base URL:**
```bash
python scripts/generate_iiif.py --base-url https://mysite.github.io/project
```

### How It Works

1. **Tile Generation**: Creates IIIF Image API Level 0 tiles
   - 512x512 pixel tiles
   - Multiple zoom levels
   - Outputs `info.json` with image metadata

2. **Manifest Creation**: Wraps tiles in IIIF Presentation API v3 manifest
   - Adds metadata from `_data/objects.json`
   - Compatible with UniversalViewer
   - Outputs `manifest.json`

3. **Object Linking**: Reference in your CSV/JSON:
   ```csv
   object_id,title,...,iiif_manifest
   painting-1,"My Painting",,  # Empty = use local tiles
   ```

### Supported Formats

- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- TIFF (`.tif`, `.tiff`)

### Notes

- Object ID is derived from filename (without extension)
- Existing tiles are regenerated (deleted and recreated)
- Large images may take several minutes to process
- Default base URL is `http://localhost:4000/telar` (for local testing)

## Other Scripts

### generate_collections.py

Generates Jekyll collection markdown files from JSON data.

```bash
python scripts/generate_collections.py
```

### csv_to_json.py

Converts CSV data files to JSON format.

```bash
python scripts/csv_to_json.py
```

## GitHub Actions Integration

For automated IIIF generation on push:

1. Set `SITE_URL` environment variable in GitHub Actions
2. Add IIIF generation step before Jekyll build
3. Commit generated tiles to repository

Example workflow step:
```yaml
- name: Generate IIIF tiles
  run: |
    pip install -r scripts/requirements.txt
    python scripts/generate_iiif.py --base-url ${{ env.SITE_URL }}
```
