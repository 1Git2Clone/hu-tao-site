<script lang="ts">
  import { page } from "$app/state";
  import { resolve } from "$app/paths";
  import Card from "$lib/components/layout/Card.svelte";

  const statusMessages: Record<number, string> = {
    301: "Moved Permanently",
    302: "Found",
    304: "Not Modified",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    422: "Unprocessable Entity",
    429: "Too Many Requests",
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
  };

  const statusText =
    statusMessages[page.status] ?? page.error?.message ?? "An error occurred";
  const mdnStatusUrl = `https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/${page.status}`;
</script>

<svelte:head>
  <title>{page.status} — 1Git2Clone</title>
</svelte:head>

<div
  class="flex w-full items-center justify-center"
  style="width: calc(100dvw - 3rem); height: calc(100dvh - 4rem - 6rem - 3rem)"
>
  <Card>
    <div class="flex size-full flex-col text-center">
      <div class="flex flex-1 items-center justify-center">
        <div class="flex flex-col items-center gap-4">
          <img
            src="https://http.cat/{page.status}"
            alt="HTTP {page.status}"
            class="max-h-64 w-auto rounded"
          />
          <h1 class="flex items-center gap-3 text-6xl font-bold">
            {page.status}
            <span class="text-muted-foreground" style="opacity: 0.85">|</span>
            <span
              class="text-muted-foreground text-4xl italic"
              style="opacity: 0.85">{statusText}</span
            >
          </h1>
          {#if page.error?.message && !statusMessages[page.status]}
            <p class="mt-4 text-sm text-subtextcol">{page.error.message}</p>
          {/if}
          <p class="text-muted-foreground mt-2 text-sm italic">
            Click <a
              href={mdnStatusUrl}
              target="_blank"
              rel="noopener noreferrer">here</a
            > for more details
          </p>
        </div>
      </div>

      <div class="flex justify-center gap-8 text-sm">
        <a href={resolve("/")} class="inline-flex items-center gap-1">
          Go home <span aria-hidden="true">→</span>
        </a>
        <a href={resolve("/blogs")} class="inline-flex items-center gap-1">
          Browse blogs <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </Card>
</div>
