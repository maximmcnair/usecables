import type { Node, NodesObj, NodeBox, RenderOpts } from '../types';

export function canvasAnimation(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  nodesObj: NodesObj,
  canvasWidth: number,
  canvasHeight: number,
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
