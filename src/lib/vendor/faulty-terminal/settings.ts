/** What each cell draws: lit squares, round LED dots, or changing characters. */
export type GlyphStyle = "blocks" | "dots" | "characters";
/** What a click does: tear the screen into bands, send a degauss wave, or nothing. */
export type ClickEffect = "glitch" | "degauss" | "none";

/** The look of the terminal. Every field is optional; see `DEFAULT_OPTIONS`. */
export interface TerminalOptions {
  /** Zoom of the pattern. Higher shows more, smaller glyphs. */
  scale: number;
  /** Glyph density across and down, multiplied with `scale`. */
  gridMul: readonly [number, number];
  /** Space around each glyph. 1 packs them edge to edge. */
  digitSize: number;
  /** Speed of the animation. */
  timeScale: number;
  /** Freezes the animation. The cursor still lights up glyphs. */
  pause: boolean;
  scanlineIntensity: number;
  /** How far the faulty bands of the screen shift sideways. */
  glitchAmount: number;
  /** How often the faulty bands appear. */
  flickerAmount: number;
  /** Strength of the pattern that decides which glyphs light up. */
  noiseAmp: number;
  /** Splits the red and blue channels apart, in pixels. */
  chromaticAberration: number;
  /** Noise that smooths colour banding. `true` is 1. */
  dither: number | boolean;
  /** Bulge of the screen, like the glass of an old tube. */
  curvature: number;
  /** Phosphor colour as `#rgb` or `#rrggbb`. */
  tint: string;
  /** Lights up the glyphs around the cursor. */
  mouseReact: boolean;
  mouseStrength: number;
  /** Switches the glyphs on one by one on mount. */
  pageLoadAnimation: boolean;
  brightness: number;
  glyphs: GlyphStyle;
  /** Phosphor bloom around the glyphs. */
  glow: number;
  /** How long glyphs keep glowing after they switch off. */
  persistence: number;
  /** How fast characters change near the cursor. */
  scramble: number;
  /** How much the glyphs under the cursor heat up toward white. */
  mouseGlow: number;
  /** Darkens the edges of the screen. */
  vignette: number;
  clickEffect: ClickEffect;
  /** Fixed pattern seed. Leave it out for a random one on each mount. */
  variation: number | undefined;
  /** Prints the glyphs as ink on a light page. */
  lightMode: boolean;
  /** Device pixel ratio. Capped at 2. Leave it out for the screen's own. */
  dpr: number | undefined;
}

export const DEFAULT_OPTIONS: TerminalOptions = {
  scale: 1,
  gridMul: [2, 1],
  digitSize: 1.5,
  timeScale: 0.3,
  pause: false,
  scanlineIntensity: 0.3,
  glitchAmount: 1,
  flickerAmount: 1,
  noiseAmp: 1,
  chromaticAberration: 0,
  dither: 0,
  curvature: 0.2,
  tint: "#ffffff",
  mouseReact: true,
  mouseStrength: 0.2,
  pageLoadAnimation: true,
  brightness: 1,
  glyphs: "blocks",
  glow: 0.5,
  persistence: 0.5,
  scramble: 0.5,
  mouseGlow: 0.6,
  vignette: 0.25,
  clickEffect: "glitch",
  variation: undefined,
  lightMode: false,
  dpr: undefined,
};

// The shader side of these lives in screen.frag. scripts/checks/faulty-terminal.ts
// checks that both sides agree.
export const MAX_CLICKS = 4;
export const GLYPH_STYLE_CODES: Record<GlyphStyle, number> = {
  blocks: 0,
  dots: 1,
  characters: 2,
};
export const CLICK_EFFECT_CODES: Record<ClickEffect, number> = {
  none: 0,
  glitch: 1,
  degauss: 2,
};
const CLICK_EFFECT_SECONDS: Record<ClickEffect, number> = {
  none: 1,
  glitch: 0.7,
  degauss: 1.6,
};

/** `uGridMul` is in units of this many cells. Matches CELLS_PER_GRID_UNIT. */
export const CELLS_PER_GRID_UNIT = 15;

/** Options after clamping, in the form the renderer uploads. */
export interface Settings extends Omit<
  TerminalOptions,
  "gridMul" | "dither" | "tint" | "glyphs" | "clickEffect"
> {
  /** Cells per unit of screen, across and down. */
  cellsX: number;
  cellsY: number;
  dither: number;
  tint: [number, number, number];
  glyphs: number;
  clickEffect: number;
  clickSeconds: number;
}

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

/** `#rgb`, `#rgba`, `#rrggbb` or `#rrggbbaa` to 0..1 channels. Alpha is dropped. */
export function hexToRgb(hex: string): [number, number, number] {
  let digits = hex.replace("#", "").trim();
  if (digits.length === 3 || digits.length === 4) {
    digits = digits.slice(0, 3).replace(/./g, "$&$&");
  }
  const value = parseInt(digits.slice(0, 6), 16);
  if (Number.isNaN(value)) return [1, 1, 1];
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255].map(
    (channel) => channel / 255,
  ) as [number, number, number];
}

export function toSettings(options: Partial<TerminalOptions>): Settings {
  const o = { ...DEFAULT_OPTIONS, ...options };
  return {
    ...o,
    scale: Math.max(0.05, o.scale),
    cellsX: Math.max(0.1, o.gridMul[0] * CELLS_PER_GRID_UNIT),
    cellsY: Math.max(0.1, o.gridMul[1] * CELLS_PER_GRID_UNIT),
    dither: typeof o.dither === "boolean" ? Number(o.dither) : o.dither,
    tint: hexToRgb(o.tint),
    glyphs: GLYPH_STYLE_CODES[o.glyphs],
    glow: clamp(o.glow, 0, 3),
    persistence: clamp(o.persistence, 0, 1),
    scramble: clamp(o.scramble, 0, 1),
    mouseGlow: clamp(o.mouseGlow, 0, 1),
    vignette: clamp(o.vignette, 0, 1),
    clickEffect: CLICK_EFFECT_CODES[o.clickEffect],
    clickSeconds: CLICK_EFFECT_SECONDS[o.clickEffect],
  };
}
