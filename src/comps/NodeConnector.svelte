<script lang="ts">
  import type { Position } from '$types';

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

  function createCurvedLinePath(start: Position, end: Position): string {
    const curveAmount = 30;

    const p1: Position = {
      x: start.x,
      y: start.y
    };
    const p2: Position = {
      x: start.x + curveAmount,
      y: start.y
    };
    const p3: Position = {
      x: end.x - curveAmount,
      y: end.y
    };
    const p4: Position = {
      x: end.x,
      y: end.y
    };

    return `
  M ${p1.x}, ${p1.y}
  C ${p2.x}, ${p2.y}
    ${p3.x}, ${p3.y}
    ${p4.x}, ${p4.y}
`;
    // NOTE this is a straight line
    // return `M ${start.x}, ${start.y} L ${end.x}, ${end.y}`;
  }

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
