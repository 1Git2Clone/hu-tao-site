<script lang="ts">
  import { ModeWatcher } from "mode-watcher";
  import ThemeToggle from "$lib/components/layout/ThemeToggle.svelte";
  import "../../src/routes/layout.css";
</script>

<ModeWatcher synchronousModeChanges />
<ThemeToggle />
