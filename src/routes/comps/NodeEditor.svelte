<script context="module">
  // import  DragDropTouch  from 'svelte-drag-drop-touch'
  import { asDraggable } from 'svelte-drag-and-drop-actions'
</script>

<script lang="ts">
	import { onMount } from 'svelte';
  import type { Node, NodeType, NodesObj } from '../types';
  import nodesStore, { nodeUpdate } from '../stores/nodes';
  import NodeConnector from './NodeConnector.svelte';

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
          prop: con,
          origin: originNode,
          target: node,
        });
      }
    }
    connectors = cons;
  }

  $: console.log('c', connectors)
</script>

{#each connectors as connector}
  {#if connector.origin && connector.target}
    <NodeConnector 
      x1={connector.origin?.editorX + 206}
      y1={connector.origin?.editorY + 47}
      x2={connector.target?.editorX + 10}
      y2={connector.target?.editorY + 200}
    />
  {/if}
{/each}

<div class="node" 
  use:asDraggable={{ onDragStart, onDragMove, onDragEnd }}
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
      <label>
        <span>Height</span>
        <input 
          value={node.height} 
          type="number"
          on:change={(evt) => nodeUpdate(node.id, {height: evt.currentTarget.value})} 
        />
      </label>
      <label>
        <span>Width</span>
        <input 
          value={node.width} 
          type="number"
          on:change={(evt) => nodeUpdate(node.id, {width: evt.currentTarget.value})} 
        />
      </label>
      <label>
        <span>x</span>
        {#if typeof node.x === 'string'} 
          <span>{node.x}</span>
        {:else}
          <input 
            value={node.x} 
            type="number"
            on:change={(evt) => nodeUpdate(node.id, {x: evt.currentTarget.value})} 
          />
        {/if}
      </label>
      <label>
        <span>y</span>
        {#if typeof node.y === 'string'} 
          <span>{node.y}</span>
        {:else}
          <input 
            value={node.y} 
            type="number"
            on:change={(evt) => nodeUpdate(node.id, {y: evt.currentTarget.value})} 
          />
        {/if}
      </label>
    {/if}

    {#if node.type === 'Wave'}
      <label>
        <span>Waveform</span>
        <select value={node.waveform}
          on:change={(evt) => nodeUpdate(node.id, {waveform: evt.currentTarget.value})} 
        >
          <option value="sin">sin</option>
          <option value="cos">cos</option>
          <option value="tan">tan</option>
        </select>
      </label>
      <label>
        <span>Amplitude</span>
        <input 
          value={node.amplitude} 
          type="range"
          min=1
          max=600
          on:change={(evt) => nodeUpdate(node.id, {amplitude: evt.currentTarget.value})} 
        />
      </label>
      <label>
        <span>Frequency</span>
        <input 
          value={node.frequency} 
          type="range"
          min=1
          max=600
          on:change={(evt) => nodeUpdate(node.id, {frequency: evt.currentTarget.value})} 
        />
      </label>
      {#if false}
        <label>
          <span>Offset</span>
          <input 
            value={node.offset} 
            type="number"
            on:change={(evt) => nodeUpdate(node.id, {offset: evt.currentTarget.value})} 
          />
        </label>
        <label>
          <span>Phase</span>
          <input 
            value={node.phase} 
            type="number"
            on:change={(evt) => nodeUpdate(node.id, {phase: evt.currentTarget.value})} 
          />
        </label>
      {/if}
    {/if}
  </section>
</div>

<style>
  :global([draggable]) {
    -webkit-touch-callout:none;
    -ms-touch-action:none; touch-action:none;
    -moz-user-select:none; -webkit-user-select:none; -ms-user-select:none; user-select:none;
  }

  :root{
    --color-white: #ffffff;
    --color-grey: #232326;
    --color-grey-dark: #171719;
  }

  .node {
    width: 200px;
    position: absolute;
    cursor: move;
    background-color: var(--color-grey-dark);
    border: 1px solid var(--color-grey);
    margin-bottom: 10px;
    border-radius: 10px;
  }

  .node-header {
    background-color: var(--color-grey);
    border-radius: 10px 10px 0px 0px;
    height: 40px;
  }

  .node-header input,
  .node-header span {
    display: block;
    color: var(--color-white);
    text-align: center;
  }

  .node-header span {
    font-size: 20px;
    padding-top: 9px;
    color: var(--color-white);
  }

  .node-props {
    display: flex;
    flex-direction: column;
  }

  label span {
    display: block;
    color: white;
    padding: 10px 10px;
  }

  input {
    background: transparent;
    padding: 10px;
    color: var(--color-white);
    border: 0px;
    outline: none;
  }

  .output-connector {
    position: absolute;
    /* updates to top and left must be updated in connector js logic */
    top: 30px;
    left: 190px;
    display: block;
    background-color: var(--color-white);
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
</style>
