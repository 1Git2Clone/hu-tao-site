<script lang="ts">
  import { resolve } from "$app/paths";
  import Term from "$lib/components/layout/Term.svelte";
  import { SKILLS } from "$lib/content/root/skills";
  import { TECH_URLS } from "$lib/content/root/tech";
  import { EMAIL, GITHUB_PROFILE_NAME } from "$lib/utils/consts";

  const FORGEJO_URL = "https://git.hu-tao.dev/hutao";
  const GITHUB_URL = `https://github.com/${GITHUB_PROFILE_NAME}`;
</script>

<div class="space-y-8">
  <Term
    label="1Git2Clone"
    level={1}
    id="title"
    path="~"
    cmd="whoami"
    cursor
    hero
  >
    <div class="prose min-w-full dark:prose-invert">
      <p class="mt-0 text-sm text-subtextcol italic">
        A dev with the horrible habit of “doing it myself”.
      </p>
      <p>
        By day, Junior AI Dev at a fintech: LLM integrations and Go/AWS data
        flows. Everything below is what happens when nobody's paying me to.
      </p>
      <div class="not-prose mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
        <a href={FORGEJO_URL} target="_blank" rel="noopener noreferrer">
           git.hu-tao.dev</a
        >
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
           github.com/{GITHUB_PROFILE_NAME}</a
        >
        <a href={resolve("/infra")}>Infra <span aria-hidden="true">→</span></a>
        <a href={resolve("/blogs")}>Blogs <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </Term>

  <Term label="Projects" id="projects" path="~/projects" cmd="ls -l">
    <!-- ls -l without the permissions column: name, then what it is. -->
    <dl
      class="grid gap-x-8 gap-y-1 text-sm sm:grid-cols-[max-content_1fr] sm:gap-y-3"
    >
      <dt>
        <a
          href="https://git.hu-tao.dev/hutao/vps"
          target="_blank"
          rel="noopener noreferrer">VPS flake</a
        >
      </dt>
      <dd class="mb-3 sm:mb-0">
        Everything in <a href={resolve("/infra")}>Infra</a>. 14 services, 3
        trust boundaries, 0 manual steps
      </dd>
      <dt>
        <a
          href="https://git.hu-tao.dev/hutao/serenity-discord-bot"
          target="_blank"
          rel="noopener noreferrer">Serenity Discord bot</a
        >
      </dt>
      <dd class="mb-3 sm:mb-0">
        Rust · Serenity/Poise · Postgres · Redis · tokio-console
      </dd>
      <dt>
        <a
          href="https://github.com/rust-random/rand/pulls?q=is%3Apr+by%3A1Git2Clone"
          target="_blank"
          rel="noopener noreferrer">rust-random/rand</a
        >
      </dt>
      <dd class="mb-3 sm:mb-0">
        Contributions to <em>the</em> random number generation library for Rust,
        as a
        <a
          href="/images/random-kid-pr.webp"
          target="_blank"
          rel="noopener noreferrer">random kid</a
        >
      </dd>
      <dt>
        <a
          href="https://git.hu-tao.dev/skavex/skavex"
          target="_blank"
          rel="noopener noreferrer">skavex</a
        >
      </dt>
      <dd class="mb-3 sm:mb-0">
        The Markdown + LaTeX + Svelte preprocessor behind
        <a href={resolve("/blogs")}>this site's blogs</a>
      </dd>
      <dt>
        <a
          href="https://git.hu-tao.dev/hutao/hu-tao-dev"
          target="_blank"
          rel="noopener noreferrer">hu-tao.dev</a
        >
      </dt>
      <dd class="mb-3 sm:mb-0">
        SvelteKit 2 · Svelte 5 · Tailwind v4 · skavex. You're looking at it.
      </dd>
    </dl>
  </Term>

  <Term
    label="Infrastructure"
    id="infrastructure"
    path="~/infra"
    cmd="cat README.md"
  >
    <div class="prose min-w-full dark:prose-invert">
      <p class="mt-0">
        One VPS, described end to end in a single NixOS flake — disks, firewall,
        secrets, and every container service. Git hosting, music, search, a
        status page, and the observability to notice when any of them fall over.
      </p>
      <blockquote>
        <p>
          Forgejo, because of <a
            href="https://github.blog/news-insights/company-news/github-availability-report-april-2026/"
            target="_blank"
            rel="noopener noreferrer">GitHub's incredible reliability</a
          >.
        </p>
      </blockquote>
      <p class="mb-0">
        <a href={resolve("/infra")}
          >Read more <span aria-hidden="true">→</span></a
        >
      </p>
    </div>
  </Term>

  <Term
    label="Stuff I Reach For"
    id="skills"
    path="~"
    cmd="cat stuff-i-reach-for.txt"
  >
    <p class="mt-0 mb-6">
      The day job covers the Go and AWS parts. The rest is the “doing it myself”
      habit.
    </p>

    <dl class="space-y-4">
      {#each SKILLS as { group, items } (group)}
        <div class="sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt class="text-sm font-semibold text-subtextcol sm:py-1">{group}</dt>
          <dd class="mt-2 ml-0 sm:mt-0">
            <ul class="flex flex-wrap gap-2">
              {#each items as item (item)}
                {@const tech = TECH_URLS[item]}
                <li class="card inline-block px-2 py-1 text-sm">
                  <a
                    href={tech.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={tech.ariaLabel || String(item)}
                    style="border: 0;"
                  >
                    {item}
                  </a>
                </li>
              {/each}
            </ul>
          </dd>
        </div>
      {/each}
    </dl>
  </Term>

  <Term label="Writing" id="writing" path="~" cmd="ls writing/">
    <div class="prose min-w-full dark:prose-invert">
      <p class="mt-0">
        Algorithms, Linux, tooling, and the parts of software that become
        clearer when you explain them.
      </p>
      <ul class="mb-0">
        <li><a href={resolve("/blogs")}>Blogs</a></li>
        <li><a href={resolve("/journey")}>Linux journey</a></li>
      </ul>
    </div>
  </Term>

  <Term label="Contact" id="contact" path="~" cmd="echo $EMAIL">
    <a href="mailto:{EMAIL}">{EMAIL}</a>
  </Term>
</div>
