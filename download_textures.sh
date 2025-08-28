#!/bin/bash

# Texture download script for TextureLabs
# Run this script to download all textures from the specified page

cd "$(dirname "$0")/src/assets/textures"

echo "Downloading textures to $(pwd)..."

# Based on the textures found on https://texturelabs.org/?ct=665&st=800
# Note: You may need to update these URLs with the actual direct download links

echo "Please manually download these textures from TextureLabs:"
echo "Visit: https://texturelabs.org/?ct=665&st=800"
echo ""
echo "Download the SMALL version of each texture and save with these names:"
echo ""

textures=(
    "grunge_135"
    "paper_164"
    "paper_124"
    "grunge_267"
    "grunge_127"
    "paper_313"
    "grunge_340"
    "lensfx_213"
    "fabric_178"
    "paper_207"
    "paper_174"
    "paper_237"
    "sky_145"
    "film_181"
    "inkpaint_182"
    "film_146"
    "paper_361"
    "fabric_124"
    "metal_244"
    "paper_320"
    "film_120"
    "lensfx_191"
    "grunge_318"
    "metal_232"
)

for texture in "${textures[@]}"; do
    echo "- ${texture}.jpg (or .png for inkpaint_182)"
done

echo ""
echo "Save them to: $(pwd)"
echo ""
echo "After downloading, run 'node generate_texture_index.js' to create the JavaScript index file."