<script context="module">
  import { asDraggable } from 'svelte-drag-and-drop-actions';
</script>

<script lang="ts">
  import type { Node, Position } from '$types';
  import { createCurvedLinePath } from '$lib/createCurvedLine';

  export let x: number;
  export let y: number;
  export let node: Node;
  export let boardPos: Position;
  export let start: Position;

  let end: Position = {
    x: x - 8,
    y: y - 8,
  };

  let isDragging = false;

  $: {
    end.x = x - 8;
    end.y = y - 8;
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

  let curvedLinePath = createCurvedLinePath(start, end);
  $: curvedLinePath = createCurvedLinePath(start, end);

  function onDragStart(){
    // console.log('ConnectorOrigin on:dragstart', evt.x, evt.y, boardPos)
    // isDragging = true;
    // if (evt?.dataTransfer) {
    //   evt.dataTransfer.dropEffect = 'move';
    //   // evt.dataTransfer.dropEffect = 'link';
    //   evt.dataTransfer.setData('text', node.id);
    //   if (!(navigator.userAgent.indexOf('Firefox') != -1)) {
    //     evt.dataTransfer.setDragImage(new Image(), 0, 0);
    //   }
    // }
    return {
      x: x,
      y: y
    };
  }
  function onDragMove(x: number, y: number){
    // console.log('ConnectorOrigin on:drag', evt.x, evt.y, boardPos)
    // if (evt.x !== 0 && evt.y !== 0) {
      end.x = x - boardPos.x;
      end.y = y - boardPos.y;
    // }
  }
  function onDragEnd(x: number, y: number){
    // console.log('ConnectorOrigin on:dragend');
    // isDragging = false;
    end.x = x - 8;
    end.y = y - 8;
  }
</script>

<div
  class="connector-handle"
  style={`top: ${end.y}px; left: ${end.x}px; z-index: 55;`}
  use:asDraggable={{
    onDragStart,
    onDragMove,
    onDragEnd
  }}
/>

{#if isDragging}
  <svg viewBox={`0 0 ${width} ${height}`} class="node-connector">
    <path
      fill="none"
      d={curvedLinePath}
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
    z-index: 999;
    cursor: draggable;
  }

  .node-connector {
    position: absolute;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    overflow: visible;
    z-index: 99;
    pointer-events: none;
  }
</style>
