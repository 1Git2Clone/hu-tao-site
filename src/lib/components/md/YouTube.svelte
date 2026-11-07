<script lang="ts">
  import { onMount } from "svelte";

  const DEFAULT_TITLE = "YouTube video";
  let { id, title = DEFAULT_TITLE, timestamp } = $props();
  let isLoaded = $state(false);

  onMount(() => {
    if (!title || title == DEFAULT_TITLE) {
      fetch(
        `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`,
      )
        .then((r) => r.json())
        .then((data) => (title = data.title));
    }
  });

  const thumb = (() => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`)();
</script>

<!-- The thumbnail is a CSS background, found late: warm up its host, on posts with a video only. -->
<svelte:head>
  <link rel="preconnect" href="https://i.ytimg.com" />
</svelte:head>

<div class="video-container">
  {#if isLoaded}
    <iframe
      src="https://www.youtube.com/embed/{id}?autoplay=1{timestamp
        ? '&start=' + timestamp
        : ''}"
      {title}
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  {:else}
    <button
      class="placeholder"
      onclick={() => (isLoaded = true)}
      aria-label="Play {title}"
      style="background-image: url({thumb});"
    >
      <div class="play-button"></div>
    </button>
  {/if}
</div>

<style>
  .video-container {
    width: 100%;
    aspect-ratio: 16 / 9;
    margin: 2rem 0;
    background: var(--color-video-canvas);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .placeholder {
    width: 100%;
    height: 100%;
    background-size: cover;
    background-position: center;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .play-button {
    width: calc(16rem / 2);
    height: calc(9rem / 2);
    background-color: var(--color-video-button);
    border-radius: 12%;
    position: relative;
    transition: background-color 0.2s;
  }

  .placeholder {
    transform: scale(1);
    transition: transform 0.3s ease-in-out;
  }

  .placeholder:hover {
    transform: scale(1.1);
    transition: transform;
    transition: transform 0.3s ease-in-out;
  }

  .placeholder:hover .play-button {
    background-color: var(--color-video-button-hover);
  }

  /* The triangle */
  .play-button::before {
    content: "";
    border-style: solid;
    border-width: 12px 0 12px 20px;
    border-color: transparent transparent transparent var(--color-video-symbol);
    position: absolute;
    top: 50%;
    left: 51%;
    transform: translate(-50%, -50%);
  }

  iframe {
    width: 100%;
    height: 100%;
  }
</style>
