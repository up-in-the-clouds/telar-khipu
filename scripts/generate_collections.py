#!/usr/bin/env python3
"""
Generate Jekyll collection markdown files from JSON data
"""

import json
from pathlib import Path

def generate_objects():
    """Generate object markdown files from objects.json"""
    with open('_data/objects.json', 'r') as f:
        objects = json.load(f)

    objects_dir = Path('_objects')
    objects_dir.mkdir(exist_ok=True)

    for obj in objects:
        object_id = obj.get('object_id', '')
        if not object_id:
            continue

        filepath = objects_dir / f"{object_id}.md"

        content = f"""---
object_id: {obj.get('object_id', '')}
title: "{obj.get('title', '')}"
creator: "{obj.get('creator', '')}"
period: "{obj.get('period', '')}"
medium: "{obj.get('medium', '')}"
dimensions: "{obj.get('dimensions', '')}"
location: "{obj.get('location', '')}"
credit: "{obj.get('credit', '')}"
thumbnail: {obj.get('thumbnail', '')}
iiif_manifest: {obj.get('iiif_manifest', '')}
layout: object
---

{obj.get('description', '')}
"""

        with open(filepath, 'w') as f:
            f.write(content)

        print(f"✓ Generated {filepath}")

def generate_glossary():
    """Generate glossary markdown files from glossary.json"""
    with open('_data/glossary.json', 'r') as f:
        terms = json.load(f)

    glossary_dir = Path('_glossary')
    glossary_dir.mkdir(exist_ok=True)

    for term in terms:
        term_id = term.get('term_id', '')
        if not term_id:
            continue

        filepath = glossary_dir / f"{term_id}.md"

        # Parse related terms
        related = term.get('related_terms', '')

        content = f"""---
term_id: {term.get('term_id', '')}
title: "{term.get('title', '')}"
short_definition: "{term.get('short_definition', '')}"
image: {term.get('image', '')}
related_terms: {related}
layout: glossary
---

{term.get('definition', '')}
"""

        with open(filepath, 'w') as f:
            f.write(content)

        print(f"✓ Generated {filepath}")

def generate_stories():
    """Generate story markdown files based on project.json stories list"""

    # Parse project.csv directly to get stories
    stories = []
    with open('_data/project.csv', 'r') as f:
        in_stories = False
        for line in f:
            if 'STORIES' in line:
                in_stories = True
                continue
            if in_stories:
                parts = line.strip().split(',')
                if len(parts) >= 2 and parts[0].strip():
                    story_num = parts[0].strip()
                    story_title = parts[1].strip().strip('"')
                    stories.append({
                        'number': story_num,
                        'title': story_title
                    })

    stories_dir = Path('_stories')
    stories_dir.mkdir(exist_ok=True)

    for story in stories:
        story_num = story['number']
        story_title = story['title']

        # Check if story data file exists
        data_file = Path(f'_data/story-{story_num}.json')
        if not data_file.exists():
            print(f"Warning: No data file found for Story {story_num}")
            continue

        filepath = stories_dir / f"story-{story_num}.md"

        content = f"""---
story_number: {story_num}
title: "{story_title}"
layout: story
data_file: story-{story_num}
---

"""

        with open(filepath, 'w') as f:
            f.write(content)

        print(f"✓ Generated {filepath}")

def main():
    """Generate all collection files"""
    print("Generating Jekyll collection files...")
    print("-" * 50)

    generate_objects()
    print()

    generate_glossary()
    print()

    generate_stories()

    print("-" * 50)
    print("Generation complete!")

if __name__ == '__main__':
    main()
