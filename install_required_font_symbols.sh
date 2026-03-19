#!/bin/bash

INPUT_FONT="./static/fonts/JetBrainsMonoNerdFont-Regular.woff2"
OUTPUT_FONT="./static/fonts/JetBrainsMonoNerdFont-Regular-Optimized.woff2"
SEARCH_DIRS="src"
LATIN_UNICODES="U+0000-007F"

echo "Scanning source for unique characters..."

# -I: Ignore binary files
# -o: Only print the matching part (the character)
# . : Match every character
# sort -u: Unique characters only
# tr -d '\n': Remove newlines to create one long string
CHARS=$(rg -I -o . $SEARCH_DIRS | sort -u | tr -d '\n')

echo "Found unique characters. Optimizing font..."

pyftsubset "$INPUT_FONT" \
  --unicodes="$LATIN_UNICODES" \
  --text="$CHARS" \
  --layout-features="*" \
  --flavor=woff2 \
  --output-file="$OUTPUT_FONT"

echo "Done! New font size: $(du -h $OUTPUT_FONT | cut -f1)"
