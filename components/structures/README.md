# Structures

This folder contains CSV files that define the organizational structure of your Telar site.

## Purpose

These CSV files are **source data** that you edit directly. They are human-readable and can be managed in spreadsheet applications like Excel or Google Sheets.

## Files

- **project.csv** - Site-wide settings and configuration
- **objects.csv** - Catalog of IIIF objects (maps, documents, artifacts)
- **story-N.csv** / **chapter-N.csv** - Story structure data with step-by-step navigation - replace "N" with the appropriate number.

## Workflow

1. **Edit** - Modify these CSV files to update your site structure
2. **Convert** - Run `python3 scripts/csv_to_json.py` to generate JSON files (this happens automatically on GitHub)
3. **Build** - Run `bundle exec jekyll build` to generate the site (this happens automatically on GitHub)

The CSV-to-JSON script reads markdown content from `components/texts/` and embeds it into the generated JSON files in `_data/`.

## Story CSV Structure

Each story CSV contains:
- `step` - Step number
- `question` - Step heading
- `answer` - Brief answer text
- `object` - Object ID to display
- `x, y, zoom` - IIIF viewer coordinates (0-1 normalized)
- `layer1_button, layer1_file` - Primary panel button text and markdown file
- `layer2_button, layer2_file` - Secondary panel button text and markdown file

Markdown files referenced in `layer1_file` and `layer2_file` should be stored in `components/texts/stories/`.

## Why Structures?

This folder is called "structures" because it contains the structural/organizational data that defines how your content is assembled into a cohesive narrative experience.
