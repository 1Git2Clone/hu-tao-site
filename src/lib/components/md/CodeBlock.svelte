<script lang="ts">
  let { children, lang } = $props();

  let copied = $state(false);
  let codeElement: HTMLElement | undefined = $state();

  let detectedLang = $derived(lang || "javascript");

  function copy() {
    const text = codeElement?.textContent || "";
    navigator.clipboard.writeText(text);
    copied = true;
    setTimeout(() => (copied = false), 1250);
  }
</script>

<div
  class="group border-border relative my-6 w-full min-w-0 overflow-hidden border border-frame bg-black/50 text-sm"
>
  <div
    class="flex items-center justify-between border-b border-frame bg-muted/50 px-4 py-2"
  >
    <span class="font-mono font-bold text-textcol">{detectedLang}</span>
    <button
      onclick={copy}
      class="size-8 text-xs transition-colors hover:text-accent"
    >
      <span class="translate-x[-50%] absolute translate-y-[-50%]">
        {copied ? " " : " "}
      </span>
    </button>
  </div>
  <div class="not-prose">{@render children?.()}</div>
</div>
