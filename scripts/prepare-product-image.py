"""Normaliza fotografías de productos al formato usado por el catálogo."""

from argparse import ArgumentParser
from pathlib import Path

from PIL import Image, ImageOps

TARGET_SIZE = (1200, 675)


def main():
    parser = ArgumentParser(description="Genera una imagen WebP de 1200 × 675 para el catálogo.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--focus-x", type=float, default=0.5)
    parser.add_argument("--focus-y", type=float, default=0.5)
    args = parser.parse_args()

    if not 0 <= args.focus_x <= 1 or not 0 <= args.focus_y <= 1:
        raise ValueError("--focus-x y --focus-y deben estar entre 0 y 1.")

    with Image.open(args.input) as original:
        image = ImageOps.exif_transpose(original).convert("RGB")
        width, height = image.size
        target_ratio = TARGET_SIZE[0] / TARGET_SIZE[1]
        if width / height > target_ratio:
            crop_height, crop_width = height, round(height * target_ratio)
        else:
            crop_width, crop_height = width, round(width / target_ratio)
        left = min(max(round((width - crop_width) * args.focus_x), 0), width - crop_width)
        top = min(max(round((height - crop_height) * args.focus_y), 0), height - crop_height)
        image = image.crop((left, top, left + crop_width, top + crop_height))
        image = image.resize(TARGET_SIZE, Image.Resampling.LANCZOS)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.output, "WEBP", quality=84, method=6)


if __name__ == "__main__":
    main()
