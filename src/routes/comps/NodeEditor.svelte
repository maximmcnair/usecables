<script context="module">
  // import  DragDropTouch  from 'svelte-drag-drop-touch'
  import { asDraggable } from 'svelte-drag-and-drop-actions'
</script>

<script lang="ts">
	import { onMount } from 'svelte';
  import type { Node, NodeType, NodesObj } from '../types';
  import nodesStore, { nodeUpdate } from '../stores/nodes';
  import NodeConnector from './NodeConnector.svelte';
  import NodeEditorSelect from './NodeEditorSelect.svelte';
  import NodeEditorRange from './NodeEditorRange.svelte';
	import NodeEditorNumber from './NodeEditorNumber.svelte';

  export let node: Node;

  function onDragStart() {
    return {
      x: node.editorX,
      y: node.editorY
    } 
  }
  function onDragMove(x: number, y: number) { 
    nodeUpdate(node.id, {
      editorX: x,
      editorY: y,
    })
  }
  function onDragEnd(x: number, y: number) { 
    // TODO save on a server
    nodeUpdate(node.id, {
      editorX: x,
      editorY: y,
    })
  }

  // $: console.log(node.id, node.editorX, node.editorY);

  const nodesWithOutput: NodeType[] = ['Wave']

  let nodesObj: NodesObj = {};

	onMount(() => {
    nodesStore.subscribe(({nodesObj: ndsObj}) => {
      nodesObj = ndsObj;
    });
	});

  function getNode(nodeId: string): Node {
    const node = nodesObj[nodeId];
    return node;
  }

  // $: if (node.id === 'box-1' && node){
  //   console.log('*', node.x);
  //   console.log(getNode(node.x))
  // }

  // $: console.log(node, node.x, nodesObj, nodesObj[node.x]);

  interface NodeConnector {
    type: NodeType;
    prop: string;
    origin: Node;
    target: Node;
  }

  let connectors: NodeConnector[] = [];
  // build connectors from all props that are strings
  // TODO there is probably a better way to do this
  $: {
    const possibleConnectors = ['x', 'y'];

    const cons: NodeConnector[] = [];
    for (let con of possibleConnectors){
      if (typeof node[con] === 'string'){
        const originNodeId: string = node[con];
        const originNode: Node = nodesObj[originNodeId];
        cons.push({
          type: node.type,
          prop: con,
          origin: originNode,
          target: node,
        });
      }
    }
    connectors = cons;
  }

  // $: console.log('c', connectors)

  // select: 70 + 15 = 85
  // range: 55 + 15 = 70
  // number: 20 + 15 = 35
  const boxPropConnectors: Record<string, number> = {
    // (header + props padding)
    'height': (40 + 20) + 8,
    'width': 95 + 8,
    'x': 130 + 8,
    'y': 165 + 8,
  };
</script>

{#each connectors as connector}
  {#if connector.origin && connector.target}
    <NodeConnector 
      x1={connector.origin?.editorX + 220}
      y1={connector.origin?.editorY + 22}
      x2={connector.target?.editorX + 0}
      y2={connector.target?.editorY + boxPropConnectors[connector.prop]}
    />
  {/if}
{/each}

<div class="node" 
  use:asDraggable={{ 
    onlyFrom:'.node-header',
    onDragStart, onDragMove, onDragEnd }}
  style:top={`${node.editorY}px`} style:left={`${node.editorX}px`}>

  <header class="node-header"
  >
    <span>{node.name}</span>
    {#if false}
      <input 
        value={node.name} 
        on:change={(evt) => nodeUpdate(node.id, {name: evt.currentTarget.value})} 
      />
    {/if}
  </header>

  {#if nodesWithOutput.includes(node.type)}
    <div class="output-connector" />
  {/if}

  <section class="node-props">
    {#if node.type === 'Box'}
      <NodeEditorNumber
        title="Height"
        value={node.height} 
        onUpdate={(val) => nodeUpdate(node.id, {height: val})} 
      />
      <NodeEditorNumber
        title="Width"
        value={node.width} 
        onUpdate={(val) => nodeUpdate(node.id, {width: val})} 
      />
      <NodeEditorNumber
        title="x"
        value={node.x} 
        onUpdate={(val) => nodeUpdate(node.id, {x: val})} 
      />
      <NodeEditorNumber
        title="y"
        value={node.y} 
        onUpdate={(val) => nodeUpdate(node.id, {y: val})} 
      />
    {/if}

    {#if node.type === 'Wave'}
      <NodeEditorSelect 
        title="Waveform"
        value={node.waveform}
        options={['sin', 'cos', 'tan']}
        onUpdate={(val) => nodeUpdate(node.id, {waveform: val})} 
      />
      <NodeEditorRange
        title="Amplitude"
        value={node.amplitude}
        min={1}
        max={600}
        onUpdate={(val) => nodeUpdate(node.id, {amplitude: val})} 
      />
      <NodeEditorRange
        title="Frequency"
        value={node.frequency}
        min={1}
        max={600}
        onUpdate={(val) => nodeUpdate(node.id, {frequency: val})} 
      />
    {/if}
  </section>
</div>

<style>
  :global([draggable]) {
    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
    -moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;
  }

  .node {
    width: 220px;
    position: absolute;
    cursor: move;
    background-color: var(--color-grey-dark);
    /* border: 1px solid var(--color-grey); */
    margin-bottom: 10px;
    border-radius: 10px;
  }

  .node-header {
    background-color: var(--color-grey-darker);
    /* border-bottom: 1px solid var(--color-grey); */
    border-radius: 10px 10px 0px 0px;
    height: 40px;
  }

  .node-header input,
  .node-header span {
    display: block;
    color: var(--color-white);
    text-align: center;
    font-size: var(--typesize-small);
  }

  .node-header span {
    font-size: var(--typesize-small);
    padding-top: 9px;
    color: var(--color-white);
  }

  .node-props {
    display: flex;
    flex-direction: column;
    padding: 15px;
  }

  .output-connector {
    position: absolute;
    /* updates to top and left must be updated in connector js logic */
    top: 13px;
    left: 210px;
    display: block;
    background-color: var(--color-gold);
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
</style>
