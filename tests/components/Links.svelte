<script lang="ts">
  import LinkCard from "$lib/components/LinkCard.svelte";
  import GitHub from "$lib/components/icons/GitHub.svelte";
  import "../../src/routes/layout.css";
</script>

<LinkCard href="/blogs">Blogs</LinkCard>
<LinkCard href="https://github.com/1Git2Clone" icon={GitHub}>GitHub</LinkCard>
<LinkCard href="https://nixos.org" icon="linux-nixos">Nix</LinkCard>
