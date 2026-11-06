<script lang="ts">
  import Term from "$lib/components/layout/Term.svelte";
  import ForceOverview from "$lib/components/infra/ForceOverview.svelte";
  import { INFRA_STACK } from "$lib/content/infra/services";

  const SOURCE_URL = "https://git.hu-tao.dev/hutao/vps";

  let { data } = $props();
</script>

<div class="mx-auto w-full max-w-4xl space-y-8">
  <Term
    label="Infrastructure"
    level={1}
    id="title"
    path="~/infra"
    cmd="cat README.md"
    cursor
    hero
    bodyClass="prose min-w-full px-4 pt-4 pb-6 sm:px-8 dark:prose-invert"
  >
    <p class="mt-0 text-lg text-subtextcol">
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
  </Term>

  <Term label="Stack" id="stack" path="~/infra" cmd="ls stack/">
    <ul class="flex flex-wrap justify-center gap-2">
      {#each INFRA_STACK as tech (tech.name)}
        <li class="card inline-block px-2 py-1 text-sm">
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
  </Term>

  <Term label="Overview" id="overview" path="~/infra" cmd="tree">
    <p class="mt-0 mb-6">
      Tap or click a box for what it does. With a mouse, drag them around.
    </p>

    <ForceOverview graph={data.graph} {...data.overview} />
  </Term>

  <Term
    label="Public"
    id="public"
    path="~/infra"
    cmd="ls public/"
    bodyClass="prose min-w-full px-4 pt-4 pb-6 sm:px-8 dark:prose-invert"
  >
    <p class="mt-0">
      Reachable from anywhere, behind one reverse proxy and one certificate.
    </p>
    {@html data.services.public}
  </Term>

  <Term
    label="Also Running"
    id="private"
    path="~/infra"
    cmd="ls private/"
    bodyClass="prose min-w-full px-4 pt-4 pb-6 sm:px-8 dark:prose-invert"
  >
    <p class="mt-0">
      Private, or mine rather than yours. Listed because they are part of the
      same flake, not linked because there is nothing useful for a visitor
      behind them.
    </p>
    {@html data.services.private}
  </Term>
</div>
