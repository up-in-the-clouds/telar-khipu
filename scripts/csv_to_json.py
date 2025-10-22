#!/usr/bin/env python3
"""
Convert CSV files from Google Sheets to JSON for Jekyll
"""

import pandas as pd
import json
import os
import re
from pathlib import Path
import markdown

def read_markdown_file(file_path):
    """
    Read a markdown file and parse frontmatter

    Args:
        file_path: Path to markdown file relative to components/texts/

    Returns:
        dict with 'title' and 'content' keys, or None if file doesn't exist
    """
    full_path = Path('components/texts') / file_path

    if not full_path.exists():
        print(f"Warning: Markdown file not found: {full_path}")
        return None

    try:
        with open(full_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Parse frontmatter
        frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n(.*)$'
        match = re.match(frontmatter_pattern, content, re.DOTALL)

        if match:
            frontmatter_text = match.group(1)
            body = match.group(2).strip()

            # Extract title from frontmatter
            title_match = re.search(r'title:\s*["\']?(.*?)["\']?\s*$', frontmatter_text, re.MULTILINE)
            title = title_match.group(1) if title_match else ''

            # Convert markdown to HTML
            html_content = markdown.markdown(body, extensions=['extra', 'nl2br'])

            return {
                'title': title,
                'content': html_content
            }
        else:
            # No frontmatter, just content
            html_content = markdown.markdown(content.strip(), extensions=['extra', 'nl2br'])
            return {
                'title': '',
                'content': html_content
            }

    except Exception as e:
        print(f"Error reading markdown file {full_path}: {e}")
        return None

def csv_to_json(csv_path, json_path, process_func=None):
    """
    Convert CSV file to JSON

    Args:
        csv_path: Path to input CSV file
        json_path: Path to output JSON file
        process_func: Optional function to process the dataframe before conversion
    """
    if not os.path.exists(csv_path):
        print(f"Warning: {csv_path} not found. Skipping.")
        return

    try:
        # Read CSV file and filter out comment lines (starting with #)
        # We can't use pandas' comment parameter because it treats # anywhere as a comment,
        # which breaks hex color codes like #2c3e50
        with open(csv_path, 'r', encoding='utf-8') as f:
            lines = [line for line in f if not line.strip().startswith('#')]

        # Parse filtered CSV content
        from io import StringIO
        csv_content = ''.join(lines)
        df = pd.read_csv(StringIO(csv_content), on_bad_lines='warn')

        # Apply processing function if provided
        if process_func:
            df = process_func(df)

        # Convert to JSON
        data = df.to_dict('records')

        # Write JSON file
        with open(json_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        print(f"✓ Converted {csv_path} to {json_path}")

    except Exception as e:
        print(f"Error converting {csv_path}: {e}")

def process_project_setup(df):
    """
    Process project setup CSV
    Expected columns: key, value, example (optional)
    """
    # Drop example column if it exists
    if 'example' in df.columns:
        df = df.drop(columns=['example'])

    # Convert key-value pairs to dictionary
    project_dict = {}
    stories_list = []

    in_stories_section = False

    for _, row in df.iterrows():
        key = str(row.get('key', '')).strip()
        value = row.get('value', '')

        if key == 'STORIES':
            in_stories_section = True
            continue

        if in_stories_section:
            # Parse story entries
            if pd.notna(value):
                stories_list.append({
                    'number': key,
                    'title': value
                })
        else:
            # Regular project settings
            if key and pd.notna(value):
                project_dict[key] = value

    # Return combined structure
    result = {**project_dict, 'stories': stories_list}
    return pd.DataFrame([result])

def process_objects(df):
    """
    Process objects CSV
    Expected columns: object_id, title, creator, date, description, etc.
    """
    # Drop example column if it exists
    if 'example' in df.columns:
        df = df.drop(columns=['example'])

    # Clean up NaN values
    df = df.fillna('')

    # Remove rows where object_id is empty
    df = df[df['object_id'].astype(str).str.strip() != '']

    return df

def process_glossary(df):
    """
    Process glossary CSV with file references
    Expected columns: term_id, title, short_definition, definition_file, etc.
    """
    # Drop example column if it exists
    if 'example' in df.columns:
        df = df.drop(columns=['example'])

    # Clean up NaN values
    df = df.fillna('')

    # Remove rows where term_id is empty
    df = df[df['term_id'].astype(str).str.strip() != '']

    # Process definition_file column
    if 'definition_file' in df.columns:
        for idx, row in df.iterrows():
            file_ref = row['definition_file']
            if file_ref and file_ref.strip():
                # For glossary, files are directly in glossary/ folder
                file_path = f"glossary/{file_ref.strip()}"
                markdown_data = read_markdown_file(file_path)
                if markdown_data:
                    # Store the full definition text
                    df.at[idx, 'definition'] = markdown_data['content']
                else:
                    df.at[idx, 'definition'] = ''

    return df

def process_story(df):
    """
    Process story CSV with file references
    Expected columns: step, question, answer, object, x, y, zoom, layer1_file, layer2_file, etc.
    """
    # Drop example column if it exists
    if 'example' in df.columns:
        df = df.drop(columns=['example'])

    # Clean up NaN values
    df = df.fillna('')

    # Remove completely empty rows
    df = df[df.astype(str).apply(lambda x: x.str.strip()).ne('').any(axis=1)]

    # Process file reference columns
    for col in df.columns:
        if col.endswith('_file'):
            # Determine the base name (e.g., 'layer1' from 'layer1_file')
            base_name = col.replace('_file', '')

            # Create new columns for title and text
            title_col = f'{base_name}_title'
            text_col = f'{base_name}_text'

            # Initialize new columns with empty strings
            if title_col not in df.columns:
                df[title_col] = ''
            if text_col not in df.columns:
                df[text_col] = ''

            # Read markdown files and populate columns
            for idx, row in df.iterrows():
                file_ref = row[col]
                if file_ref and file_ref.strip():
                    # Prepend 'stories/' to the path for story files
                    file_path = f"stories/{file_ref.strip()}"
                    markdown_data = read_markdown_file(file_path)
                    if markdown_data:
                        df.at[idx, title_col] = markdown_data['title']
                        df.at[idx, text_col] = markdown_data['content']
                    else:
                        df.at[idx, title_col] = ''
                        df.at[idx, text_col] = ''

            # Drop the _file column as it's no longer needed in JSON
            df = df.drop(columns=[col])

    # Set default coordinates for empty values
    coordinate_columns = ['x', 'y', 'zoom']
    for col in coordinate_columns:
        if col in df.columns:
            # Convert to string first to handle NaN values
            df[col] = df[col].astype(str)
            # Set defaults for empty or 'nan' values
            if col == 'x':
                df.loc[df[col].isin(['', 'nan']), col] = '0.5'
            elif col == 'y':
                df.loc[df[col].isin(['', 'nan']), col] = '0.5'
            elif col == 'zoom':
                df.loc[df[col].isin(['', 'nan']), col] = '1'

    return df

def main():
    """Main conversion process"""
    data_dir = Path('_data')
    data_dir.mkdir(exist_ok=True)

    structures_dir = Path('components/structures')

    print("Converting CSV files to JSON...")
    print("-" * 50)

    # Convert project setup
    csv_to_json(
        'components/structures/project.csv',
        '_data/project.json',
        process_project_setup
    )

    # Convert objects
    csv_to_json(
        'components/structures/objects.csv',
        '_data/objects.json',
        process_objects
    )

    # Note: Glossary is now sourced directly from components/texts/glossary/
    # and processed by generate_collections.py

    # Convert story files
    # Look for any CSV files that start with "story-" or "chapter-"
    for csv_file in structures_dir.glob('story-*.csv'):
        json_filename = csv_file.stem + '.json'
        json_file = data_dir / json_filename
        csv_to_json(
            str(csv_file),
            str(json_file),
            process_story
        )

    for csv_file in structures_dir.glob('chapter-*.csv'):
        json_filename = csv_file.stem + '.json'
        json_file = data_dir / json_filename
        csv_to_json(
            str(csv_file),
            str(json_file),
            process_story
        )

    print("-" * 50)
    print("Conversion complete!")

if __name__ == '__main__':
    main()
