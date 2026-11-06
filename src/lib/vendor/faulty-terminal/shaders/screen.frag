#version 300 es

// Screen pass. Draws each cell's glyph from the cell pass output, then the CRT
// on top: scanlines, glitch bands, flicker, bloom, click effects, chromatic
// aberration, barrel curvature and vignette.

precision highp float;
precision highp int;

// These must match settings.ts. scripts/check-faulty-terminal.ts checks them.
const int GLYPH_COUNT = 23;
const int MAX_CLICKS = 4;
const int GLYPHS_BLOCKS = 0;
const int GLYPHS_DOTS = 1;
const int GLYPHS_CHARACTERS = 2;
const int CLICK_NONE = 0;
const int CLICK_GLITCH = 1;
const int CLICK_DEGAUSS = 2;

// Glyph cells per unit of uGridMul. cells.frag uses the same value.
const float CELLS_PER_GRID_UNIT = 15.0;
// A glyph is 5 by 5 pixels.
const float GLYPH_PIXELS = 5.0;
const float GLYPH_CENTRE = 2.0;

const float ONE_8BIT_STEP = 1.0 / 255.0;
// Rec. 709 luma weights: how bright each channel looks to the eye.
const vec3 REC709_LUMA = vec3(0.2126, 0.7152, 0.0722);

const float PATTERN_SPEED = 1.0 / 3.0;

// Pixel bevel: brighter at the bottom and right of each glyph pixel.
const float BEVEL_BASE_Y = 0.2;
const float BEVEL_BASE_X = 0.75;

// Glyph styles.
const float CHARACTER_BASE_RATE = 1.2;
const float CHARACTER_HEAT_RATE = 18.0;
const float CHARACTER_PHASE_SPREAD = 7.0;
const float CHARACTER_BASE_SHADE = 0.35;
const float DOT_RADIUS = 0.36;
const float DOT_RADIUS_GROWTH = 0.06;
const float DOT_EDGE_SOFTNESS = 0.75;
const float DOT_BASE_SHADE = 0.55;
const float MOUSE_GLOW_BOOST = 1.3;

// Glitch bands roll down the screen and shove rows sideways.
const float BAND_ROLL_SPEED = 0.25;
const float BAND_SHARPNESS = 50.0;
const float BAND_WAVE_FREQUENCY = 20.0;
const float BAND_SHIFT = 0.0125;
const float BAND_JITTER_SPEED = 60.0;

// Scanlines.
const float SCANLINE_SPEED = 20.0;
const float SCANLINE_WIDTH = 0.2;
const float SCANLINE_BOOST = 0.4;

// The halo is a 3 by 3 box blur of the glyphs, this far apart.
const float HALO_OFFSET = 0.002;
const float CORE_WEIGHT = 0.9;
const float HALO_WEIGHT = 0.1;

// Bloom from the neighbouring cells, and the phosphor colour it brings.
const float BLOOM_GAIN = 0.2;
const float BLOOM_MOUSE_BOOST = 1.6;
const float CHARACTER_BLOOM = 0.45;
const float PHOSPHOR_SATURATION = 0.8;
const float PHOSPHOR_WHITENING = 0.45;
const float MOUSE_WHITENING = 0.6;

// Clicks.
const float GLITCH_TICKS_PER_SECOND = 30.0;
const float GLITCH_MIN_BANDS = 14.0;
const float GLITCH_EXTRA_BANDS = 26.0;
const float GLITCH_TORN_THRESHOLD = 0.42;
const float GLITCH_FALLOFF = 2.5;
const float GLITCH_MAX_SHIFT = 0.22;
const float DEGAUSS_SPEED = 1.6;
const float DEGAUSS_WIDTH = 0.18;
const float DEGAUSS_FREQUENCY = 40.0;
const float DEGAUSS_STRENGTH = 0.05;
const float CLICK_SPLIT_PIXELS = 6.0;

// Vignette.
const float VIGNETTE_MIN_EDGE = 0.04;
const float VIGNETTE_EDGE_GROWTH = 0.22;
const float VIGNETTE_STRENGTH = 1.5;

// Light mode prints ink on a light page instead of light on a dark one.
const float INK_SATURATION = 1.6;
const float INK_LUMA = 0.3;
const float INK_CORE_WEIGHT = 1.15;
const float INK_HALO_WEIGHT = 0.4;
const float INK_MOUSE_BOOST = 0.4;
const float INK_MAX_COVER = 0.94;

uniform float uTime;
// Seconds since mount, unaffected by pause. Click ages count on this.
uniform float uClock;
uniform vec3 uResolution;
uniform float uScale;
uniform vec2 uGridMul;
uniform float uDigitSize;
uniform float uScanlineIntensity;
uniform float uGlitchAmount;
uniform float uFlickerAmount;
uniform float uChromaticAberration;
uniform float uDither;
uniform float uCurvature;
uniform vec3 uTint;
uniform float uBrightness;
uniform bool uLightMode;
uniform int uGlyphs;
uniform float uGlow;
uniform float uScramble;
uniform float uMouseGlow;
uniform float uVignette;

// The 5 by 5 bitmaps for GLYPHS_CHARACTERS. Bit row * 5 + column is a pixel.
uniform uint uFont[GLYPH_COUNT];

// The cell pass output. See cells.frag for the layout.
uniform sampler2D uRings;
uniform sampler2D uDetail;
uniform ivec2 uOrigin;
uniform ivec2 uCellCount;

// Each click is (x, y, start time on uClock, active).
uniform vec4 uClicks[MAX_CLICKS];
uniform int uClickMode;
uniform float uClickSeconds;

out vec4 outColor;

struct Light {
  // The glyph itself.
  float core;
  // The soft glow around it.
  float halo;
};

float patternTime;
// Hottest cell touched while drawing this pixel. glyph() writes it.
float glyphHeat;

// Dave Hoskins' "Hash without Sine".
float hashCell(vec2 point) {
  vec3 q = fract(vec3(point.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

// A cheap per-pixel hash for dithering.
float hashPixel(vec2 point) {
  point = fract(point * 234.56);
  point += dot(point, point + 34.56);
  return fract(point.x * point.y);
}

ivec2 cellTexel(vec2 cell) {
  return clamp(ivec2(cell) - uOrigin, ivec2(0), uCellCount - 1);
}

// Ring lit state for a pixel at squared distance n from the glyph centre.
float ringAt(float n, vec4 rings, vec4 detail) {
  if (n < 0.5) return rings.x;
  if (n < 1.5) return rings.y;
  if (n < 2.5) return rings.z;
  if (n < 4.5) return rings.w;
  if (n < 5.5) return detail.x;
  return detail.y;
}

float bevel(vec2 inPixel) {
  return (BEVEL_BASE_Y + inPixel.y * (1.0 - BEVEL_BASE_Y))
    * (BEVEL_BASE_X + inPixel.x * (1.0 - BEVEL_BASE_X));
}

float characterGlyph(vec2 cell, vec2 pixel, vec2 inPixel, vec4 rings, vec4 detail, float boost) {
  float heat = detail.w;
  float level = detail.z;
  float rate = CHARACTER_BASE_RATE + heat * uScramble * CHARACTER_HEAT_RATE;
  float phase = hashCell(cell * 1.37 + 4.1);
  float epoch = floor(uTime * rate + phase * CHARACTER_PHASE_SPREAD);
  float pick = hashCell(cell + vec2(epoch * 0.731, epoch * 1.913));
  int glyphIndex = int(min(pick * float(GLYPH_COUNT), float(GLYPH_COUNT - 1)));
  int bit = int(pixel.y) * int(GLYPH_PIXELS) + int(pixel.x);
  float lit = float((uFont[glyphIndex] >> uint(clamp(bit, 0, 24))) & 1u);
  float brightness = max(rings.x, level);
  float shade = CHARACTER_BASE_SHADE + (1.0 - CHARACTER_BASE_SHADE) * level;
  return lit * brightness * shade * boost * bevel(inPixel);
}

float dotGlyph(float on, vec2 inPixel, float pixelScale, float boost) {
  vec2 fromCentre = inPixel - 0.5;
  float radius = DOT_RADIUS + DOT_RADIUS_GROWTH * on;
  float edge = fwidth(pixelScale) * DOT_EDGE_SOFTNESS;
  float coverage = 1.0 - smoothstep(radius - edge, radius + edge, length(fromCentre));
  float shade = DOT_BASE_SHADE + (1.0 - DOT_BASE_SHADE) * (1.0 - length(fromCentre) / 0.5);
  return on * coverage * boost * shade;
}

// Brightness of the glyph at screen point p.
float glyph(vec2 p) {
  vec2 cellsPerUnit = uGridMul * CELLS_PER_GRID_UNIT;
  vec2 cell = floor(p * cellsPerUnit);
  ivec2 texel = cellTexel(cell);
  vec4 rings = texelFetch(uRings, texel, 0);
  vec4 detail = texelFetch(uDetail, texel, 0);
  float heat = detail.w;
  float boost = 1.0 + heat * uMouseGlow * MOUSE_GLOW_BOOST;
  glyphHeat = max(glyphHeat, heat);

  vec2 inCell = fract(p * cellsPerUnit) * uDigitSize;
  float inside = step(0.0, inCell.x) * step(inCell.x, 1.0) * step(0.0, inCell.y) * step(inCell.y, 1.0);
  // Glyph pixel coordinates count from the top left.
  vec2 scaled = vec2(inCell.x, 1.0 - inCell.y) * GLYPH_PIXELS;
  vec2 pixel = floor(scaled);
  vec2 inPixel = fract(scaled);

  if (uGlyphs == GLYPHS_CHARACTERS) {
    return inside * characterGlyph(cell, pixel, inPixel, rings, detail, boost);
  }

  vec2 fromCentre = pixel - GLYPH_CENTRE;
  float on = ringAt(dot(fromCentre, fromCentre), rings, detail);
  if (uGlyphs == GLYPHS_DOTS) {
    return inside * dotGlyph(on, inPixel, scaled.x, boost);
  }
  return inside * on * bevel(inPixel) * boost;
}

float flicker(float a, float b, float threshold) {
  return step(threshold, sin(uTime + a * cos(uTime * b))) * uFlickerAmount;
}

// Sideways shift of a glitch band that rolls down the screen.
float bandShift(vec2 p) {
  float fromBand = p.y - mod(uTime * BAND_ROLL_SPEED, 1.0);
  float window = 1.0 / (1.0 + BAND_SHARPNESS * fromBand * fromBand);
  float jitter = 1.0 + cos(uTime * BAND_JITTER_SPEED);
  float wave = sin(p.y * BAND_WAVE_FREQUENCY + uTime);
  return wave * BAND_SHIFT * flicker(4.0, 2.0, 0.8) * jitter * window;
}

Light lightAt(vec2 p, float clickTear) {
  float scanline = step(mod(p.y + patternTime * SCANLINE_SPEED, 1.0), SCANLINE_WIDTH);
  float halo = (scanline * SCANLINE_BOOST + 1.0) * uScanlineIntensity;

  p.x += bandShift(p) * uGlitchAmount + clickTear;

  float blurred = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      blurred += glyph(p + vec2(float(x), float(y)) * HALO_OFFSET);
    }
  }
  return Light(CORE_WEIGHT * glyph(p), blurred * HALO_WEIGHT * halo);
}

// Gaussian glow from the 3 by 3 cells around p.
float bloomAt(vec2 p) {
  vec2 cellsPerUnit = uGridMul * CELLS_PER_GRID_UNIT;
  vec2 cell = floor(p * cellsPerUnit);
  vec2 cellPixels = uResolution.xy / (uScale * cellsPerUnit);
  float sigma = 0.5 * min(cellPixels.x, cellPixels.y);
  float glyphCentre = 0.5 * min(1.0, 1.0 / max(uDigitSize, 0.001));
  float total = 0.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbour = cell + vec2(float(x), float(y));
      ivec2 texel = cellTexel(neighbour);
      vec4 rings = texelFetch(uRings, texel, 0);
      vec4 detail = texelFetch(uDetail, texel, 0);
      float emission;
      if (uGlyphs == GLYPHS_CHARACTERS) {
        float shade = CHARACTER_BASE_SHADE + (1.0 - CHARACTER_BASE_SHADE) * detail.z;
        emission = max(rings.x, detail.z) * shade * CHARACTER_BLOOM;
      } else {
        // Lit pixels per ring: 1 at the centre, 4 on rings 1, 2, 4 and 8, 8 on ring 5.
        float litPixels = rings.x + 4.0 * (rings.y + rings.z + rings.w + detail.y) + 8.0 * detail.x;
        emission = litPixels / (GLYPH_PIXELS * GLYPH_PIXELS);
      }
      emission *= 1.0 + detail.w * uMouseGlow * BLOOM_MOUSE_BOOST;
      vec2 offset = (p - (neighbour + glyphCentre) / cellsPerUnit) * uResolution.xy / uScale;
      total += emission * exp(-dot(offset, offset) / (2.0 * sigma * sigma));
    }
  }
  return total;
}

vec2 barrel(vec2 uv) {
  vec2 centred = uv * 2.0 - 1.0;
  centred *= 1.0 + uCurvature * dot(centred, centred);
  return centred * 0.5 + 0.5;
}

// Applies the active clicks to uv. Returns the sideways tear in x and the
// extra chromatic split in y.
vec2 applyClicks(inout vec2 uv) {
  float tear = 0.0;
  float split = 0.0;
  for (int k = 0; k < MAX_CLICKS; k++) {
    vec4 click = uClicks[k];
    float start = click.z;
    if (click.w <= 0.0) continue;
    float age = uClock - start;
    if (age < 0.0 || age > uClickSeconds) continue;
    float life = age / uClickSeconds;
    float envelope = (1.0 - life) * (1.0 - life);

    if (uClickMode == CLICK_GLITCH) {
      float tick = floor(age * GLITCH_TICKS_PER_SECOND);
      float bands = GLITCH_MIN_BANDS + GLITCH_EXTRA_BANDS * hashCell(vec2(start, tick * 0.37));
      float row = floor(uv.y * bands);
      float torn = step(GLITCH_TORN_THRESHOLD, hashCell(vec2(row + tick * 7.0, start * 17.0)));
      float reach = exp(-abs(uv.y - click.y) * GLITCH_FALLOFF);
      float shift = (hashCell(vec2(row * 1.7 + tick, start)) - 0.5) * GLITCH_MAX_SHIFT;
      tear += shift * torn * envelope * reach;
      split = max(split, envelope * reach * (0.4 + 0.6 * torn));
    } else if (uClickMode == CLICK_DEGAUSS) {
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      vec2 delta = (uv - click.xy) * aspect;
      float fromFront = length(delta) - age * DEGAUSS_SPEED;
      // Upstream used pow(x, 2.0), which is undefined for negative x in GLSL.
      float fromFrontInWidths = fromFront / DEGAUSS_WIDTH;
      float band = exp(-fromFrontInWidths * fromFrontInWidths);
      float wave = sin(fromFront * DEGAUSS_FREQUENCY) * band;
      uv += delta / aspect * wave * DEGAUSS_STRENGTH * envelope;
      split = max(split, envelope * band);
    }
  }
  return vec2(tear, split);
}

float vignetteMask(vec2 uv) {
  float edge = VIGNETTE_MIN_EDGE + VIGNETTE_EDGE_GROWTH * uVignette;
  vec2 fade = smoothstep(vec2(0.0), vec2(edge), uv) * smoothstep(vec2(0.0), vec2(edge), 1.0 - uv);
  float mask = fade.x * fade.y;
  mask = mask * mask * (3.0 - 2.0 * mask);
  return mix(1.0, mask, clamp(uVignette * VIGNETTE_STRENGTH, 0.0, 1.0));
}

float maxComponent(vec3 v) {
  return max(v.r, max(v.g, v.b));
}

vec4 ink(vec3 core, vec3 halo, float heat) {
  float tintLuma = dot(uTint, REC709_LUMA);
  vec3 hue = uTint / max(maxComponent(uTint), 0.0001);
  vec3 vivid = clamp(mix(vec3(dot(hue, REC709_LUMA)), hue, INK_SATURATION), 0.0, 1.0);
  vivid = clamp(vivid * (INK_LUMA / max(dot(vivid, REC709_LUMA), 0.0001)), 0.0, 1.0);
  vec3 inkColour = mix(uTint, vivid, smoothstep(0.3, 0.6, tintLuma));
  vec3 cover = (core * INK_CORE_WEIGHT + halo * INK_HALO_WEIGHT) * uBrightness
    * (1.0 + heat * uMouseGlow * INK_MOUSE_BOOST);
  if (uDither > 0.0) cover += (hashPixel(gl_FragCoord.xy) - 0.5) * (uDither * ONE_8BIT_STEP);
  cover = clamp(cover, 0.0, INK_MAX_COVER);
  float alpha = maxComponent(cover);
  // Premultiplied: alpha minus the light the ink absorbs.
  return vec4(alpha - cover * (1.0 - inkColour), alpha);
}

void main() {
  patternTime = uTime * PATTERN_SPEED;
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  if (uCurvature != 0.0) uv = barrel(uv);

  float clickTear = 0.0;
  float clickSplit = 0.0;
  if (uClickMode != CLICK_NONE) {
    vec2 click = applyClicks(uv);
    clickTear = click.x;
    clickSplit = click.y;
  }

  vec2 p = uv * uScale;
  glyphHeat = 0.0;
  Light green = lightAt(p, clickTear);
  float heat = glyphHeat;
  Light red = green;
  Light blue = green;

  float split = uChromaticAberration + clickSplit * CLICK_SPLIT_PIXELS;
  if (split != 0.0) {
    vec2 offset = vec2(split) / uResolution.xy;
    red = lightAt(p + offset, clickTear);
    blue = lightAt(p - offset, clickTear);
  }

  vec3 core = vec3(red.core, green.core, blue.core);
  vec3 halo = vec3(red.halo, green.halo, blue.halo);
  if (uGlow > 0.0) halo += uGlow * BLOOM_GAIN * bloomAt(p);
  vec3 raw = core + halo;

  float phosphor = clamp(uGlow, 0.0, 1.0);
  vec3 vividTint = clamp(
    mix(vec3(dot(uTint, REC709_LUMA)), uTint, 1.0 + PHOSPHOR_SATURATION * phosphor),
    0.0,
    1.0
  );
  vec3 coreTint = mix(
    uTint,
    vec3(maxComponent(uTint)),
    phosphor * PHOSPHOR_WHITENING * smoothstep(0.45, 0.9, core)
  );
  vec3 colour = core * coreTint + halo * vividTint;
  colour += (vec3(1.0) - uTint) * min(raw, vec3(1.0)) * heat * uMouseGlow * MOUSE_WHITENING;
  colour *= uBrightness;

  if (uVignette > 0.0) {
    float keep = vignetteMask(uv);
    colour *= keep;
    core *= keep;
    halo *= keep;
  }

  if (uLightMode) {
    outColor = ink(core, halo, heat);
    return;
  }

  if (uDither > 0.0) colour += (hashPixel(gl_FragCoord.xy) - 0.5) * (uDither * ONE_8BIT_STEP);
  colour = clamp(colour, 0.0, 1.0);
  // Premultiplied: the glow is as opaque as its brightest channel.
  outColor = vec4(colour, maxComponent(colour));
}
