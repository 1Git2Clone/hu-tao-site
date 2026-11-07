import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import HeadingContent from "./HeadingContent.svelte";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

// Each writeText call waits until the test settles it.
function deferredClipboard() {
  const calls: { text: string; resolve: () => void }[] = [];
  vi.spyOn(navigator.clipboard, "writeText").mockImplementation(
    (text) => new Promise((resolve) => calls.push({ text, resolve })),
  );
  return calls;
}

async function headings() {
  const screen = await render(HeadingContent);
  // By id, the copy target: the icon's ::before glyph is part of the name.
  const get = (id: string) =>
    screen.container.querySelector<HTMLElement>(`h2#${id}`)!;
  return { screen, first: get("first"), second: get("second") };
}

// A DOM click has clientX 0, which is inside the heading's icon padding.
const copied = (heading: HTMLElement) => heading.classList.contains("copied");

test("a repeated copy keeps the check for a full interval", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  const { first } = await headings();
  first.click();
  await vi.advanceTimersByTimeAsync(0);
  expect(copied(first)).toBe(true);
  await vi.advanceTimersByTimeAsync(1000);
  first.click();
  await vi.advanceTimersByTimeAsync(250);
  expect(copied(first)).toBe(true);
  await vi.advanceTimersByTimeAsync(1000);
  expect(copied(first)).toBe(false);
  expect(vi.getTimerCount()).toBe(0);
});

test("only the newest copy shows the check, whatever order the clipboard finishes in", async () => {
  const calls = deferredClipboard();
  const { first, second } = await headings();
  first.click();
  second.click();
  expect(calls.map(({ text }) => new URL(text).hash)).toEqual([
    "#first",
    "#second",
  ]);
  calls[1].resolve();
  await expect.poll(() => copied(second)).toBe(true);
  calls[0].resolve();
  await new Promise((done) => setTimeout(done));
  expect(copied(first)).toBe(false);
  expect(copied(second)).toBe(true);
  first.click();
  calls[2].resolve();
  await expect.poll(() => copied(first)).toBe(true);
  expect(copied(second)).toBe(false);
});

test("a denied clipboard shows no check and the next click still copies", async () => {
  const write = vi
    .spyOn(navigator.clipboard, "writeText")
    .mockRejectedValueOnce(new Error("Denied"))
    .mockResolvedValue();
  const { first } = await headings();
  first.click();
  await new Promise((done) => setTimeout(done));
  expect(copied(first)).toBe(false);
  first.click();
  await expect.poll(() => copied(first)).toBe(true);
  expect(write).toHaveBeenCalledTimes(2);
});

test("unmount clears the check timer and ignores a copy that finishes later", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const calls = deferredClipboard();
  const { screen, first, second } = await headings();
  first.click();
  second.click();
  calls[1].resolve();
  await vi.advanceTimersByTimeAsync(0);
  expect(vi.getTimerCount()).toBe(1);
  await screen.unmount();
  expect(vi.getTimerCount()).toBe(0);
  expect(copied(second)).toBe(false);
  calls[0].resolve();
  await vi.advanceTimersByTimeAsync(0);
  expect(vi.getTimerCount()).toBe(0);
  expect(copied(first)).toBe(false);
});
