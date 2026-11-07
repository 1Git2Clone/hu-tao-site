import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Theme from "./Theme.svelte";

afterEach(() => {
  vi.restoreAllMocks();
  localStorage.clear();
  document.documentElement.classList.remove("dark", "theme-ripple");
});

test("only the newest ripple owns cleanup, including rejection and unmount", async () => {
  const pending: {
    finish: () => void;
    reject: (error: Error) => void;
    skip: ReturnType<typeof vi.fn>;
  }[] = [];
  vi.spyOn(document, "startViewTransition").mockImplementation((callback) => {
    const finished = new Promise<void>((finish, reject) => {
      pending.push({ finish, reject, skip: vi.fn() });
    });
    (callback as () => void)();
    return {
      finished,
      ready: Promise.reject(new DOMException("Snapshot skipped", "AbortError")),
      updateCallbackDone: Promise.resolve(),
      skipTransition: pending.at(-1)!.skip,
      types: new Set<string>(),
    } as ViewTransition;
  });
  const screen = await render(Theme);
  const button = screen
    .getByRole("button", { name: "Toggle theme" })
    .element() as HTMLButtonElement;
  button.click();
  button.click();
  for (const icon of button.firstElementChild!.children) {
    const fades = icon
      .getAnimations()
      .filter((animation) => animation.playState !== "finished");
    expect(fades).toHaveLength(1);
    const frames = (fades[0].effect as KeyframeEffect).getKeyframes();
    const finalOpacity = frames.at(-1)!.opacity;
    // Cancel to read the class-selected target without the running fade.
    fades[0].cancel();
    expect(String(finalOpacity)).toBe(getComputedStyle(icon).opacity);
  }
  expect(pending).toHaveLength(2);
  pending[0].finish();
  await Promise.resolve();
  expect(document.documentElement.classList.contains("theme-ripple")).toBe(
    true,
  );
  pending[1].reject(new Error("Snapshot failed"));
  await Promise.resolve();
  expect(document.documentElement.classList.contains("theme-ripple")).toBe(
    false,
  );
  button.click();
  await screen.unmount();
  expect(pending[2].skip).toHaveBeenCalledOnce();
  expect(document.documentElement.classList.contains("theme-ripple")).toBe(
    false,
  );
  pending[2].finish();
});

test("a skipped snapshot callback cannot change the theme after unmount", async () => {
  let update: (() => void) | undefined;
  let finish: (() => void) | undefined;
  vi.spyOn(document, "startViewTransition").mockImplementation((callback) => {
    update = callback as () => void;
    return {
      finished: new Promise<void>((resolve) => (finish = resolve)),
      ready: Promise.resolve(),
      updateCallbackDone: Promise.resolve(),
      skipTransition: vi.fn(),
      types: new Set<string>(),
    } as ViewTransition;
  });
  const screen = await render(Theme);
  const dark = document.documentElement.classList.contains("dark");
  (
    screen
      .getByRole("button", { name: "Toggle theme" })
      .element() as HTMLButtonElement
  ).click();
  await screen.unmount();
  update!();
  finish!();
  await Promise.resolve();
  expect(document.documentElement.classList.contains("dark")).toBe(dark);
  expect(document.documentElement.classList.contains("theme-ripple")).toBe(
    false,
  );
});
