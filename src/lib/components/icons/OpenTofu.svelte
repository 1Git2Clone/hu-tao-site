<script lang="ts">
  // OpenTofu's cube. The logo is #FFDA18 with a #E7C200 top: 8% black mixed
  // in OKLab gives that top from any colour, so the cube can take the accent.
  let {
    width = 28,
    height = 28,
    color = "currentColor",
  }: {
    width?: number | string;
    height?: number | string;
    color?: string;
  } = $props();

  const top = $derived(`color-mix(in oklab, ${color} 92%, black)`);
</script>

<svg viewBox="4 3 40 41" {width} {height} aria-label="OpenTofu">
  <path
    d="M23.6628 4.80138C23.8728 4.686 24.1271 4.686 24.337 4.80138L39.3069 13.0294C39.7906 13.2953 39.7906 13.9902 39.3069 14.256L24.337 22.4841C24.1271 22.5995 23.8728 22.5995 23.6628 22.4841L8.69295 14.256C8.20929 13.9902 8.20929 13.2953 8.69295 13.0294L23.6628 4.80138Z"
    style:fill={top}
  />
  <path
    d="M6.32202 16.7975C6.32202 16.2653 6.89255 15.9279 7.35896 16.1842L22.4708 24.4903C22.6946 24.6133 22.8336 24.8483 22.8336 25.1036V41.5597C22.8336 42.0919 22.2631 42.4294 21.7967 42.173L6.68477 33.8669C6.46104 33.7439 6.32202 33.5089 6.32202 33.2536V16.7975Z"
    style:fill={color}
  />
  <path
    d="M40.6406 16.1842C41.1071 15.9279 41.6776 16.2653 41.6776 16.7975V33.2536C41.6776 33.5089 41.5386 33.7439 41.3148 33.8669L26.203 42.173C25.7365 42.4294 25.166 42.0919 25.166 41.5597V25.1036C25.166 24.8483 25.305 24.6133 25.5288 24.4903L40.6406 16.1842Z"
    fill="white"
  />
</svg>
