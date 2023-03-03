<script lang="ts">
  import GlslCanvas from 'glslCanvas';
  import { onMount } from 'svelte';

  import type { Node, NodesObj } from '$types';
  import createFragShader from '$lib/createFragShader';
  import Header from './Header.svelte';

  export let nodes: Node[];
  export let nodesObj: NodesObj;

  let canvasWidth = 600;
  let canvasHeight = 600;

  interface Sandbox {
    load(frag: string): void;
    setUniform(key: string, val: number): void;
  }

  let canvas: HTMLCanvasElement | null = null;
  let sandbox: Sandbox | null = null;

  $: {
    if (canvas) {
      // canvas width/height update
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
  }

  const canvasOpts = {
    bgColor: [19, 21, 21] as [number, number, number]
  };
  let fragShader = createFragShader(canvasOpts, nodes, nodesObj);

  $: {
    if (sandbox) {
      fragShader = createFragShader(canvasOpts, nodes, nodesObj);
      sandbox.load(fragShader);
    }
  }

  onMount(() => {
    canvas = document.querySelector('#canvas');

    if (!canvas) return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    sandbox = new GlslCanvas(canvas);
    if (!sandbox) return;
  });
</script>

{#if canvas}
  <Header
    bind:width={canvasWidth}
    bind:height={canvasHeight}
    {canvas}
    {fragShader}
  />
{/if}

<div class="container">
  <canvas id="canvas" />
</div>

<style>
  .container {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #canvas {
    position: relative;
    background-color: black;
    box-shadow: -2px 4px 13px 0px rgba(0, 0, 0, 0.4);
    z-index: 2;
  }

  :global(.render-video) {
    position: absolute;
    opacity: 0;
    top: 0px;
    width: 100px;
    z-index: 4;
  }
</style>
