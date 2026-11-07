#!/usr/bin/env bash
# Validates every tracked GLSL shader. glslangValidator picks the stage from the
# file extension, and `#version 300 es` makes it check against WebGL 2's GLSL.
set -euo pipefail

mapfile -t shaders < <(git ls-files '*.vert' '*.frag')
if ((${#shaders[@]} == 0)); then
  echo "No shaders found." >&2
  exit 1
fi
glslangValidator "${shaders[@]}"
