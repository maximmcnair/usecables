<script lang="ts">
	import { onMount } from 'svelte';
  import type { Node, NodesObj, NodeBox } from '../types';

  export let nodes: Node[];
  export let nodesObj: NodesObj;

  interface RenderOpts {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    frame: number;
  }

	onMount(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    // animate!
    canvasAnimation(canvas, ctx);
	});

  function canvasAnimation(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
    // set height&width of canvas 
    window.addEventListener('resize', onResize);

    function onResize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // if (window.devicePixelRatio > 1) {
      //   canvas.width = canvas.clientWidth * 2;
      //   canvas.height = canvas.clientHeight * 2;
      //   ctx.scale(2, 2);
      // } else {
      //   canvas.width = canvas.offsetWidth;
      //   canvas.height = canvas.offsetHeight;
      // }
    }

    onResize();

    let frame = 0;

    const fns = {
      'Wave': renderWave,
      'Box': renderBox,
    }

    function processNode(opts: RenderOpts, nodeId: string) {
      const node = nodesObj[nodeId];
      const nodeFn = fns[node.type];
      return nodeFn(opts, node as Node);
    }

    function renderWave(opts: RenderOpts, node: Node) {
      if (node.type !== 'Wave') throw Error('Node needs to be a Wave');
      return node.amplitude * Math[node.waveform](opts.frame / node.frequency);
    }

    function renderBox(opts: RenderOpts, n: Node){
      if (n.type !== 'Box') throw Error('Node needs to be a Box');

      const node = n as NodeBox;

      ctx.fillStyle = 'red';

      // var wobble = Math.sin(Date.now() / 250) * window.innerHeight / 50;

      const x = nodeOrVal(opts, node.x) || 0;
      const y = nodeOrVal(opts, node.y) || 0;

      ctx.fillRect(x, y, node.width, node.height);
    }

    function nodeOrVal(opts: RenderOpts, val: string | number) {
      return typeof val === 'string' ? 
        processNode(opts, val)
        : val;
    }

    function render() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let node of nodes) {
        // TODO refactor into renderNode fn
        if (node.type === 'Box'){
          renderBox({canvas, ctx, frame}, node as NodeBox);
        }
      }

      // Request the browser the call render once its ready for a new frame
      window.requestAnimationFrame(render);
    }

    render();
  }
</script>

<canvas id="canvas" />

<style>
  #canvas{
    position: absolute;
    background-color: black;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 2;
  }
</style>
