import { SvelteURL } from "svelte/reactivity";
import { page } from "./app-state.svelte";

export const navigations: string[] = [];
export const navigationOptions: {
  keepFocus?: boolean;
  noScroll?: boolean;
  replaceState?: boolean;
}[] = [];
export const pendingNavigations: { complete: () => void; abort: () => void }[] =
  [];
export let deferNavigation = false;
export const beforeNavigations: ((navigation: {
  to: { url: URL } | null;
  complete: Promise<void>;
  willUnload?: boolean;
}) => void)[] = [];
export function beforeNavigate(
  callback: (navigation: {
    to: { url: URL } | null;
    complete: Promise<void>;
    willUnload?: boolean;
  }) => void,
) {
  beforeNavigations.push(callback);
}
export function setDeferred(value: boolean) {
  deferNavigation = value;
}
export function replaceState(url: string) {
  page.url = new SvelteURL(url, page.url);
}
export async function goto(url: string, options = {}) {
  navigations.push(url);
  navigationOptions.push(options);
  if (deferNavigation) {
    await new Promise<void>((resolve, reject) =>
      pendingNavigations.push({
        complete: resolve,
        abort: () => reject(new Error("Navigation cancelled")),
      }),
    );
  }
  page.url = new SvelteURL(url, page.url);
}
