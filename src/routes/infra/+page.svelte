<script lang="ts">
  import HeadingCopy from "$lib/components/HeadingCopy.svelte";
  import ForceOverview from "$lib/components/infra/ForceOverview.svelte";
  import { INFRA_STACK } from "$lib/content/infra/services";

  const SOURCE_URL = "https://git.hu-tao.dev/hutao/vps";

  let { data } = $props();
</script>

<div class="space-y-8">
  <!-- "Infrastructure" is one long word in a monospace font: smaller on phones, and on the
	     narrowest it wraps rather than widen the page. -->
  <section
    class="border-border box-gradient hero prose min-w-full rounded-lg border p-6 sm:p-8 dark:prose-invert"
  >
    <h1
      id="title"
      class="mt-0 text-3xl font-bold tracking-tight wrap-anywhere sm:text-4xl"
    >
      Infrastructure
    </h1>
    <p class="text-lg text-subtextcol">
      One VPS, described end to end in a single NixOS flake — disks, firewall,
      secrets, and every container service.
    </p>
    <p>
      There is no state on the server that the repository does not describe, and
      nothing to remember to run. Where the setup it replaced needed three
      layers — a restart policy, a boot-time sweep, and a converge run from my
      workstation — this is one: systemd units built from the flake. OpenTofu
      creates the machine and publishes its DNS.
    </p>
    <p class="mb-0">
      <a href={SOURCE_URL} target="_blank" rel="noopener noreferrer">
        Read the flake <span aria-hidden="true">→</span>
      </a>
    </p>
  </section>

  <section class="border-border box-gradient rounded-lg border p-4">
    <ul class="flex flex-wrap justify-center gap-2">
      {#each INFRA_STACK as tech (tech.name)}
        <li
          class="border-border card inline-block rounded border px-2 py-1 text-sm"
        >
          <a
            href={tech.url}
            target="_blank"
            rel="noopener noreferrer"
            style="border: 0;"
          >
            {tech.name}
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <section
    id="overview"
    class="border-border box-gradient scroll-mt-(--scroll-offset) rounded-lg border p-4 md:p-8"
  >
    <HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
      <h2 id="overview-heading" class="mt-0">Overview</h2>
      <p class="mb-0">
        Tap or click a box for what it does. With a mouse, drag them around.
      </p>
    </HeadingCopy>

    <ForceOverview graph={data.graph} {...data.overview} />
  </section>

  <section
    id="public"
    class="border-border box-gradient scroll-mt-(--scroll-offset) rounded-lg border p-8"
  >
    <HeadingCopy class="prose min-w-full dark:prose-invert">
      <h2 id="public-heading" class="mt-0">Public</h2>
      <p>
        Reachable from anywhere, behind one reverse proxy and one certificate.
      </p>
      {@html data.services.public}
    </HeadingCopy>
  </section>

  <section
    id="private"
    class="border-border box-gradient scroll-mt-(--scroll-offset) rounded-lg border p-8"
  >
    <HeadingCopy class="prose min-w-full dark:prose-invert">
      <h2 id="private-heading" class="mt-0">Also Running</h2>
      <p>
        Private, or mine rather than yours. Listed because they are part of the
        same flake, not linked because there is nothing useful for a visitor
        behind them.
      </p>
      {@html data.services.private}
    </HeadingCopy>
  </section>
</div>
