#!/bin/bash

INPUT_FONT="static/fonts/JetBrainsMonoNerdFont-Regular.woff2"
OUTPUT_FONT="static/fonts/JetBrainsMonoNerdFont-Regular-Optimized.woff2"
DIRS="src"

echo "Extracting every unique character from source..."

tmp_chars=$(mktemp)
find ${DIRS} -type f \( -name "*.svelte" -o -name "*.ts" -o -name "*.js" -o -name "*.md" -o -name "*.css" \) -exec cat {} + >"$tmp_chars"

echo "Optimizing font..."

pyftsubset "$INPUT_FONT" \
  --unicodes="U+0000-007F,U+0400-04FF,U+3000-303F,U+3040-309F,U+30A0-30FF,U+FF00-FFEF" \
  --text-file="$tmp_chars" \
  --layout-features="*" \
  --flavor=woff2 \
  --output-file="$OUTPUT_FONT"

rm "$tmp_chars"
echo "Done!"
