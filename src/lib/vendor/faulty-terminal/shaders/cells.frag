#version 300 es

// Cell pass. One texel per glyph cell: which rings of the glyph are lit this
// frame, how bright the cell is, and how hot it is. Last frame's values fade
// out instead of vanishing, which leaves the phosphor trails.
//
// Output layout, read back by screen.frag:
//   outRings  = rings at squared distance 0, 1, 2 and 4 from the glyph centre
//   outDetail = rings at 5 and 8, brightness level, heat

precision highp float;
precision highp int;

// Glyph cells per unit of uGridMul. screen.frag uses the same value.
const float CELLS_PER_GRID_UNIT = 15.0;

const float PI = 3.14159265;
const float ONE_8BIT_STEP = 1.0 / 255.0;

// Domain-warped fractal noise that decides which cells light up.
const float PATTERN_SPEED = 1.0 / 3.0;
const float PATTERN_ZOOM = 0.1;
const float PATTERN_GAIN = 1.3;
const float PATTERN_BIAS = -0.03;
const float WAVE_FREQUENCY_X = 10.0;
const float WAVE_FREQUENCY_Y = 3.0;
const float WAVE_DRIFT_SPEED = 1.0 / 11.0;
const float WAVE_BIAS = 0.2;
const int FBM_OCTAVES = 3;
const float FBM_INPUT_SCALE = 1.1;
const float FBM_LACUNARITY = 2.0;
const float FBM_GAIN = 5.0 / 11.0;
const float FBM_SPIN_SPEED = 0.02;
const float WARP_SPIN_SPEED = 0.1;
const float WARP_TILT = 0.1;

// The cursor lifts the noise around it, with a ripple on top.
const float MOUSE_FALLOFF = 8.0;
const float MOUSE_GAIN = 10.0;
const float MOUSE_RIPPLE_FREQUENCY = 20.0;
const float MOUSE_RIPPLE_SPEED = 5.0;
const float MOUSE_RIPPLE_AMOUNT = 0.1;
const float MOUSE_HEAT_RANGE = 3.0;

// On page load each cell switches on after its own random delay.
const float INTRO_MAX_DELAY = 0.8;
const float INTRO_CELL_DURATION = 0.2;

// A ring lights once the noise clears RING_THRESHOLD plus its own step.
const float RING_THRESHOLD = 0.1;
const vec4 RING_STEPS_INNER = vec4(0.0, 1.0, 2.0, 4.0) / 16.0;
const vec2 RING_STEPS_OUTER = vec2(5.0, 8.0) / 16.0;
const float LEVEL_RANGE = 0.6;

uniform float uTime;
uniform vec2 uGridMul;
uniform float uNoiseAmp;
uniform float uScale;
uniform ivec2 uOrigin;

uniform bool uMouseReact;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform float uHover;

uniform bool uPageLoadAnimation;
uniform float uPageLoadProgress;

uniform sampler2D uPreviousRings;
uniform sampler2D uPreviousDetail;
// Per-frame fade multiplier for the trails. 0 drops them at once.
uniform float uDecay;
// True on the first frame after a resize: the previous textures are garbage.
uniform bool uReset;

layout(location = 0) out vec4 outRings;
layout(location = 1) out vec4 outDetail;

float patternTime;

mat2 rotation(float angle) {
  float c = cos(angle);
  float s = sin(angle);
  return mat2(c, -s, s, c);
}

float wave(vec2 point) {
  float driftingFrequency = WAVE_FREQUENCY_Y + sin(patternTime * WAVE_DRIFT_SPEED);
  return sin(point.x * WAVE_FREQUENCY_X) * sin(point.y * driftingFrequency) + WAVE_BIAS;
}

float fbm(vec2 point) {
  point *= FBM_INPUT_SCALE;
  mat2 octaveTurn = rotation(patternTime * FBM_SPIN_SPEED);
  float amplitude = 0.5 * uNoiseAmp;
  float sum = 0.0;
  for (int octave = 0; octave < FBM_OCTAVES; octave++) {
    sum += amplitude * wave(point);
    point = octaveTurn * point * FBM_LACUNARITY;
    amplitude *= FBM_GAIN;
  }
  return sum;
}

// Two rounds of domain warping: fbm of a point offset by fbm of itself.
float pattern(vec2 point) {
  mat2 spin = rotation(WARP_SPIN_SPEED * patternTime);
  mat2 tilt = rotation(WARP_TILT);
  vec2 firstWarp = vec2(fbm(point + 1.0), fbm(spin * point + 1.0));
  vec2 secondWarp = vec2(fbm(tilt * firstWarp), fbm(firstWarp));
  return fbm(point + secondWarp);
}

// The classic sin-based hash. Good enough for one random delay per cell.
float cellRandom(vec2 cell) {
  return fract(sin(dot(cell, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  patternTime = uTime * PATTERN_SPEED;
  ivec2 texel = ivec2(gl_FragCoord.xy);
  vec2 cellsPerUnit = uGridMul * CELLS_PER_GRID_UNIT;
  vec2 cellPosition = vec2(texel + uOrigin) / cellsPerUnit;

  float intensity = pattern(cellPosition * PATTERN_ZOOM) * PATTERN_GAIN + PATTERN_BIAS;
  float mouseLift = 0.0;
  float introFlash = 0.0;

  if (uMouseReact) {
    float distanceToMouse = distance(cellPosition, uMouse * uScale);
    mouseLift = exp(-distanceToMouse * MOUSE_FALLOFF) * uMouseStrength * MOUSE_GAIN;
    float ripple = sin(distanceToMouse * MOUSE_RIPPLE_FREQUENCY - uTime * MOUSE_RIPPLE_SPEED);
    intensity += mouseLift + ripple * MOUSE_RIPPLE_AMOUNT * mouseLift;
  }

  if (uPageLoadAnimation) {
    float delay = cellRandom(cellPosition) * INTRO_MAX_DELAY;
    float progress = clamp((uPageLoadProgress - delay) / INTRO_CELL_DURATION, 0.0, 1.0);
    intensity *= smoothstep(0.0, 1.0, progress);
    introFlash = sin(PI * progress) * step(RING_THRESHOLD, intensity);
  }

  vec4 ringsInner = step(vec4(RING_THRESHOLD), intensity - RING_STEPS_INNER);
  vec2 ringsOuter = step(vec2(RING_THRESHOLD), intensity - RING_STEPS_OUTER);
  float level = clamp((intensity - RING_THRESHOLD) / LEVEL_RANGE, 0.0, 1.0);
  float mouseHeat = clamp(mouseLift / MOUSE_HEAT_RANGE, 0.0, 1.0) * uHover;
  float heat = max(mouseHeat, introFlash);

  float keep = uReset ? 0.0 : 1.0;
  vec4 previousRings = texelFetch(uPreviousRings, texel, 0) * keep;
  vec4 previousDetail = texelFetch(uPreviousDetail, texel, 0) * keep;
  // Subtract one 8-bit step too, so a trail reaches zero instead of stalling.
  vec4 fadedRings = max(previousRings * uDecay - ONE_8BIT_STEP, 0.0);
  vec4 fadedDetail = max(previousDetail * uDecay - ONE_8BIT_STEP, 0.0);

  outRings = max(ringsInner, fadedRings);
  outDetail = vec4(
    max(ringsOuter, fadedDetail.xy),
    max(level, fadedDetail.z),
    max(heat, fadedDetail.w)
  );
}
