<script lang="ts">
  import type { Position } from '$types';
  import { createCurvedLinePath } from '$lib/createCurvedLine';

  export let start: Position;
  export let end: Position;

  // todo refactor resize logic into a store
  let width = window.innerWidth;
  let height = window.innerHeight;

  // set height&width of canvas
  window.addEventListener('resize', onResize);

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
  }

  onResize();

  let curvedLinePath = createCurvedLinePath(start, end);
  $: curvedLinePath = createCurvedLinePath(start, end);
</script>

<svg viewBox={`0 0 ${width} ${height}`} class="node-connector">
  <path
    fill="none"
    d={curvedLinePath}
    stroke="var(--color-gold)"
    stroke-width="3"
  />
</svg>

<style>
  .node-connector {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: visible;
    z-index: 999;
    pointer-events: none;
  }
</style>
