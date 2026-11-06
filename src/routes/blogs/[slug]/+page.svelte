<script lang="ts">
  let { data } = $props();
</script>

<data.component snippets={data.snippets} metadata={data.metadata} />
