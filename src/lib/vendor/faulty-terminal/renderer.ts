import { FONT_BITS } from "./font";
import {
  createCellTarget,
  deleteCellTarget,
  linkProgram,
  resizeTexture,
} from "./gl";
import { ClickRing, trackPointer, type Pointer } from "./input";
import { CELLS_PER_GRID_UNIT, clamp, type Settings } from "./settings";
import fullscreenVertex from "./shaders/fullscreen.vert?raw";
import cellsFragment from "./shaders/cells.frag?raw";
import screenFragment from "./shaders/screen.frag?raw";
import { CELL_UNIFORMS, SCREEN_UNIFORMS } from "./uniforms";

/** The page-load animation takes this long. */
const INTRO_SECONDS = 2;
/** The frame loop stops after this long with nothing moving. */
const IDLE_SECONDS = 2.5;
/** Frames longer than this count as this long, so a stall does not jump. */
const MAX_FRAME_SECONDS = 1 / 20;
/** How fast the smoothed cursor follows the real one, inside and outside. */
const MOUSE_FOLLOW_SECONDS = 0.2;
const MOUSE_RETURN_SECONDS = 0.6;
const HOVER_FADE_SECONDS = 0.35;
/** Trails fade with a time constant of this plus `persistence` times the range. */
const TRAIL_BASE_SECONDS = 0.08;
const TRAIL_RANGE_SECONDS = 1.4;
/** Columns shrink on screens narrower than this aspect ratio. */
const FULL_COLUMNS_ASPECT = 1.5;
const MAX_DEVICE_PIXEL_RATIO = 2;
const MAX_CELL_TEXTURE_SIZE = 4096;

export interface Renderer {
  /** Takes new settings and makes sure a frame is coming. */
  update(settings: Settings): void;
  destroy(): void;
}

/**
 * Draws the terminal into `canvas`, sized to `container`. Null when WebGL 2 is
 * missing or a shader fails to build; the caller then shows a fallback.
 */
export function createRenderer(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
  initialSettings: Settings,
): Renderer | null {
  const gl = canvas.getContext("webgl2", {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  });
  if (!gl) return null;
  const cellProgram = linkProgram(
    gl,
    fullscreenVertex,
    cellsFragment,
    CELL_UNIFORMS,
  );
  const screenProgram = linkProgram(
    gl,
    fullscreenVertex,
    screenFragment,
    SCREEN_UNIFORMS,
  );
  if (!cellProgram || !screenProgram) return null;
  const cellUniforms = cellProgram.uniforms;
  const screenUniforms = screenProgram.uniforms;
  // The vertex shader makes its own positions, but WebGL 2 still wants a VAO bound.
  const vertexArray = gl.createVertexArray();
  // Ping-pong: each frame reads the previous target and writes the other one.
  const targets = [createCellTarget(gl), createCellTarget(gl)] as const;

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let settings = initialSettings;
  const view = { width: 1, height: 1, columns: 1 };
  // The cells the screen can show, as an offset and size in cells.
  const cells = { x: 0, y: 0, width: 1, height: 1, key: "" };
  const pointer: Pointer = { x: 0.5, y: 0.5, inside: false };
  const mouse = { x: 0.5, y: 0.5 };
  const clicks = new ClickRing();
  let clock = 0;
  let hover = 0;
  let current = 0;
  let reset = true;
  const seed = settings.variation ?? Math.random() * 10;
  let time = seed * 10 * settings.timeScale;
  let introProgress = settings.pageLoadAnimation && !reducedMotion ? 0 : 1;
  let frameRequest = 0;
  let lastFrame = 0;
  let visible = true;
  let idleSeconds = 0;

  const gridMul = () =>
    [
      (settings.cellsX * view.columns) / CELLS_PER_GRID_UNIT,
      settings.cellsY / CELLS_PER_GRID_UNIT,
    ] as const;

  /**
   * Sizes the cell textures to cover what the screen can show, with margin
   * for curvature and glitch shifts. Skips the work when nothing changed.
   */
  const layoutCells = () => {
    const reach = 1 + Math.max(0, settings.curvature) * 2;
    const uvMin = 0.5 - 0.5 * reach;
    const uvMax = 0.5 + 0.5 * reach;
    const margin =
      0.06 *
        Math.max(1, Math.abs(settings.glitchAmount)) *
        Math.max(1, Math.abs(settings.flickerAmount)) +
      0.2;
    const cellsX = settings.cellsX * view.columns;
    const cellsY = settings.cellsY;
    const x0 = Math.floor((uvMin * settings.scale - margin) * cellsX) - 2;
    const x1 = Math.floor((uvMax * settings.scale + margin) * cellsX) + 2;
    const y0 = Math.floor((uvMin * settings.scale - margin) * cellsY) - 2;
    const y1 = Math.floor((uvMax * settings.scale + margin) * cellsY) + 2;
    const key = `${x0}:${x1}:${y0}:${y1}`;
    if (key === cells.key) return;
    cells.key = key;
    cells.x = x0;
    cells.y = y0;
    cells.width = clamp(x1 - x0 + 1, 1, MAX_CELL_TEXTURE_SIZE);
    cells.height = clamp(y1 - y0 + 1, 1, MAX_CELL_TEXTURE_SIZE);
    for (const target of targets) {
      resizeTexture(gl, target.rings, cells.width, cells.height);
      resizeTexture(gl, target.detail, cells.width, cells.height);
    }
    reset = true;
  };

  const stepCells = (decay: number) => {
    const source = targets[current];
    const target = targets[1 - current];
    const u = cellUniforms;
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
    gl.drawBuffers([gl.COLOR_ATTACHMENT0, gl.COLOR_ATTACHMENT1]);
    gl.viewport(0, 0, cells.width, cells.height);
    gl.disable(gl.BLEND);
    gl.useProgram(cellProgram.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, source.rings);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, source.detail);
    gl.uniform1i(u.uPreviousRings, 0);
    gl.uniform1i(u.uPreviousDetail, 1);
    gl.uniform1f(u.uTime, time);
    gl.uniform2f(u.uGridMul, ...gridMul());
    gl.uniform1f(u.uNoiseAmp, settings.noiseAmp);
    gl.uniform1f(u.uScale, settings.scale);
    gl.uniform2i(u.uOrigin, cells.x, cells.y);
    gl.uniform1i(u.uMouseReact, Number(settings.mouseReact));
    gl.uniform2f(u.uMouse, mouse.x, mouse.y);
    gl.uniform1f(u.uMouseStrength, settings.mouseStrength);
    gl.uniform1f(u.uHover, hover);
    gl.uniform1i(u.uPageLoadAnimation, Number(settings.pageLoadAnimation));
    gl.uniform1f(u.uPageLoadProgress, introProgress);
    gl.uniform1f(u.uDecay, decay);
    gl.uniform1i(u.uReset, Number(reset));
    gl.bindVertexArray(vertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    current = 1 - current;
    reset = false;
  };

  const drawScreen = () => {
    const source = targets[current];
    const u = screenUniforms;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(screenProgram.program);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, source.rings);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, source.detail);
    gl.uniform1i(u.uRings, 0);
    gl.uniform1i(u.uDetail, 1);
    gl.uniform1f(u.uTime, time);
    gl.uniform1f(u.uClock, clock);
    gl.uniform3f(
      u.uResolution,
      canvas.width,
      canvas.height,
      canvas.width / canvas.height,
    );
    gl.uniform1f(u.uScale, settings.scale);
    gl.uniform2f(u.uGridMul, ...gridMul());
    gl.uniform1f(u.uDigitSize, settings.digitSize);
    gl.uniform1f(u.uScanlineIntensity, settings.scanlineIntensity);
    gl.uniform1f(u.uGlitchAmount, reducedMotion ? 0 : settings.glitchAmount);
    gl.uniform1f(u.uFlickerAmount, reducedMotion ? 0 : settings.flickerAmount);
    gl.uniform1f(u.uChromaticAberration, settings.chromaticAberration);
    gl.uniform1f(u.uDither, settings.dither);
    gl.uniform1f(u.uCurvature, settings.curvature);
    gl.uniform3fv(u.uTint, settings.tint);
    gl.uniform1f(u.uBrightness, settings.brightness);
    gl.uniform1i(u.uLightMode, Number(settings.lightMode));
    gl.uniform1i(u.uGlyphs, settings.glyphs);
    gl.uniform1f(u.uGlow, settings.glow);
    gl.uniform1f(u.uScramble, settings.scramble);
    gl.uniform1f(u.uMouseGlow, settings.mouseGlow);
    gl.uniform1f(u.uVignette, settings.vignette);
    gl.uniform1uiv(u.uFont, FONT_BITS);
    gl.uniform2i(u.uOrigin, cells.x, cells.y);
    gl.uniform2i(u.uCellCount, cells.width, cells.height);
    gl.uniform4fv(u.uClicks, clicks.data);
    gl.uniform1i(u.uClickMode, settings.clickEffect);
    gl.uniform1f(u.uClickSeconds, settings.clickSeconds);
    gl.bindVertexArray(vertexArray);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
  };

  const resize = () => {
    view.width = Math.max(1, container.clientWidth);
    view.height = Math.max(1, container.clientHeight);
    view.columns = Math.min(1, view.width / view.height / FULL_COLUMNS_ASPECT);
    const ratio = Math.min(
      settings.dpr || window.devicePixelRatio || 1,
      MAX_DEVICE_PIXEL_RATIO,
    );
    canvas.width = Math.max(1, Math.round(view.width * ratio));
    canvas.height = Math.max(1, Math.round(view.height * ratio));
    layoutCells();
    stepCells(0);
    drawScreen();
    wake();
  };

  const frame = (now: number) => {
    frameRequest = 0;
    if (!visible || document.hidden) return;
    const seconds = lastFrame
      ? clamp((now - lastFrame) / 1000, 0.001, MAX_FRAME_SECONDS)
      : 1 / 60;
    lastFrame = now;
    clock += seconds;
    const animating = !settings.pause && !reducedMotion;
    if (animating) time += seconds * settings.timeScale;

    const targetX = pointer.inside ? pointer.x : 0.5;
    const targetY = pointer.inside ? pointer.y : 0.5;
    const follow =
      1 -
      Math.exp(
        -seconds /
          (pointer.inside ? MOUSE_FOLLOW_SECONDS : MOUSE_RETURN_SECONDS),
      );
    mouse.x += (targetX - mouse.x) * follow;
    mouse.y += (targetY - mouse.y) * follow;
    const hoverTarget = pointer.inside ? 1 : 0;
    hover +=
      (hoverTarget - hover) * (1 - Math.exp(-seconds / HOVER_FADE_SECONDS));
    const clicking = clicks.expire(clock, settings.clickSeconds);

    layoutCells();
    const trailSeconds =
      TRAIL_BASE_SECONDS + settings.persistence * TRAIL_RANGE_SECONDS;
    stepCells(settings.persistence > 0 ? Math.exp(-seconds / trailSeconds) : 0);
    drawScreen();
    if (introProgress < 1) {
      introProgress = Math.min(1, introProgress + seconds / INTRO_SECONDS);
    }

    const busy =
      animating ||
      introProgress < 1 ||
      clicking ||
      Math.abs(targetX - mouse.x) + Math.abs(targetY - mouse.y) > 0.0001 ||
      Math.abs(hoverTarget - hover) > 0.001;
    idleSeconds = busy ? 0 : idleSeconds + seconds;
    if (idleSeconds < IDLE_SECONDS) frameRequest = requestAnimationFrame(frame);
  };

  const wake = () => {
    idleSeconds = 0;
    if (!frameRequest && visible && !document.hidden) {
      lastFrame = 0;
      frameRequest = requestAnimationFrame(frame);
    }
  };

  const stopTracking = trackPointer(container, pointer, wake, (x, y) => {
    if (reducedMotion || !settings.clickEffect) return;
    clicks.add(x, y, clock);
    wake();
  });
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  const intersectionObserver = new IntersectionObserver((entries) => {
    visible = entries.some((entry) => entry.isIntersecting);
    if (visible) wake();
  });
  intersectionObserver.observe(container);
  document.addEventListener("visibilitychange", wake);
  resize();

  return {
    update(next) {
      settings = next;
      wake();
    },
    destroy() {
      cancelAnimationFrame(frameRequest);
      stopTracking();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", wake);
      for (const target of targets) deleteCellTarget(gl, target);
      gl.deleteVertexArray(vertexArray);
      gl.deleteProgram(cellProgram.program);
      gl.deleteProgram(screenProgram.program);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
