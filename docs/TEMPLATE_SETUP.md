# Telar Google Sheets Template Setup Guide

> **🚧 FUTURE FEATURE - NOT YET IMPLEMENTED**
> This documentation is preserved for the **v0.3 release** when Google Sheets integration will be available.
> **For v0.2.0-beta:** Use CSV files in `components/structures/` instead. See [DOCS.md](DOCS.md) for current workflow.

---

This guide explains how to set up the Google Sheets template for your Telar exhibition in v0.3. You will have two options: **import CSV files** (faster) or **manually create** the template (more control).

## Contents

1. [Quick Start (Import Method)](#quick-start-import-method)
2. [Manual Creation Method](#manual-creation-method)
3. [Publishing Your Sheet](#publishing-your-sheet)
4. [Getting GID Values](#getting-gid-values)
5. [Validation Checklist](#validation-checklist)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start (Import Method)

Use this method if you want to quickly set up the template using pre-configured CSV files.

### Step 1: Create New Google Sheet

1. Go to [Google Sheets](https://sheets.google.com)
2. Click **Blank** to create a new spreadsheet
3. Name it: `Telar Exhibition - [Your Project Name]`

### Step 2: Import CSV Files

Import each CSV file from the `google_sheet_template/` directory:

#### Tab 1: Instructions

1. Right-click on "Sheet1" tab → **Rename** → `Instructions`
2. **File → Import** → Upload tab
3. Select `google_sheet_template/01-instructions.csv`
4. Import location: **Replace current sheet**
5. Separator type: **Detect automatically**
6. Click **Import data**

#### Tab 2: Project Setup

1. Click **+** to add a new sheet
2. Rename it to: `Project Setup`
3. **File → Import** → Upload tab
4. Select `google_sheet_template/02-project-setup.csv`
5. Import location: **Replace current sheet**
6. Separator type: **Detect automatically**
7. Click **Import data**

#### Tab 3: Objects

1. Click **+** to add a new sheet
2. Rename it to: `Objects`
3. **File → Import** → Upload tab
4. Select `google_sheet_template/03-objects.csv`
5. Import location: **Replace current sheet**
6. Click **Import data**

#### Tab 4: Glossary

1. Click **+** to add a new sheet
2. Rename it to: `Glossary`
3. **File → Import** → Upload tab
4. Select `google_sheet_template/04-glossary.csv`
5. Import location: **Replace current sheet**
6. Click **Import data**

#### Tab 5: Story 1

1. Click **+** to add a new sheet
2. Rename it to: `Story 1`
3. **File → Import** → Upload tab
4. Select `google_sheet_template/05-story-1.csv`
5. Import location: **Replace current sheet**
6. Click **Import data**

### Step 3: Add More Stories (Optional)

For each additional story:

1. Right-click on "Story 1" tab → **Duplicate**
2. Rename to: `Story 2`, `Story 3`, etc.
3. Replace the example data with your content
4. Update the **Project Setup** tab to list your stories

### Step 4: Customize Content

The template includes placeholder data. Now you need to add your own content:

1. Update project settings in **Project Setup** tab
   - Change project_title, tagline, author, etc.
   - Update the stories list
2. Add your objects to **Objects** tab
   - One row per object with unique object_id
   - Add high-res images to `components/images/objects/` with filename matching object_id
3. Add your glossary terms to **Glossary** tab (optional)
   - One row per term with unique term_id
4. Fill in story steps for each story
   - Reference object_id from Objects tab
   - Use coordinate tool on object pages to find x, y, zoom values
   - Reference layer markdown files (see next step)
5. Create layer content files
   - Add markdown files to `components/texts/stories/` directory
   - Organize by story (e.g., `story1/step1-layer1.md`, `story1/step1-layer2.md`)
   - Use full markdown formatting in these files

---

## Manual Creation Method

Use this method if you prefer to build the template yourself with full control.

### Tab 1: Instructions

1. Create a new Google Sheet
2. Rename "Sheet1" to `Instructions`
3. Import `google_sheet_template/01-instructions.csv` or copy its content
4. This tab provides reference documentation for users

### Tab 2: Project Setup

1. Add new sheet, name it `Project Setup`
2. In Row 1, enter headers: `key`, `value`, `example` (optional)
3. Fill in site settings (rows 2-10):
   - project_title, tagline, author, email
   - primary_color, secondary_color
   - font_headings, font_body, logo
4. Leave row 11 blank
5. In row 12: `STORIES` in column A, leave columns B and C blank, add "example" as column C header
6. In rows 13+: Story numbers in column A, titles in column B, example titles from Colonial Landscapes in column C (optional)

**Example:**
```
key           | value                        | example
project_title | Your Exhibition Title        |
tagline       | Brief description            |
...           |                              |
              |                              |
STORIES      |                              | example
1             | Story 1                    | A painting of the savannah
2             | Story 2                    | Villages for the "indios"
```

**Note:** The `example` column shows real data from the Colonial Landscapes project for reference. You can delete this column when ready.

### Tab 3: Objects

1. Add new sheet, name it `Objects`
2. In Row 1, enter headers (columns A-L):
   - object_id, title, description, creator, date
   - medium, dimensions, location, credit
   - thumbnail, iiif_manifest, example
3. Fill in one row per object (starting row 2)
4. The template includes placeholder objects and example objects from Colonial Landscapes (marked with "example" in the last column)

**Required**: object_id, title, description
**Optional**: All other columns including example column

### Tab 4: Glossary

1. Add new sheet, name it `Glossary`
2. In Row 1, enter headers (columns A-G):
   - term_id, title, short_definition
   - definition, image, related_terms, example
3. Fill in one row per term (starting row 2)
4. The template includes placeholder terms and example terms from Colonial Landscapes (marked with "example" in the last column)

**Required**: term_id, title, short_definition
**Optional**: definition, image, related_terms, example column

### Tab 5+: Story Tabs

For each story:

1. Add new sheet, name it `Story 1`, `Story 2`, etc.
2. In Row 1, enter headers (columns A-K):
   - step, question, answer, object, x, y, zoom
   - layer1_button, layer1_file
   - layer2_button, layer2_file
3. Fill in one row per story step (starting row 2)
4. Create markdown files in `components/texts/stories/` for layer content (e.g., `story1/step1-layer1.md`)

**Required**: step, question, answer, object, x, y, zoom
**Optional**: layer1_button, layer1_file, layer2_button, layer2_file

**Notes:**
- Layer content is stored in separate markdown files, not directly in the CSV
- Button columns can be left empty for default text ("Learn more", "Go deeper") or filled with custom text
- Use the coordinate identification tool on object pages to find precise x, y, zoom values

---

## Publishing Your Sheet

Once your template is complete:

### Step 1: Publish to Web

1. **File → Share → Publish to web**
2. **Link** tab:
   - Entire document
   - Comma-separated values (.csv)
3. Check: **Automatically republish when changes are made**
4. Click **Publish**
5. Copy the published URL (it will look like: `https://docs.google.com/spreadsheets/d/e/...`)

### Step 2: Add to GitHub

1. Go to your Telar repository on GitHub
2. **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Name: `GOOGLE_SHEETS_URL`
5. Value: Paste the published URL
6. Click **Add secret**

---

## Getting GID Values

Each tab has a unique GID number needed for GitHub Actions to fetch the correct data.

### Finding GIDs:

1. Click on each tab in your Google Sheet
2. Look at the URL in your browser
3. Find the GID number: `#gid=1234567890`
4. Note the GID for each tab

**Example:**
```
Instructions tab:   #gid=0
Project Setup tab:  #gid=123456789
Objects tab:        #gid=234567890
Glossary tab:       #gid=345678901
Story 1 tab:      #gid=456789012
```

### Updating GitHub Actions:

1. In your repository, open `.github/workflows/build.yml`
2. Find the "Fetch data from Google Sheets" section
3. Update the GID values in the curl commands:

```yaml
# Fetch Project Setup (tab 2)
curl -L "${GOOGLE_SHEETS_URL}&gid=123456789&output=csv" -o _data/project.csv

# Fetch Objects (tab 3)
curl -L "${GOOGLE_SHEETS_URL}&gid=234567890&output=csv" -o _data/objects.csv

# Fetch Glossary (tab 4)
curl -L "${GOOGLE_SHEETS_URL}&gid=345678901&output=csv" -o _data/glossary.csv

# Fetch Story 1 (tab 5)
curl -L "${GOOGLE_SHEETS_URL}&gid=456789012&output=csv" -o _data/story-1.csv
```

4. Save and commit the changes

---

## Validation Checklist

Before using your template, verify:

### Structure
- [ ] Instructions tab exists and contains reference content
- [ ] Project Setup tab has site settings AND stories list
- [ ] Objects tab has all required columns
- [ ] Glossary tab has all required columns
- [ ] At least one Story tab exists

### Data Format
- [ ] Column headers match exactly (case-sensitive)
- [ ] No empty rows between data rows
- [ ] Object IDs are consistent across Objects and Story tabs
- [ ] Term IDs are consistent across Glossary and usage
- [ ] Coordinates (x, y) are decimal numbers between 0 and 1
- [ ] Zoom values are positive numbers (typically 1-4)
- [ ] File paths start with `/`
- [ ] External IIIF URLs are complete info.json URLs

### Publishing
- [ ] Sheet published to web as CSV
- [ ] Auto-republish enabled
- [ ] Published URL copied
- [ ] URL added to GitHub repository secrets
- [ ] GID values updated in build.yml

### Content
- [ ] Project title and settings filled in
- [ ] Stories listed in Project Setup
- [ ] At least one object defined
- [ ] Object IDs referenced in stories exist in Objects tab
- [ ] All image paths are correct
- [ ] Glossary terms are properly formatted

---

## Troubleshooting

### Import Errors

**Problem**: "Import failed" or garbled characters
**Solution**: Ensure CSV files are UTF-8 encoded. Try import location "Insert new sheet(s)" instead of "Replace current sheet"

**Problem**: Columns don't align properly
**Solution**: Check that separator type is set to "Detect automatically" or "Comma"

### Publishing Issues

**Problem**: Can't find "Publish to web"
**Solution**: You need edit access to the sheet. If using a shared template, make a copy first (File → Make a copy)

**Problem**: GitHub Actions can't fetch data
**Solution**:
- Verify sheet is published (not just shared)
- Check "Automatically republish" is enabled
- Ensure URL in repository secrets is the published URL (starts with docs.google.com/spreadsheets/d/e/)

### Data Issues

**Problem**: Objects not appearing in story viewer
**Solution**: Check that object_id in Story tab exactly matches object_id in Objects tab (case-sensitive)

**Problem**: Coordinates not working
**Solution**: Ensure x and y are decimal numbers (0.5) not percentages (50%) or integers (1)

**Problem**: Glossary terms not linking
**Solution**: Verify term_id format matches exactly between Glossary tab and usage in story text

### GID Issues

**Problem**: GitHub Actions fetching wrong data
**Solution**: Double-check GID numbers - they change if you reorder tabs. Get fresh GIDs by clicking each tab.

**Problem**: Tab not being fetched
**Solution**: Ensure you added a fetch command for that tab's GID in build.yml

---

## Next Steps

After setting up your template:

1. **Test locally** (optional):
   ```bash
   bundle install
   bundle exec jekyll serve
   ```

2. **Commit and push** to trigger GitHub Actions build

3. **Check build status** in repository Actions tab

4. **View your site** at: `https://[username].github.io/[repository]/`

5. **Iterate**: Edit Google Sheet → GitHub Actions rebuilds automatically

---

## Additional Resources

- **Full Documentation**: `/DOCS.md` in repository
- **Template Specification**: `/GOOGLE_SHEETS_TEMPLATE.md`
- **GitHub Issues**: https://github.com/UCSB-AMPLab/telar/issues
- **Example Files**: See `_stories/`, `_objects/`, `_glossary/` in repository

---

**You're ready to create your exhibition!** Choose your method and start building.
