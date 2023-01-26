<script lang="ts">
  import GlslCanvas from 'glslCanvas';
  import { onMount } from 'svelte';
  import type { Node, NodesObj, NodeBox, RenderOpts } from '../types';
  import record from '../../lib/record';
  import createFragShader from '../../lib/createFragShader';

  export let nodes: Node[];
  export let nodesObj: NodesObj;

  let canvasWidth = 600;
  let canvasHeight = 600;
  let isRecording = false;

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

  $: {
    if (sandbox && nodes.length) {
      const canvasOpts = {
        canvasWidth,
        canvasHeight,
        bgColor: [210, 222, 228],
      };
      const frag = createFragShader(canvasOpts, nodes, nodesObj);
      // console.log(frag);
      sandbox.load(frag);
    };
  }


  onMount(() => {
    canvas = document.querySelector('#canvas');

    if (!canvas) return;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    sandbox = new GlslCanvas(canvas);
    if (!sandbox) return;

    sandbox.setUniform('seed', Math.random());
  });
</script>

<nav class="canvas-nav">
  <label>
    <strong>Width</strong>
    <input bind:value={canvasWidth} type="number" min={100} />
  </label>
  <label>
    <strong>Height</strong>
    <input bind:value={canvasHeight} type="number" min={100} />
  </label>
</nav>

<button
  class="canvas-record"
  on:click={() => {
    if (canvas) record(canvas);
  }}>{isRecording ? 'Stop' : 'Record'}</button
>

<div class="container">
  <canvas id="canvas" />
</div>

<style>
  .canvas-nav {
    position: absolute;
    top: 18px;
    right: 100px;
    z-index: 8;
    display: flex;
    background-color: rgb(29 31 32 / 77%);
    padding: 10px 20px;
    border-radius: 10px;
    width: 250px;
  }

  .canvas-nav label {
    display: flex;
    flex-direction: row;
    font-size: 16px;
  }

  .canvas-nav strong {
    margin-top: 2px;
  }

  .canvas-nav input {
    margin-left: 10px;
    font-size: 16px;
  }

  .canvas-record {
    position: absolute;
    top: 20px;
    right: 20px;
    z-index: 8;
  }

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
