import { SvelteURL } from "svelte/reactivity";

// Test boundary for Kit's router. The component still uses real Svelte URL
// reactivity; tests can deliver the same URL changes as popstate/navigation.
export const page = $state({ url: new SvelteURL("http://localhost/blogs") });
