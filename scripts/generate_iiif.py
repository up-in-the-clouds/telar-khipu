#!/usr/bin/env python3
"""
Generate IIIF tiles and manifests from source images

Uses iiif library (Python) to generate static IIIF Level 0 tiles.
Alternative to Bodleian tool, simpler for basic use cases.
"""

import os
import sys
import json
import shutil
from pathlib import Path

def check_dependencies():
    """Check if required dependencies are installed"""
    try:
        from iiif.static import IIIFStatic
        from PIL import Image
        return True
    except ImportError as e:
        print("❌ Missing required dependencies!")
        print("\nPlease install:")
        print("  pip install iiif Pillow")
        print("\nOr use the provided requirements file:")
        print("  pip install -r scripts/requirements.txt")
        return False

def generate_iiif_for_image(image_path, output_dir, object_id, base_url):
    """
    Generate IIIF tiles for a single image

    Args:
        image_path: Path to source image
        output_dir: Output directory for tiles (parent of object_id directory)
        object_id: Identifier for this object
        base_url: Base URL for the site
    """
    from iiif.static import IIIFStatic

    # Note: iiif library creates a subdirectory with the identifier name
    # We pass the parent directory, and it creates parent_dir/object_id/
    parent_dir = output_dir.parent

    # Create static generator
    sg = IIIFStatic(
        dst=str(parent_dir),
        prefix=f"{base_url}/iiif/objects/{object_id}/",
        tilesize=512,
        api_version='3.0'
    )

    # Generate tiles (this creates parent_dir/object_id/)
    sg.generate(src=str(image_path), identifier=object_id)

    # The actual tiles are in parent_dir/object_id/
    tiles_dir = parent_dir / object_id

    # Create manifest wrapper for UniversalViewer
    create_manifest(tiles_dir, object_id, image_path, base_url)

def create_manifest(output_dir, object_id, image_path, base_url):
    """
    Create IIIF Presentation API manifest for UniversalViewer

    Args:
        output_dir: Directory containing info.json
        object_id: Object identifier
        image_path: Original image path
        base_url: Base URL for the site
    """
    from PIL import Image

    # Read info.json to get image dimensions
    info_path = output_dir / 'info.json'
    if not info_path.exists():
        print(f"  ⚠️  info.json not found, skipping manifest creation")
        return

    with open(info_path, 'r') as f:
        info = json.load(f)

    width = info.get('width', 0)
    height = info.get('height', 0)

    # Load metadata from objects.json if available
    metadata = load_object_metadata(object_id)

    # Create IIIF Presentation v3 manifest
    manifest = {
        "@context": "http://iiif.io/api/presentation/3/context.json",
        "id": f"{base_url}/iiif/objects/{object_id}/manifest.json",
        "type": "Manifest",
        "label": {
            "en": [metadata.get('title', object_id)]
        },
        "metadata": [],
        "summary": {
            "en": [metadata.get('description', '')]
        } if metadata.get('description') else None,
        "items": [
            {
                "id": f"{base_url}/iiif/objects/{object_id}/canvas",
                "type": "Canvas",
                "label": {
                    "en": [metadata.get('title', object_id)]
                },
                "height": height,
                "width": width,
                "items": [
                    {
                        "id": f"{base_url}/iiif/objects/{object_id}/page",
                        "type": "AnnotationPage",
                        "items": [
                            {
                                "id": f"{base_url}/iiif/objects/{object_id}/annotation",
                                "type": "Annotation",
                                "motivation": "painting",
                                "body": {
                                    "id": info.get('id', f"{base_url}/iiif/objects/{object_id}/full/max/0/default.jpg"),
                                    "type": "Image",
                                    "format": "image/jpeg",
                                    "height": height,
                                    "width": width,
                                    "service": [
                                        {
                                            "id": f"{base_url}/iiif/objects/{object_id}",
                                            "type": "ImageService3",
                                            "profile": "level0"
                                        }
                                    ]
                                },
                                "target": f"{base_url}/iiif/objects/{object_id}/canvas"
                            }
                        ]
                    }
                ]
            }
        ]
    }

    # Add metadata fields
    if metadata.get('creator'):
        manifest['metadata'].append({
            "label": {"en": ["Creator"]},
            "value": {"en": [metadata['creator']]}
        })
    if metadata.get('period'):
        manifest['metadata'].append({
            "label": {"en": ["Period"]},
            "value": {"en": [metadata['period']]}
        })

    # Write manifest
    manifest_path = output_dir / 'manifest.json'
    with open(manifest_path, 'w') as f:
        json.dump(manifest, f, indent=2)

    print(f"  ✓ Created manifest.json")

def load_object_metadata(object_id):
    """Load metadata for an object from objects.json"""
    try:
        objects_json = Path('_data/objects.json')
        if objects_json.exists():
            with open(objects_json, 'r') as f:
                objects = json.load(f)
                for obj in objects:
                    if obj.get('object_id') == object_id:
                        return obj
    except Exception as e:
        print(f"  ⚠️  Could not load metadata: {e}")
    return {}

def generate_iiif_tiles(source_dir='images/objects', output_dir='iiif/objects', base_url=None):
    """
    Generate IIIF tiles for all images in source directory

    Args:
        source_dir: Directory containing source images
        output_dir: Directory to output IIIF tiles and manifests
        base_url: Base URL for the site
    """
    if not check_dependencies():
        return False

    source_path = Path(source_dir)
    output_path = Path(output_dir)

    if not source_path.exists():
        print(f"❌ Source directory {source_dir} does not exist.")
        print(f"   Please create it and add images, or use --source-dir to specify a different location.")
        return False

    # Get base URL from config or environment
    if not base_url:
        base_url = os.environ.get('SITE_URL', 'http://localhost:4000/telar')

    # Create output directory
    output_path.mkdir(parents=True, exist_ok=True)

    print("=" * 60)
    print("IIIF Tile Generator for Telar")
    print("=" * 60)
    print(f"Source: {source_dir}")
    print(f"Output: {output_dir}")
    print(f"Base URL: {base_url}")
    print("=" * 60)
    print()

    # Supported image extensions
    image_extensions = ['.jpg', '.jpeg', '.png', '.tif', '.tiff']

    # Find all images
    images = [f for f in source_path.iterdir()
              if f.is_file() and f.suffix.lower() in image_extensions]

    if not images:
        print(f"⚠️  No images found in {source_dir}")
        print(f"   Supported formats: {', '.join(image_extensions)}")
        return False

    print(f"Found {len(images)} images to process\n")

    # Process each image file
    for i, image_file in enumerate(images, 1):
        # Get object ID from filename (without extension)
        object_id = image_file.stem

        # Output directory for this object
        object_output = output_path / object_id

        print(f"[{i}/{len(images)}] Processing {image_file.name}...")
        print(f"  Object ID: {object_id}")

        try:
            # Remove existing output if present
            if object_output.exists():
                shutil.rmtree(object_output)

            object_output.mkdir(parents=True, exist_ok=True)

            # Generate IIIF tiles and manifest
            generate_iiif_for_image(image_file, object_output, object_id, base_url)

            print(f"  ✓ Generated tiles for {object_id}")
            print()

        except Exception as e:
            print(f"  ❌ Error processing {image_file.name}: {e}")
            import traceback
            traceback.print_exc()
            print()
            continue

    print("=" * 60)
    print("✓ IIIF generation complete!")
    print(f"  Generated tiles for {len(images)} objects")
    print(f"  Output directory: {output_dir}")
    print("=" * 60)
    return True

def main():
    """Main generation process"""
    import argparse

    parser = argparse.ArgumentParser(
        description='Generate IIIF tiles and manifests for Telar objects'
    )
    parser.add_argument(
        '--source-dir',
        default='images/objects',
        help='Source directory containing images (default: images/objects)'
    )
    parser.add_argument(
        '--output-dir',
        default='iiif/objects',
        help='Output directory for IIIF tiles (default: iiif/objects)'
    )
    parser.add_argument(
        '--base-url',
        help='Base URL for the site (default: from SITE_URL env or http://localhost:4000/telar)'
    )

    args = parser.parse_args()

    success = generate_iiif_tiles(
        source_dir=args.source_dir,
        output_dir=args.output_dir,
        base_url=args.base_url
    )

    sys.exit(0 if success else 1)

if __name__ == '__main__':
    main()
