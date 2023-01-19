<script lang="ts">
  import './styles.css';
  import BuiltBy from './comps/BuiltBy.svelte';
</script>

<div>
  <main>
    <slot />
  </main>

  <BuiltBy />
</div>
