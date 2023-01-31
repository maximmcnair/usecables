<script lang="ts">
  import type { Node } from '$types';

  export let x: number;
  export let y: number;
  export let node: Node;

  let handleX = x - 8;
  let handleY = y - 8;
  let isDragging = false;

  $: {
    handleX = x - 8;
    handleY = y - 8;
  }

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

  // $: console.log(handleX, handleY, x, y);
</script>

<div
  class="connector-handle"
  style={`top: ${handleY}px; left: ${handleX}px; z-index: 55;`}
  draggable="true"
  on:drag={(evt) => {
    console.log(evt.x, evt.y, evt.layerX, evt.layerY, evt);
    if (evt.x !== 0 && evt.y !== 0) {
      handleX = evt.x;
      handleY = evt.y;
      // handleX = evt.x - 8;
      // handleY = evt.y - 8;
    }
  }}
  on:dragstart={(evt) => {
    // console.log('dragstart', evt)
    isDragging = true;
    if (evt?.dataTransfer) {
      evt.dataTransfer.setData('text', node.id);
      if (!navigator.userAgent.indexOf('Firefox') != -1) {
        evt.dataTransfer.setDragImage(new Image(), 0, 0);
      }
      evt.dataTransfer.dropEffect = 'link';
    }
  }}
  on:dragend={() => {
    console.log('dragend');
    isDragging = false;
    handleX = x - 8;
    handleY = y - 8;
  }}
/>

{#if isDragging}
  <svg viewBox={`0 0 ${width} ${height}`} class="node-connector">
    <line
      x1={x}
      y1={y}
      x2={handleX + 8}
      y2={handleY + 8}
      stroke="var(--color-gold)"
      stroke-width="3"
    />
  </svg>
{/if}

<style>
  .connector-handle {
    position: absolute;
    height: 16px;
    width: 16px;
    background: var(--color-gold);
    border-radius: 10px;
    z-index: 99;
    cursor: draggable;
  }

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
