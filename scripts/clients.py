"""Turns the scraped client logos (mixed transparent and white-background PNGs) into single-colour
navy silhouettes so the client ticker stays inside the palette. Run after `npm run scrape`.
Run: python3 scripts/clients.py   (needs Pillow)
"""
import glob, os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "public", "media", "clients")
OUT = os.path.join(SRC, "mono")
NAVY = (0x1E, 0x2C, 0x51)
os.makedirs(OUT, exist_ok=True)

for path in sorted(glob.glob(os.path.join(SRC, "*.png"))):
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    out = Image.new("RGBA", (w, h), NAVY + (0,))
    op = out.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            lum = 0.2126 * r + 0.7152 * g + 0.0722 * b
            # Dark ink becomes solid navy; white (paper or knock-outs) becomes transparent.
            ink = min(1.0, max(0.0, (215 - lum) / 160))
            alpha = int(a * ink)
            # Drop the faint hairline frames some exports carry around the artwork.
            op[x, y] = NAVY + (alpha if alpha > 70 else 0,)
    box = out.getbbox()
    if box:
        out = out.crop(box)
    out.save(os.path.join(OUT, os.path.basename(path)), optimize=True)
    print(os.path.basename(path), out.size)
