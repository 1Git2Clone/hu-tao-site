# Faulty Terminal

A flickering CRT terminal of glowing glyphs, drawn with WebGL 2.

## Source and license

Ported from the `FaultyTerminal` component of
[React Bits](https://github.com/DavidHDev/react-bits) by David Haz, at commit
[`4dc7b5b`](https://github.com/DavidHDev/react-bits/commit/4dc7b5b7772e1217c8fb8d2a7aa074302180e5b4)
(2026-10-31). Upstream path: `src/ts-tailwind/Backgrounds/FaultyTerminal/FaultyTerminal.tsx`.

This folder is under upstream's **MIT + Commons Clause** license, copied as is
in [`LICENSE.md`](LICENSE.md). The rest of this repository is MIT. The Commons
Clause forbids selling or redistributing the component on its own, including as
a port. It may be used as part of a site, as here.

## Changes from upstream

- The React component is a Svelte 5 component. Props follow upstream, except
  `className` and `style`, which are a plain `class` prop.
- The shaders live in `shaders/` as `.vert` and `.frag` files, which CI checks
  with `glslangValidator`. The pattern noise, which only the cell pass uses, is
  inlined into `cells.frag`.
- Magic numbers in the shaders are named constants. Single-letter variables have
  names.
- The character font is a uniform built from `font.ts`, not a constant array
  built into the shader source.
- `onunsupported` is called when WebGL 2 or a shader is missing, so the page can
  show a fallback.
- `pow(x, 2.0)` in the degauss wave is `x * x`. `pow` is undefined for negative
  `x` in GLSL.

## Files

| File                      | What it does                                       |
| ------------------------- | -------------------------------------------------- |
| `FaultyTerminal.svelte`   | The component: props, mount, and settings updates. |
| `settings.ts`             | Option types, defaults, and clamping.              |
| `renderer.ts`             | The WebGL 2 setup and the frame loop.              |
| `gl.ts`                   | Shader, texture, and framebuffer helpers.          |
| `input.ts`                | Pointer tracking and the click ring.               |
| `font.ts`                 | The 5 by 5 glyphs of the `characters` style.       |
| `uniforms.ts`             | The uniforms each program sets.                    |
| `shaders/fullscreen.vert` | One triangle over the whole screen.                |
| `shaders/cells.frag`      | Which cells are lit, with phosphor trails.         |
| `shaders/screen.frag`     | The glyphs and the CRT effects.                    |
