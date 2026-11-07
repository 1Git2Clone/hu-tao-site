#!/usr/bin/env bash
# Installs glslangValidator on the CI runner. The dev shell has it from Nix.
set -euo pipefail

sudo apt-get update -qq
sudo apt-get install -y -qq glslang-tools
