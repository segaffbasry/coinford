#!/usr/bin/env bash
# Transcodes Coinford's own films for the web. Sources are downloaded from coinford.co.uk into _scrape/video (gitignored).
#  - hero.mp4: the homepage hero film (4K, 42.6s, 134 MB on the live site) -> 1600x900 (and 960x540 for phones), muted, H.264 CRF 31, 25 fps
#  - training.mp4: the HSQE training film (portrait 1080x1920, 61s) -> 720x1280 with sound, played on request
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=_scrape/video; OUT=public/media/film
mkdir -p "$SRC" "$OUT"
fetch() { [ -s "$SRC/$2" ] || curl -sL -C - --retry 5 -A "Mozilla/5.0" -o "$SRC/$2" "https://www.coinford.co.uk/wp-content/uploads/$1"; }
fetch 2025/06/video-output-BBDA24CC-5CA1-46C4-941E-F7B2FE0359AC.mp4 hero-source.mp4
fetch 2024/09/Training-Video-to-use.mp4 training-source.mp4
ffmpeg -y -loglevel error -i "$SRC/hero-source.mp4" -an -vf "scale=1600:-2,fps=25" -c:v libx264 -preset slow -crf 31 -profile:v high -pix_fmt yuv420p -movflags +faststart "$OUT/hero.mp4"
ffmpeg -y -loglevel error -i "$SRC/hero-source.mp4" -an -vf "scale=960:-2,fps=25" -c:v libx264 -preset slow -crf 31 -pix_fmt yuv420p -movflags +faststart "$OUT/hero-720.mp4"
ffmpeg -y -loglevel error -ss 0.5 -i "$SRC/hero-source.mp4" -frames:v 1 -vf "scale=1920:-2" -q:v 4 "$OUT/hero-poster.jpg"
ffmpeg -y -loglevel error -i "$SRC/training-source.mp4" -vf "scale=720:-2" -c:v libx264 -preset slow -crf 28 -pix_fmt yuv420p -c:a aac -b:a 96k -movflags +faststart "$OUT/training.mp4"
ffmpeg -y -loglevel error -ss 2 -i "$SRC/training-source.mp4" -frames:v 1 -vf "scale=720:-2" -q:v 4 "$OUT/training-poster.jpg"
ls -la "$OUT"
