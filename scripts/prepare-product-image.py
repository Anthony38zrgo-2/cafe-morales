"""Normaliza fotografías de productos al formato usado por el catálogo.

Modos:
- crop: recorta centrado (o según --focus-x/--focus-y) al ratio objetivo y redimensiona a 1200 px de ancho.
- contain: encaja la imagen completa dentro del ratio objetivo, rellenando el sobrante:
  si la imagen tiene canal alfa (logos) el relleno es transparente (WebP RGBA);
  si no, se rellena con --bg.

Compatibilidad: los argumentos originales (--input --output --focus-x --focus-y)
siguen funcionando con sus defaults (ratio 16/9, mode crop, quality 84).
"""

import re
from argparse import ArgumentParser
from pathlib import Path

from PIL import Image, ImageOps

BASE_WIDTH = 1200
DEFAULT_RATIO = "16/9"
DEFAULT_BG = "#fffbeb"


def parse_ratio(value):
    match = re.fullmatch(r"(\d+)\s*/\s*(\d+)", value.strip())
    if not match:
        raise ValueError(f"--ratio debe ser 'ancho/alto' (ej. '4/3'), recibido: {value}")
    num, den = float(match.group(1)), float(match.group(2))
    if num <= 0 or den <= 0:
        raise ValueError("--ratio debe ser positivo.")
    return num / den


def parse_hex(value):
    if not re.fullmatch(r"#[0-9a-fA-F]{6}", value.strip()):
        raise ValueError(f"--bg debe ser #rrggbb, recibido: {value}")
    return value.strip()


def fit_target(ratio):
    width = BASE_WIDTH
    height = max(1, round(BASE_WIDTH / ratio))
    return (width, height)


def crop_(image, ratio, focus_x, focus_y):
    width, height = image.size
    target_ratio = float(ratio)
    if width / height > target_ratio:
        crop_height, crop_width = height, round(height * target_ratio)
    else:
        crop_width, crop_height = width, round(width / target_ratio)
    left = min(max(round((width - crop_width) * focus_x), 0), width - crop_width)
    top = min(max(round((height - crop_height) * focus_y), 0), height - crop_height)
    image = image.crop((left, top, left + crop_width, top + crop_height))
    return image.resize(fit_target(ratio), Image.Resampling.LANCZOS)


def contain_(image, ratio, bg):
    target = fit_target(ratio)
    image = image.copy()
    has_alpha = image.mode in ("RGBA", "LA") or (image.mode == "P" and "transparency" in image.info)
    image = image.convert("RGBA" if has_alpha else "RGB")
    scale = min(target[0] / image.width, target[1] / image.height)
    new_size = (max(1, round(image.width * scale)), max(1, round(image.height * scale)))
    image = image.resize(new_size, Image.Resampling.LANCZOS)
    if has_alpha:
        canvas = Image.new("RGBA", target, (0, 0, 0, 0))
        canvas.paste(image, ((target[0] - image.width) // 2, (target[1] - image.height) // 2))
        return canvas
    canvas = Image.new("RGB", target, bg)
    canvas.paste(image, ((target[0] - image.width) // 2, (target[1] - image.height) // 2))
    return canvas


def main():
    parser = ArgumentParser(description="Genera una imagen WebP de 1200 px de ancho para el catálogo.")
    parser.add_argument("--input", required=True, type=Path)
    parser.add_argument("--output", required=True, type=Path)
    parser.add_argument("--focus-x", type=float, default=0.5)
    parser.add_argument("--focus-y", type=float, default=0.5)
    parser.add_argument("--ratio", default=DEFAULT_RATIO)
    parser.add_argument("--mode", choices=["crop", "contain"], default="crop")
    parser.add_argument("--bg", default=DEFAULT_BG)
    parser.add_argument("--quality", type=int, default=84)
    args = parser.parse_args()

    if not 0 <= args.focus_x <= 1 or not 0 <= args.focus_y <= 1:
        raise ValueError("--focus-x y --focus-y deben estar entre 0 y 1.")
    if not 1 <= args.quality <= 100:
        raise ValueError("--quality debe estar entre 1 y 100.")
    ratio = parse_ratio(args.ratio)
    bg = parse_hex(args.bg)

    with Image.open(args.input) as original:
        image = ImageOps.exif_transpose(original)
        if args.mode == "contain":
            image = contain_(image, ratio, bg)
        else:
            image = crop_(image, ratio, args.focus_x, args.focus_y)

    args.output.parent.mkdir(parents=True, exist_ok=True)
    image.save(args.output, "WEBP", quality=args.quality, method=6)


if __name__ == "__main__":
    main()
