#!/usr/bin/env python3
"""
Generate IIIF tiles and manifests from source images using iiif-static-choices
"""

import os
import subprocess
import json
from pathlib import Path

def generate_iiif_tiles(source_dir='source_images', output_dir='iiif/objects'):
    """
    Generate IIIF tiles for all images in source directory

    Args:
        source_dir: Directory containing source images
        output_dir: Directory to output IIIF tiles and manifests
    """
    source_path = Path(source_dir)
    output_path = Path(output_dir)

    if not source_path.exists():
        print(f"Source directory {source_dir} does not exist. Skipping IIIF generation.")
        return

    # Create output directory
    output_path.mkdir(parents=True, exist_ok=True)

    print("Generating IIIF tiles...")
    print("-" * 50)

    # Supported image extensions
    image_extensions = ['.jpg', '.jpeg', '.png', '.tif', '.tiff']

    # Process each image file
    for image_file in source_path.iterdir():
        if image_file.suffix.lower() not in image_extensions:
            continue

        # Get object ID from filename (without extension)
        object_id = image_file.stem

        # Output directory for this object
        object_output = output_path / object_id
        object_output.mkdir(parents=True, exist_ok=True)

        print(f"Processing {image_file.name}...")

        try:
            # Run iiif-static-choices
            # Using iiif_static.py from the package
            cmd = [
                'iiif_static.py',
                '-d', str(object_output),
                '-i', object_id,
                '-p', 'http://example.org/iiif',  # Will be replaced with actual domain
                str(image_file)
            ]

            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                check=True
            )

            print(f"  ✓ Generated tiles for {object_id}")

        except subprocess.CalledProcessError as e:
            print(f"  ✗ Error processing {image_file.name}: {e}")
            print(f"    stdout: {e.stdout}")
            print(f"    stderr: {e.stderr}")
        except FileNotFoundError:
            print(f"  ✗ iiif_static.py not found. Make sure iiif-static-choices is installed.")
            print(f"    Install with: pip install iiif-static-choices")
            break

    print("-" * 50)
    print("IIIF generation complete!")

    # Generate summary
    object_count = len(list(output_path.iterdir()))
    print(f"Generated IIIF tiles for {object_count} objects")

def update_info_json_urls(output_dir='iiif/objects', base_url=None):
    """
    Update info.json files with correct base URL

    Args:
        output_dir: Directory containing IIIF objects
        base_url: Base URL for the site (from environment or config)
    """
    if not base_url:
        # Try to get from environment or use placeholder
        base_url = os.environ.get('SITE_URL', 'https://example.github.io/repository')

    output_path = Path(output_dir)

    if not output_path.exists():
        return

    print(f"Updating info.json URLs to {base_url}...")

    for object_dir in output_path.iterdir():
        if not object_dir.is_dir():
            continue

        info_json = object_dir / 'info.json'

        if not info_json.exists():
            continue

        try:
            # Read info.json
            with open(info_json, 'r') as f:
                info = json.load(f)

            # Update @id field
            object_id = object_dir.name
            info['@id'] = f"{base_url}/iiif/objects/{object_id}"

            # Write back
            with open(info_json, 'w') as f:
                json.dump(info, f, indent=2)

        except Exception as e:
            print(f"  ✗ Error updating {info_json}: {e}")

def main():
    """Main generation process"""
    generate_iiif_tiles()
    # update_info_json_urls()  # Uncomment when base URL is configured

if __name__ == '__main__':
    main()
