import { MAX_CLICKS } from "./settings";

/** Where the pointer is, in 0..1 of the container, y up. */
export interface Pointer {
  x: number;
  y: number;
  inside: boolean;
}

/**
 * The last MAX_CLICKS clicks, as `uClicks` in screen.frag reads them: each is
 * (x, y, start time on the renderer clock, active). New clicks overwrite the
 * oldest.
 */
export class ClickRing {
  readonly data = new Float32Array(MAX_CLICKS * 4);
  #next = 0;

  add(x: number, y: number, now: number) {
    this.data.set([x, y, now, 1], this.#next * 4);
    this.#next = (this.#next + 1) % MAX_CLICKS;
  }

  /** Marks clicks older than `seconds` inactive. True while any stays active. */
  expire(now: number, seconds: number): boolean {
    let anyActive = false;
    for (let k = 0; k < MAX_CLICKS; k++) {
      const start = this.data[k * 4 + 2];
      if (now - start > seconds) this.data[k * 4 + 3] = 0;
      anyActive ||= this.data[k * 4 + 3] > 0;
    }
    return anyActive;
  }
}

/**
 * Follows the pointer across the whole window, not just the container, so the
 * terminal still reacts under content that sits on top of it. Returns a
 * function that stops listening.
 */
export function trackPointer(
  container: HTMLElement,
  pointer: Pointer,
  onMove: () => void,
  onClick: (x: number, y: number) => void,
): () => void {
  const locate = (event: PointerEvent): Pointer => {
    const rect = container.getBoundingClientRect();
    const x = (event.clientX - rect.left) / Math.max(rect.width, 1);
    const y = 1 - (event.clientY - rect.top) / Math.max(rect.height, 1);
    return { x, y, inside: x >= 0 && x <= 1 && y >= 0 && y <= 1 };
  };

  const onPointerMove = (event: PointerEvent) => {
    const next = locate(event);
    const wasInside = pointer.inside;
    pointer.inside = next.inside;
    if (next.inside) {
      pointer.x = next.x;
      pointer.y = next.y;
    }
    if (next.inside || wasInside) onMove();
  };

  const onPointerDown = (event: PointerEvent) => {
    const { x, y, inside } = locate(event);
    if (inside) onClick(x, y);
  };

  const onPointerLeave = () => {
    pointer.inside = false;
    onMove();
  };

  const root = document.documentElement;
  window.addEventListener("pointermove", onPointerMove, { passive: true });
  window.addEventListener("pointerdown", onPointerDown, { passive: true });
  root.addEventListener("pointerleave", onPointerLeave);
  return () => {
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerdown", onPointerDown);
    root.removeEventListener("pointerleave", onPointerLeave);
  };
}
