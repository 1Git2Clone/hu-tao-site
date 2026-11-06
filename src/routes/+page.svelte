<script lang="ts">
  import { resolve } from "$app/paths";
  import HeadingCopy from "$lib/components/HeadingCopy.svelte";
  import { SKILLS } from "$lib/content/root/skills";
  import { TECH_URLS } from "$lib/content/root/tech";
  import { EMAIL, GITHUB_PROFILE_NAME } from "$lib/utils/consts";

  const FORGEJO_URL = "https://git.hu-tao.dev/hutao";
  const GITHUB_URL = `https://github.com/${GITHUB_PROFILE_NAME}`;
</script>

<div class="space-y-8">
  <section
    class="border-border box-gradient hero prose min-w-full rounded-lg border p-8 dark:prose-invert"
  >
    <h1 id="title" class="mb-2 text-center text-4xl font-bold tracking-tight">
      1Git2Clone
    </h1>
    <p class="mt-0 text-center text-sm text-subtextcol italic">
      A dev with the horrible habit of “doing it myself”.
    </p>
    <p>
      By day, Junior AI Dev at a fintech: LLM integrations and Go/AWS data
      flows. Everything below is what happens when nobody's paying me to.
    </p>
    <div class="not-prose mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
      <a href={FORGEJO_URL} target="_blank" rel="noopener noreferrer"
        > git.hu-tao.dev</a
      >
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer"
        > github.com/{GITHUB_PROFILE_NAME}</a
      >
      <a href={resolve("/infra")}>Infra <span aria-hidden="true">→</span></a>
      <a href={resolve("/blogs")}>Blogs <span aria-hidden="true">→</span></a>
    </div>
  </section>

  <section class="border-border box-gradient rounded-lg border p-8">
    <HeadingCopy class="prose min-w-full dark:prose-invert">
      <h2 id="projects" class="mt-0">Projects</h2>
      <p>A few of the more notable ones:</p>
      <table>
        <thead>
          <tr><th>Project</th><th>What it is</th></tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <a
                href="https://git.hu-tao.dev/hutao/vps"
                target="_blank"
                rel="noopener noreferrer"><strong>VPS flake</strong></a
              >
            </td>
            <td>
              Everything in <a href={resolve("/infra")}>Infra</a>. 14 services,
              3 trust boundaries, 0 manual steps
            </td>
          </tr>
          <tr>
            <td>
              <a
                href="https://git.hu-tao.dev/hutao/serenity-discord-bot"
                target="_blank"
                rel="noopener noreferrer"
                ><strong>Serenity Discord bot</strong></a
              >
            </td>
            <td>Rust · Serenity/Poise · Postgres · Redis · tokio-console</td>
          </tr>
          <tr>
            <td>
              <a
                href="https://github.com/rust-random/rand/pulls?q=is%3Apr+by%3A1Git2Clone"
                target="_blank"
                rel="noopener noreferrer"><strong>rust-random/rand</strong></a
              >
            </td>
            <td>
              Contributions to <em>the</em> random number generation library for
              Rust, as a
              <a
                href="/images/random-kid-pr.webp"
                target="_blank"
                rel="noopener noreferrer">random kid</a
              >
            </td>
          </tr>
          <tr>
            <td>
              <a
                href="https://git.hu-tao.dev/skavex/skavex"
                target="_blank"
                rel="noopener noreferrer"><strong>skavex</strong></a
              >
            </td>
            <td>
              The Markdown + LaTeX + Svelte preprocessor behind
              <a href={resolve("/blogs")}>this site's blogs</a>
            </td>
          </tr>
          <tr>
            <td>
              <a
                href="https://git.hu-tao.dev/hutao/hu-tao-dev"
                target="_blank"
                rel="noopener noreferrer"><strong>hu-tao.dev</strong></a
              >
            </td>
            <td
              >SvelteKit 2 · Svelte 5 · Tailwind v4 · skavex. You're looking at
              it.</td
            >
          </tr>
        </tbody>
      </table>
    </HeadingCopy>
  </section>

  <section class="border-border box-gradient rounded-lg border p-8">
    <HeadingCopy class="prose min-w-full dark:prose-invert">
      <h2 id="infrastructure" class="mt-0">Infrastructure</h2>
      <p>
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
    </HeadingCopy>
  </section>

  <section class="border-border box-gradient rounded-lg border p-8">
    <HeadingCopy class="prose mb-6 min-w-full dark:prose-invert">
      <h2 id="skills" class="mt-0">Stuff I Reach For</h2>
      <p class="mb-0">
        The day job covers the Go and AWS parts. The rest is the “doing it
        myself” habit.
      </p>
    </HeadingCopy>

    <dl class="space-y-4">
      {#each SKILLS as { group, items } (group)}
        <div class="sm:grid sm:grid-cols-[8rem_1fr] sm:gap-4">
          <dt class="text-sm font-semibold text-subtextcol sm:py-1">{group}</dt>
          <dd class="mt-2 ml-0 sm:mt-0">
            <ul class="flex flex-wrap gap-2">
              {#each items as item (item)}
                {@const tech = TECH_URLS[item]}
                <li
                  class="border-border card inline-block rounded border px-2 py-1 text-sm"
                >
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
  </section>

  <section class="border-border box-gradient rounded-lg border p-8">
    <HeadingCopy class="prose min-w-full dark:prose-invert">
      <h2 id="writing" class="mt-0">Writing</h2>
      <p>
        Algorithms, Linux, tooling, and the parts of software that become
        clearer when you explain them.
      </p>
      <ul class="mb-0">
        <li><a href={resolve("/blogs")}>Blogs</a></li>
        <li><a href={resolve("/journey")}>Linux journey</a></li>
      </ul>
    </HeadingCopy>
  </section>

  <section
    class="border-border box-gradient prose min-w-full rounded-lg border p-8 text-center dark:prose-invert"
  >
    <h2 id="contact" class="mt-0">Contact</h2>
    <p class="mb-0"><a href="mailto:{EMAIL}">{EMAIL}</a></p>
  </section>
</div>
