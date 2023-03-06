<script lang="ts">
  import type { Node, NodesObj, Position } from '$types';
  import NodeEditor from './NodeEditor.svelte';
  import MenuNodeCreator from './MenuNodeCreator.svelte';
  import { fade } from 'svelte/transition';

  export let nodes: Node[];
  export let nodesObj: NodesObj;

  let areNodesVisible: boolean = true;

  let menuVisible = false;
  let menuPos: Position = { x: 0, y: 0 };

  function closeMenu() {
    menuVisible = false;
  }

  function handleContextMenu(evt: MouseEvent) {
    evt.preventDefault();
    // position menu to cursor
    menuPos = { x: evt.clientX, y: evt.clientY };
    menuVisible = true;
  }

  let zoom = 1;

  function setZoom(z: number) {
    zoom = Math.max(Math.min(1, z), 0.3);
  }

  let isDragging = false;
  let boardPos: Position = { x: 0, y: 0 };

  function onPointerMove(evt: MouseEvent) {
    if (isDragging) {
      boardPos.x += evt.movementX;
      boardPos.y += evt.movementY;
    }
  }
  function onPointerDown(evt: MouseEvent) {
    if (evt.button === 0) {
      isDragging = true;
    }
  }
  function onWindowPointerUp(evt: MouseEvent) {
    isDragging = false;
  }
</script>

{#if menuVisible}
  <MenuNodeCreator x={menuPos.x} y={menuPos.y} on:close={closeMenu} />
{/if}

{#if areNodesVisible}
  <div class="nodes-scale" style={`transform: scale(${zoom});`}>
    <div
      class="nodes"
      transition:fade={{ duration: 100 }}
      style={`transform: translate(${boardPos.x}px, ${boardPos.y}px); cursor: ${
        isDragging ? 'grabbing' : 'grab'
      };`}
      on:pointermove={onPointerMove}
      on:pointerdown={onPointerDown}
      on:contextmenu={handleContextMenu}
    />

    <div class="nodes-editor" style={`transform: translate(${boardPos.x}px, ${boardPos.y}px);`}>
      {#each nodes as node}
        <NodeEditor {node} boardPos={boardPos}/>
      {/each}
    </div>
  </div>
{/if}

<svelte:window on:pointerup={onWindowPointerUp} />

<nav>
  {#if areNodesVisible}
    <button
      on:click={() => {
        areNodesVisible = false;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
      >
        <path
          fill="currentColor"
          d="M.143 2.31a.75.75 0 0 1 1.047-.167l14.5 10.5a.75.75 0 1 1-.88 1.214l-2.248-1.628C11.346 13.19 9.792 14 8 14c-1.981 0-3.67-.992-4.933-2.078C1.797 10.832.88 9.577.43 8.9a1.619 1.619 0 0 1 0-1.797c.353-.533.995-1.42 1.868-2.305L.31 3.357A.75.75 0 0 1 .143 2.31Zm1.536 5.622A.12.12 0 0 0 1.657 8c0 .021.006.045.022.068.412.621 1.242 1.75 2.366 2.717C5.175 11.758 6.527 12.5 8 12.5c1.195 0 2.31-.488 3.29-1.191L9.063 9.695A2 2 0 0 1 6.058 7.52L3.529 5.688a14.207 14.207 0 0 0-1.85 2.244ZM8 3.5c-.516 0-1.017.09-1.499.251a.75.75 0 1 1-.473-1.423A6.207 6.207 0 0 1 8 2c1.981 0 3.67.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.11.166-.248.365-.41.587a.75.75 0 1 1-1.21-.887c.148-.201.272-.382.371-.53a.119.119 0 0 0 0-.137c-.412-.621-1.242-1.75-2.366-2.717C10.825 4.242 9.473 3.5 8 3.5Z"
        />
      </svg>
      Hide nodes
    </button>
  {:else}
    <button
      on:click={() => {
        areNodesVisible = true;
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 16 16"
        width="16"
        height="16"
        ><path
          fill="currentColor"
          d="M8 2c1.981 0 3.671.992 4.933 2.078 1.27 1.091 2.187 2.345 2.637 3.023a1.62 1.62 0 0 1 0 1.798c-.45.678-1.367 1.932-2.637 3.023C11.67 13.008 9.981 14 8 14c-1.981 0-3.671-.992-4.933-2.078C1.797 10.83.88 9.576.43 8.898a1.62 1.62 0 0 1 0-1.798c.45-.677 1.367-1.931 2.637-3.022C4.33 2.992 6.019 2 8 2ZM1.679 7.932a.12.12 0 0 0 0 .136c.411.622 1.241 1.75 2.366 2.717C5.176 11.758 6.527 12.5 8 12.5c1.473 0 2.825-.742 3.955-1.715 1.124-.967 1.954-2.096 2.366-2.717a.12.12 0 0 0 0-.136c-.412-.621-1.242-1.75-2.366-2.717C10.824 4.242 9.473 3.5 8 3.5c-1.473 0-2.825.742-3.955 1.715-1.124.967-1.954 2.096-2.366 2.717ZM8 10a2 2 0 1 1-.001-3.999A2 2 0 0 1 8 10Z"
        /></svg
      >
      Show nodes
    </button>
  {/if}

  <button on:click={() => setZoom(zoom + 0.1)}>Zoom in</button>
  <button on:click={() => setZoom(zoom - 0.1)}>Zoom out</button>
</nav>

<style>
  .nodes {
    position: absolute;
    top: calc(-100vh * 10);
    left: calc(-100vw * 10);
    height: calc(100vh * 20);
    width: calc(100vw * 20);
    overflow: hidden;
    background: url(/bg-dot.png);
    cursor: grab;
  }

  .nodes-scale {
    position: relative;
    transition: all 0.3s;
    z-index: 4;
  }

  .nodes-editor {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    cursor: drag;
  }

  nav {
    position: absolute;
    left: 20px;
    bottom: 20px;
    z-index: 9999;
  }

  nav button {
    border: none;
    background: transparent;
    display: flex;
    cursor: pointer;
    flex-direction: row;
    justify-content: center;
    color: white;
    padding: 10px;
    gap: 10px;
  }
</style>
