<script lang="ts">
  import SocialLinks from "$lib/components/layout/SocialLinks.svelte";
  import { CURRENT_YEAR } from "$lib/utils/consts";
</script>

<footer
  class="background relative flex h-(--footer-height) flex-col border-t border-accent"
>
  <div class="mx-auto max-w-4xl pt-4 text-center text-sm opacity-70">
    © {CURRENT_YEAR} Ivan, All rights reserved.
  </div>
  <SocialLinks class="mx-auto pt-2 opacity-70" />
</footer>
