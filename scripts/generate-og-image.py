"""Genera og-image.svg y og-image.png (1200x630 px) para Morales Coffee Market.

Usa la paleta amber y preset clay del proyecto.
"""

import base64
import os
import subprocess
import sys
from io import BytesIO
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
ASSETS = ROOT / "src" / "assets"

def get_optimized_b64(path, max_size, fmt="PNG"):
    with Image.open(path) as img:
        img = img.convert("RGBA" if "A" in img.mode or "transparency" in img.info else "RGB")
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        buf = BytesIO()
        img.save(buf, format=fmt, optimize=True)
        buf.seek(0)
        mime = "image/png" if fmt == "PNG" else "image/webp"
        return f"data:{mime};base64," + base64.b64encode(buf.read()).decode("utf-8")

def generate_svg():
    PUBLIC.mkdir(parents=True, exist_ok=True)
    
    # Preparar imágenes optimizadas para incrustar en el SVG
    valqui_bag_b64 = get_optimized_b64(ASSETS / "valqui" / "valqui-clasico-250g.png", (650, 750), "PNG")
    valqui_logo_b64 = get_optimized_b64(ASSETS / "valqui" / "valqui-logo.png", (200, 200), "PNG")
    bean_single_b64 = get_optimized_b64(ASSETS / "coffee" / "coffee-bean-single.png", (180, 180), "PNG")
    
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&amp;family=Fraunces:ital,opsz,wght@0,9..144,600..900;1,9..144,600..900&amp;display=swap');
      
      .font-display {{
        font-family: 'Fraunces', Georgia, serif;
      }}
      .font-sans {{
        font-family: 'DM Sans', 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      }}
    </style>

    <!-- Gradiente de fondo cálido (amber palette) -->
    <linearGradient id="bg-grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fffdf7" />
      <stop offset="50%" stop-color="#fffbeb" />
      <stop offset="100%" stop-color="#fef3c7" />
    </linearGradient>

    <!-- Gradiente de la tarjeta del producto -->
    <linearGradient id="card-grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" />
      <stop offset="100%" stop-color="#fffdf5" />
    </linearGradient>

    <!-- Gradiente del botón primario clay -->
    <linearGradient id="brand-grad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#d97706" />
      <stop offset="100%" stop-color="#b45309" />
    </linearGradient>

    <!-- Sombra suave para tarjeta principal (clay extruded effect) -->
    <filter id="clay-shadow" x="-10%" y="-10%" width="125%" height="125%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#78350f" flood-opacity="0.12" />
      <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#78350f" flood-opacity="0.08" />
    </filter>

    <!-- Sombra para pills / insignias -->
    <filter id="pill-shadow" x="-10%" y="-20%" width="120%" height="150%" filterUnits="userSpaceOnUse">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#92400e" flood-opacity="0.08" />
    </filter>

    <clipPath id="card-clip">
      <rect x="670" y="50" width="470" height="530" rx="32" />
    </clipPath>
    <clipPath id="photo-clip">
      <rect x="686" y="110" width="420" height="385" rx="20" />
    </clipPath>
  </defs>

  <!-- Fondo base -->
  <rect width="1200" height="630" fill="url(#bg-grad)" />

  <!-- Acentos decorativos de fondo -->
  <circle cx="1100" cy="100" r="300" fill="#fde68a" fill-opacity="0.22" />
  <circle cx="150" cy="550" r="220" fill="#fde68a" fill-opacity="0.25" />

  <!-- Marco estético sutil -->
  <rect x="24" y="24" width="1152" height="582" rx="28" fill="none" stroke="#fde68a" stroke-width="2" stroke-opacity="0.8" />

  <!-- Grano / círculos decorativos orgánicos -->
  <g opacity="0.18">
    <circle cx="480" cy="80" r="6" fill="#d97706" />
    <circle cx="560" cy="110" r="4" fill="#92400e" />
    <circle cx="610" cy="70" r="8" fill="#d97706" />
    <circle cx="520" cy="560" r="5" fill="#d97706" />
  </g>

  <!-- ================= COLUMNA IZQUIERDA: TEXTO E IDENTIDAD ================= -->
  
  <!-- 1. Eyebrow Badge (Preset Clay Pill) -->
  <g transform="translate(68, 60)" filter="url(#pill-shadow)">
    <rect width="320" height="42" rx="21" fill="#fef3c7" stroke="#fde68a" stroke-width="1.5" />
    <image href="{bean_single_b64}" x="12" y="8" width="26" height="26" preserveAspectRatio="xMidYMid meet" />
    <text x="48" y="26" class="font-sans" font-size="13" font-weight="700" fill="#92400e" letter-spacing="1.2">MORALES COFFEE MARKET</text>
  </g>

  <!-- 2. Titular Principal (Fraunces serif de la marca) -->
  <g transform="translate(68, 172)">
    <text class="font-display" font-size="52" font-weight="800" fill="#2e240a" letter-spacing="-1.2">
      <tspan x="0" y="0">Café calidad-precio</tspan>
      <tspan x="0" y="62" fill="#d97706">para cada gusto</tspan>
    </text>
  </g>

  <!-- 3. Descripción / Propuesta de valor -->
  <g transform="translate(68, 328)">
    <text class="font-sans" font-size="20" font-weight="500" fill="#7a6a3a" line-height="1.4">
      <tspan x="0" y="0">Coffee market peruano: cafés de tostadores con trayectoria</tspan>
      <tspan x="0" y="28">a precio justo, con información clara de origen y perfil.</tspan>
    </text>
  </g>

  <!-- 4. Puntos clave / Highlights (Clay pills con sombra y relieve) -->
  <g transform="translate(68, 405)">
    <!-- Pill 1: Producto estrella -->
    <g transform="translate(0, 0)" filter="url(#pill-shadow)">
      <rect width="530" height="52" rx="16" fill="#ffffff" stroke="#fde68a" stroke-width="1.5" />
      <text x="20" y="33" class="font-sans" font-size="18">☕</text>
      <text x="52" y="32" class="font-sans" font-size="16" font-weight="700" fill="#2e240a">Valqui Clásico</text>
      <text x="175" y="32" class="font-sans" font-size="15" font-weight="500" fill="#7a6a3a">· Presentaciones de 250g, 500g y 1kg</text>
    </g>

    <!-- Pill 2: Beneficio de regalo -->
    <g transform="translate(0, 66)" filter="url(#pill-shadow)">
      <rect width="530" height="52" rx="16" fill="#ffffff" stroke="#fde68a" stroke-width="1.5" />
      <text x="20" y="33" class="font-sans" font-size="18">🎁</text>
      <text x="52" y="32" class="font-sans" font-size="16" font-weight="700" fill="#92400e">Regalo con cualquier compra:</text>
      <text x="298" y="32" class="font-sans" font-size="15" font-weight="500" fill="#7a6a3a">Esencia premium (300 ml)</text>
    </g>

    <!-- Pill 3: Cobertura de envíos -->
    <g transform="translate(0, 132)" filter="url(#pill-shadow)">
      <rect width="530" height="48" rx="16" fill="#fef3c7" stroke="#fde68a" stroke-width="1.2" />
      <text x="20" y="31" class="font-sans" font-size="18">🚚</text>
      <text x="52" y="30" class="font-sans" font-size="15" font-weight="700" fill="#92400e">Almacén en Lima</text>
      <text x="182" y="30" class="font-sans" font-size="15" font-weight="500" fill="#7a6a3a">· Envíos directos a todo el Perú</text>
    </g>
  </g>

  <!-- ================= COLUMNA DERECHA: CARD PRODUCTO (CLAY SHOWCASE) ================= -->
  
  <g filter="url(#clay-shadow)">
    <!-- Marco de la tarjeta -->
    <rect x="660" y="48" width="472" height="534" rx="32" fill="url(#card-grad)" stroke="#fde68a" stroke-width="2" />
    
    <!-- Relieve superior (inset highlight estilo clay) -->
    <path d="M 692 50 L 1100 50 Q 1130 50 1130 80" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9" />

    <!-- Fotografía del café Valqui Clásico con esquinas redondeadas -->
    <g clip-path="url(#photo-clip)">
      <image href="{valqui_bag_b64}" x="686" y="110" width="420" height="385" preserveAspectRatio="xMidYMid slice" />
    </g>

    <!-- Badge del Partner (Valqui Logo) en esquina superior derecha -->
    <g transform="translate(1015, 66)" filter="url(#pill-shadow)">
      <circle cx="45" cy="45" r="42" fill="#ffffff" stroke="#fde68a" stroke-width="1.5" />
      <image href="{valqui_logo_b64}" x="12" y="12" width="66" height="66" preserveAspectRatio="xMidYMid meet" />
    </g>

    <!-- Tag Orígenes en la tarjeta -->
    <g transform="translate(686, 75)">
      <rect width="180" height="32" rx="16" fill="#fffbeb" stroke="#fde68a" stroke-width="1" />
      <text x="16" y="21" class="font-sans" font-size="12" font-weight="700" fill="#92400e" letter-spacing="0.5">ORIGEN DESTACADO</text>
    </g>

    <!-- Banda inferior de la tarjeta -->
    <g transform="translate(686, 508)">
      <rect width="420" height="52" rx="26" fill="url(#brand-grad)" />
      <text x="210" y="32" text-anchor="middle" class="font-sans" font-size="15" font-weight="800" fill="#ffffff" letter-spacing="1">
        VALQUI · CAFÉ VENTURA S.A.C.
      </text>
    </g>
  </g>

  <!-- Granos de café decorativos flotando sutilmente -->
  <g transform="translate(620, 180) rotate(-18) scale(0.65)" opacity="0.85" filter="url(#pill-shadow)">
    <image href="{bean_single_b64}" x="0" y="0" width="70" height="70" />
  </g>
  <g transform="translate(1115, 450) rotate(25) scale(0.55)" opacity="0.75" filter="url(#pill-shadow)">
    <image href="{bean_single_b64}" x="0" y="0" width="70" height="70" />
  </g>
</svg>'''

    svg_path = PUBLIC / "og-image.svg"
    svg_path.write_text(svg_content, encoding="utf-8")
    print(f"Generado {svg_path} ({len(svg_content)} bytes)")
    return svg_path

def render_png(svg_path):
    png_path = PUBLIC / "og-image.png"
    
    # Envoltura HTML con Google Fonts cargadas para máxima fidelidad
    html_content = f'''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&family=Fraunces:ital,opsz,wght@0,9..144,600..900;1,9..144,600..900&display=swap');
  * {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html, body {{
    width: 1200px;
    height: 630px;
    overflow: hidden;
    background: #fffbeb;
  }}
  img {{
    width: 1200px;
    height: 630px;
    display: block;
  }}
</style>
</head>
<body>
  <img src="file:///{svg_path.as_posix()}" />
</body>
</html>'''

    temp_html = PUBLIC / "_temp_og.html"
    temp_html.write_text(html_content, encoding="utf-8")
    
    chrome_path = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if not os.path.exists(chrome_path):
        chrome_path = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
        
    temp_dir = Path(os.environ.get("TEMP", "C:/Temp")) / "chrome_og_gen"
    temp_dir.mkdir(parents=True, exist_ok=True)
    
    cmd = [
        str(chrome_path),
        "--headless",
        "--no-sandbox",
        "--disable-gpu",
        f"--user-data-dir={temp_dir}",
        "--window-size=1200,630",
        "--hide-scrollbars",
        f"--screenshot={png_path}",
        f"file:///{temp_html.as_posix()}"
    ]
    
    print(f"Ejecutando renderizado a {png_path}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("Error stderr:", res.stderr)
        print("Error stdout:", res.stdout)
        res.check_returncode()
    
    if temp_html.exists():
        temp_html.unlink()
        
    if png_path.exists():
        with Image.open(png_path) as im:
            print(f"og-image.png listo: {im.size}, {im.mode}, {png_path.stat().st_size} bytes")
            # Verificar tamaño
            if im.size != (1200, 630):
                print(f"Redimensionando exactamente a 1200x630 (actual: {im.size})")
                im_resized = im.resize((1200, 630), Image.Resampling.LANCZOS)
                im_resized.save(png_path, "PNG", optimize=True)
    else:
        raise RuntimeError("No se pudo generar og-image.png")

if __name__ == "__main__":
    svg = generate_svg()
    render_png(svg)
