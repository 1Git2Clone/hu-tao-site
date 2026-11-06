<script lang="ts">
  import { onMount } from "svelte";
  import { pushState } from "$app/navigation";

  type Heading = { id: string; html: string; level: number };

  let { staticHeadings = [], isMobile = false } = $props<{
    staticHeadings: Heading[];
    isMobile?: boolean;
  }>();

  let activeId = $state("");

  let headingPositions: { id: string; top: number }[] = [];
  let cachedInnerHeight: number = 0;

  let headingHeight = 0;
  let headingPadding = 0;

  const computeHeadingPositions = () => {
    const headings = Array.from(
      document.querySelectorAll("article h2, article h3"),
    ) as HTMLElement[];
    headingPositions = headings.map((el) => ({ id: el.id, top: el.offsetTop }));
    cachedInnerHeight = window.innerHeight;
  };

  // Smooth on a click here only: elsewhere a jump (back, a shared link) must
  // land at once.
  function scrollTo(event: MouseEvent, id: string) {
    const target = document.getElementById(id);
    if (!target || event.button || event.metaKey || event.ctrlKey) return;
    if (event.shiftKey || event.altKey) return;

    event.preventDefault();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    pushState(`#${id}`, {});
  }

  onMount(() => {
    const header = document.querySelector("header") as HTMLElement;
    if (header) {
      headingHeight = header.offsetHeight;
      headingPadding = headingHeight / 4;
    }
    computeHeadingPositions();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          const scroll =
            window.scrollY +
            cachedInnerHeight * 0.2 +
            headingHeight +
            headingPadding;
          for (let i = headingPositions.length - 1; i >= 0; i--) {
            if (scroll >= headingPositions[i].top) {
              if (activeId !== headingPositions[i].id)
                activeId = headingPositions[i].id;
              break;
            }
          }
          ticking = false;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", computeHeadingPositions);
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", computeHeadingPositions);
    };
  });
</script>

<nav class="w-full text-left contrast-70">
  <div>
    <ul class="space-y-3 {isMobile ? '' : 'border-l border-transparent'}">
      {#each staticHeadings as { id, html, level }, i (id + i)}
        <li>
          <a
            href="#{id}"
            onclick={(e) => scrollTo(e, id)}
            class="block text-sm break-words transition-colors duration-200
                          {isMobile ? '' : '-ml-px border-l pl-4'}
                          {level === 3
              ? isMobile
                ? 'pl-4 italic'
                : 'ml-4'
              : ''}
                          {activeId === id
              ? 'border-accent-hover font-medium text-accent'
              : 'border-transparent text-accent-bg hover:text-accent-hover'}"
          >
            {@html html}
          </a>
        </li>
      {/each}
    </ul>
  </div>
</nav>
