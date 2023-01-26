<script lang="ts">
  export let x1: number;
  export let y1: number;
  export let x2: number;
  export let y2: number;

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
</script>

<svg viewBox={`0 0 ${width} ${height}`} class="node-connector">
  <line {x1} {y1} {x2} {y2} stroke="var(--color-gold)" stroke-width="3" />
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
