<script lang="ts">
  import { onMount } from 'svelte';
  import type { Node, NodesObj, NodeBox } from '../types';

  export let nodes: Node[];
  export let nodesObj: NodesObj;

  let canvasWidth = 600;
  let canvasHeight = 600;
  let isRecording = false;

  interface RenderOpts {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    frame: number;
  }

  let canvas: HTMLCanvasElement | null = null;

  $: {
    if (canvas) {
      // canvas width/height update
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }
  }

  function recordCanvas(time: number) {
    console.log('recording started');

    const recordedChunks: any[] = [];

    return new Promise(function (res, rej) {
      if (!canvas) return;
      var stream = canvas.captureStream(25 /*fps*/);
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm; codecs=vp9'
      });

      //ondataavailable will fire in interval of `time || 4000 ms`
      mediaRecorder.start(time || 4000);

      mediaRecorder.ondataavailable = function (event) {
        recordedChunks.push(event.data);
        // after stop `dataavilable` event run one more time
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
        }
      };

      mediaRecorder.onstop = function (event) {
        console.log('recording stopped');
        var blob = new Blob(recordedChunks, {
          type: 'video/webm',
          mimeType: 'video/webm;codecs:vp9'
        });
        var url = URL.createObjectURL(blob);
        console.log(url);
        res(url);
      };
    });
  }

  async function record() {
    const recording = recordCanvas(1000);

    const $video = document.createElement('video');
    document.body.appendChild($video);
    $video.setAttribute('class', 'render-video');
    recording.then((url) => $video.setAttribute('src', url));
    console.log('recording render');

    // download it
    const link$ = document.createElement('a');
    link$.setAttribute('download', 'recordingVideo');
    recording.then((url) => {
      link$.setAttribute('href', url);
      link$.click();
    });
  }

  onMount(() => {
    canvas = document.querySelector('#canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // animate!
    canvasAnimation(canvas, ctx);
  });

  function canvasAnimation(
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D
  ) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    let frame = 0;

    const fns = {
      Wave: renderWave,
      Box: renderBox
    };

    function processNode(opts: RenderOpts, nodeId: string) {
      const node = nodesObj[nodeId];
      const nodeFn = fns[node.type];
      return nodeFn(opts, node as Node);
    }

    function renderWave(opts: RenderOpts, node: Node) {
      if (node.type !== 'Wave') throw Error('Node needs to be a Wave');
      return node.amplitude * Math[node.waveform](opts.frame / node.frequency);
    }

    function renderBox(opts: RenderOpts, n: Node) {
      if (n.type !== 'Box') throw Error('Node needs to be a Box');
      const node = n as NodeBox;
      const x = canvasWidth / 2 + (nodeOrVal(opts, node.x) || 0);
      const y = canvasHeight / 2 + (nodeOrVal(opts, node.y) || 0);
      ctx.fillStyle = 'red';
      ctx.fillRect(x, y, node.width, node.height);
    }

    function nodeOrVal(opts: RenderOpts, val: string | number) {
      return typeof val === 'string' ? processNode(opts, val) : val;
    }

    function render() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let node of nodes) {
        // TODO refactor into renderNode fn
        if (node.type === 'Box') {
          renderBox({ canvas, ctx, frame }, node as NodeBox);
        }
      }

      // Request the browser the call render once its ready for a new frame
      window.requestAnimationFrame(render);
    }

    render();
  }
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

<button class="canvas-record" on:click={record}
  >{isRecording ? 'Stop' : 'Record'}</button
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
    background-color: black;
    display: flex;
    width: 300px;
  }

  .canvas-nav label {
    display: flex;
    flex-direction: row;
    font-size: 16px;
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
    border: 1px solid grey;
  }

  :global(.render-video) {
    position: absolute;
    background-color: red;
    top: 0px;
    width: 100px;
    z-index: 4;
  }
</style>
