import { afterEach, expect, test, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import Terminal from "./Terminal.svelte";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

test("each successful copy keeps feedback for a full interval and unmount clears it", async () => {
  vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
  const write = vi.spyOn(navigator.clipboard, "writeText").mockResolvedValue();
  const screen = await render(Terminal);
  const button = screen.getByRole("button", { name: "Copy a link to Example" });
  // DOM click avoids browser-driver scheduling while the clock is controlled.
  (button.element() as HTMLButtonElement).click();
  await expect.poll(() => button.element().textContent?.trim()).toBe("\uf42e");
  await vi.advanceTimersByTimeAsync(1000);
  (button.element() as HTMLButtonElement).click();
  await vi.advanceTimersByTimeAsync(0);
  expect(write).toHaveBeenLastCalledWith(expect.stringContaining("#example"));
  await vi.advanceTimersByTimeAsync(250);
  expect(button.element().textContent?.trim()).toBe("\uf42e");
  await vi.advanceTimersByTimeAsync(1000);
  expect(button.element().textContent?.trim()).toBe("\uf44c");
  (button.element() as HTMLButtonElement).click();
  await vi.advanceTimersByTimeAsync(0);
  await screen.unmount();
  expect(vi.getTimerCount()).toBe(0);
});

test("clipboard rejection leaves the copy control ready for another attempt", async () => {
  vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
    new Error("Denied"),
  );
  const screen = await render(Terminal);
  const button = screen.getByRole("button", { name: "Copy a link to Example" });
  (button.element() as HTMLButtonElement).click();
  await Promise.resolve();
  expect(button.element().textContent?.trim()).toBe("\uf44c");
});
