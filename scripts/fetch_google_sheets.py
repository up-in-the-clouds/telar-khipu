#!/usr/bin/env python3
"""
Fetch Google Sheets data and save as CSVs

Reads Google Sheets URLs from _config.yml, discovers tab GIDs,
and fetches all data as CSV files to components/structures/

Usage:
    python3 scripts/fetch_google_sheets.py
"""

import sys
import os
import re
import yaml
import urllib.request
import urllib.error
import ssl
from pathlib import Path

# Import the discover script functions
sys.path.insert(0, str(Path(__file__).parent))
from discover_sheet_gids import extract_sheet_id, discover_gids_from_published, test_gid

def read_config():
    """Read Google Sheets URLs from _config.yml"""
    config_path = Path('_config.yml')

    if not config_path.exists():
        print("ERROR: _config.yml not found. Run this script from the repository root.", file=sys.stderr)
        sys.exit(1)

    with open(config_path, 'r') as f:
        config = yaml.safe_load(f)

    if 'google_sheets' not in config:
        print("ERROR: google_sheets section not found in _config.yml", file=sys.stderr)
        sys.exit(1)

    gs_config = config['google_sheets']

    if not gs_config.get('enabled'):
        print("Google Sheets integration is disabled in _config.yml")
        print("Set 'google_sheets.enabled: true' to enable")
        sys.exit(0)

    shared_url = gs_config.get('shared_url', '').strip()
    published_url = gs_config.get('published_url', '').strip()

    if not shared_url or not published_url:
        print("ERROR: Both shared_url and published_url must be set in _config.yml", file=sys.stderr)
        sys.exit(1)

    return shared_url, published_url

def fetch_csv(sheet_id, gid, output_path):
    """Fetch CSV from Google Sheets and save to file"""
    url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?gid={gid}&format=csv'

    try:
        ssl_context = ssl.create_default_context()
        ssl_context.check_hostname = False
        ssl_context.verify_mode = ssl.CERT_NONE

        req = urllib.request.Request(url)
        with urllib.request.urlopen(req, timeout=10, context=ssl_context) as response:
            data = response.read().decode('utf-8')

            # Check if we got HTML error instead of CSV
            if data.startswith('<!DOCTYPE') or data.startswith('<html'):
                return False

            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(data)

            return True

    except Exception as e:
        print(f"ERROR: Failed to fetch {output_path}: {e}", file=sys.stderr)
        return False

def main():
    print("=" * 70)
    print("Fetching Google Sheets Data")
    print("=" * 70)
    print()

    # Read config
    print("Reading configuration from _config.yml...")
    shared_url, published_url = read_config()
    print("✓ Google Sheets integration enabled")
    print()

    # Extract Sheet ID
    sheet_id = extract_sheet_id(shared_url)
    if not sheet_id:
        print("ERROR: Could not extract Sheet ID from shared_url", file=sys.stderr)
        print(f"URL: {shared_url}", file=sys.stderr)
        sys.exit(1)

    print(f"✓ Sheet ID: {sheet_id}")
    print()

    # Discover tabs
    print("Discovering tabs from published sheet...")
    tabs = discover_gids_from_published(published_url)

    if not tabs:
        print("ERROR: Could not discover tabs from published_url", file=sys.stderr)
        print(f"URL: {published_url}", file=sys.stderr)
        sys.exit(1)

    print(f"✓ Found {len(tabs)} tab(s)")
    print()

    # Create output directory
    output_dir = Path('components/structures')
    output_dir.mkdir(parents=True, exist_ok=True)

    # Fetch each tab
    print("Fetching CSVs...")
    print("-" * 70)

    # Skip tabs that shouldn't be fetched
    skip_tabs = ['instructions', 'readme', 'help', 'info']

    success_count = 0
    for tab_name, gid in tabs:
        tab_lower = tab_name.lower()

        # Skip instruction/help tabs
        if tab_lower in skip_tabs:
            print(f"⊘ {tab_name:20s} → Skipped (instruction tab)")
            continue

        # Determine output filename based on tab name
        if tab_lower == 'project':
            filename = 'project.csv'
        elif tab_lower == 'objects':
            filename = 'objects.csv'
        elif re.match(r'story-\d+', tab_lower):
            # Dynamic story matching: story-1, story-2, story-3, etc.
            filename = f'{tab_lower}.csv'
        else:
            # Unknown tab - skip it
            print(f"⊘ {tab_name:20s} → Skipped (unknown tab type)")
            continue

        output_path = output_dir / filename

        # Fetch and save
        if fetch_csv(sheet_id, gid, output_path):
            print(f"✓ {tab_name:20s} → {output_path}")
            success_count += 1
        else:
            print(f"✗ {tab_name:20s} → Failed")

    print("-" * 70)
    print(f"✓ Fetched {success_count}/{len(tabs)} CSV files")
    print()

    if success_count == 0:
        print("ERROR: No CSV files were successfully fetched", file=sys.stderr)
        sys.exit(1)

    print("Next steps:")
    print("  1. Run: python3 scripts/csv_to_json.py")
    print("  2. Run: python3 scripts/generate_collections.py")
    print("  3. Build your site: bundle exec jekyll build")
    print()

if __name__ == '__main__':
    main()
