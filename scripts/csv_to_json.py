#!/usr/bin/env python3
"""
Convert CSV files from Google Sheets to JSON for Jekyll
"""

import pandas as pd
import json
import os
from pathlib import Path

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
        # Read CSV with lenient error handling for inconsistent column counts
        df = pd.read_csv(csv_path, on_bad_lines='warn')

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
    chapters_list = []

    in_chapters_section = False

    for _, row in df.iterrows():
        key = str(row.get('key', '')).strip()
        value = row.get('value', '')

        if key == 'CHAPTERS':
            in_chapters_section = True
            continue

        if in_chapters_section:
            # Parse chapter entries
            if pd.notna(value):
                chapters_list.append({
                    'number': key,
                    'title': value
                })
        else:
            # Regular project settings
            if key and pd.notna(value):
                project_dict[key] = value

    # Return combined structure
    result = {**project_dict, 'chapters': chapters_list}
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
    Process glossary CSV
    Expected columns: term_id, title, short_definition, etc.
    """
    # Drop example column if it exists
    if 'example' in df.columns:
        df = df.drop(columns=['example'])

    # Clean up NaN values
    df = df.fillna('')

    # Remove rows where term_id is empty
    df = df[df['term_id'].astype(str).str.strip() != '']

    return df

def process_chapter(df):
    """
    Process chapter CSV
    Expected columns: step, question, answer, object, x, y, zoom, layer1_title, etc.
    """
    # Drop example column if it exists
    if 'example' in df.columns:
        df = df.drop(columns=['example'])

    # Clean up NaN values
    df = df.fillna('')

    # Remove completely empty rows
    df = df[df.astype(str).apply(lambda x: x.str.strip()).ne('').any(axis=1)]

    return df

def main():
    """Main conversion process"""
    data_dir = Path('_data')
    data_dir.mkdir(exist_ok=True)

    print("Converting CSV files to JSON...")
    print("-" * 50)

    # Convert project setup
    csv_to_json(
        '_data/project.csv',
        '_data/project.json',
        process_project_setup
    )

    # Convert objects
    csv_to_json(
        '_data/objects.csv',
        '_data/objects.json',
        process_objects
    )

    # Convert glossary
    csv_to_json(
        '_data/glossary.csv',
        '_data/glossary.json',
        process_glossary
    )

    # Convert chapter files
    # Look for any CSV files that start with "chapter-"
    for csv_file in data_dir.glob('chapter-*.csv'):
        json_file = csv_file.with_suffix('.json')
        csv_to_json(
            str(csv_file),
            str(json_file),
            process_chapter
        )

    print("-" * 50)
    print("Conversion complete!")

if __name__ == '__main__':
    main()
