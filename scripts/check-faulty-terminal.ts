// Run: node scripts/check-faulty-terminal.ts
// The shaders and the TypeScript that drives them share constants and uniform
// names. glslangValidator checks each shader alone; this checks that both sides
// agree.
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FONT_BITS } from "../src/lib/vendor/faulty-terminal/font.ts";
import {
  CELLS_PER_GRID_UNIT,
  CLICK_EFFECT_CODES,
  GLYPH_STYLE_CODES,
  MAX_CLICKS,
  hexToRgb,
  toSettings,
} from "../src/lib/vendor/faulty-terminal/settings.ts";
import {
  CELL_UNIFORMS,
  SCREEN_UNIFORMS,
} from "../src/lib/vendor/faulty-terminal/uniforms.ts";

const shader = (name: string) =>
  readFileSync(
    new URL(
      `../src/lib/vendor/faulty-terminal/shaders/${name}`,
      import.meta.url,
    ),
    "utf8",
  );
const cells = shader("cells.frag");
const screen = shader("screen.frag");

const constant = (source: string, name: string) => {
  const match = source.match(
    new RegExp(`const (?:int|float) ${name} = ([\\d.]+);`),
  );
  assert.ok(match, `${name} is not declared`);
  return Number(match[1]);
};

const declaredUniforms = (source: string) =>
  [...source.matchAll(/^uniform \w+ (\w+)/gm)].map((match) => match[1]).sort();

// Constants on both sides.
assert.equal(constant(screen, "GLYPH_COUNT"), FONT_BITS.length);
assert.equal(constant(screen, "MAX_CLICKS"), MAX_CLICKS);
assert.equal(constant(screen, "GLYPHS_BLOCKS"), GLYPH_STYLE_CODES.blocks);
assert.equal(constant(screen, "GLYPHS_DOTS"), GLYPH_STYLE_CODES.dots);
assert.equal(
  constant(screen, "GLYPHS_CHARACTERS"),
  GLYPH_STYLE_CODES.characters,
);
assert.equal(constant(screen, "CLICK_NONE"), CLICK_EFFECT_CODES.none);
assert.equal(constant(screen, "CLICK_GLITCH"), CLICK_EFFECT_CODES.glitch);
assert.equal(constant(screen, "CLICK_DEGAUSS"), CLICK_EFFECT_CODES.degauss);
assert.equal(constant(screen, "CELLS_PER_GRID_UNIT"), CELLS_PER_GRID_UNIT);
assert.equal(constant(cells, "CELLS_PER_GRID_UNIT"), CELLS_PER_GRID_UNIT);

// The renderer sets every uniform a shader declares, and nothing else.
assert.deepEqual(declaredUniforms(cells), [...CELL_UNIFORMS].sort());
assert.deepEqual(declaredUniforms(screen), [...SCREEN_UNIFORMS].sort());

// Font: "0" is a ring with a slash, so its top row is .###. (bits 1, 2, 3)
// and its centre pixel (row 2, column 2) is lit.
assert.equal(FONT_BITS[0] & 0b11111, 0b01110);
assert.ok(FONT_BITS[0] & (1 << (2 * 5 + 2)));
// "_" is the bottom row only.
assert.equal(FONT_BITS[FONT_BITS.length - 1], 0b11111 << 20);

// Colours.
assert.deepEqual(hexToRgb("#ff0000"), [1, 0, 0]);
assert.deepEqual(hexToRgb("#0f0"), [0, 1, 0]);
assert.deepEqual(hexToRgb("#642931"), [100 / 255, 41 / 255, 49 / 255]);
assert.deepEqual(hexToRgb("nonsense"), [1, 1, 1]);

// Settings clamp and translate.
const settings = toSettings({ glow: 9, vignette: -1, dither: true });
assert.equal(settings.glow, 3);
assert.equal(settings.vignette, 0);
assert.equal(settings.dither, 1);
assert.equal(settings.cellsX, 2 * CELLS_PER_GRID_UNIT);
assert.equal(toSettings({ clickEffect: "degauss" }).clickSeconds, 1.6);

console.log("faulty-terminal: ok");
