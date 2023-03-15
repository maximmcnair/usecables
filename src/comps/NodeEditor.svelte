<script context="module">
  import { asDraggable } from 'svelte-drag-and-drop-actions';
</script>

<script lang="ts">
  import { onMount } from 'svelte';
  import { HsvPicker } from 'svelte-color-picker';
  import type { Node, NodeType, NodesObj, Position, DataType } from '$types';
  import nodesStore, { nodeDelete, nodeUpdate } from '$stores/nodes';
  import ConnectorOrigin from './ConnectorOrigin.svelte';
  import NodeConnector from './NodeConnector.svelte';
  import NodeDropper from './NodeDropper.svelte';
  import NodeEditorSelect from './NodeEditorSelect.svelte';
  import NodeEditorRange from './NodeEditorRange.svelte';
  import NodeEditorNumber from './NodeEditorNumber.svelte';
  import NodeEditorBlank from './NodeEditorBlank.svelte';
  import Menu from './Menu.svelte';
  import {
    nodesWithInputs,
    nodesWithOutputs,
    possibleNodeConnectors
  } from '$constants/nodes';
  import { snapToGrid } from '$lib/snapToGrid';
  import { rgbToHex } from '$lib/colors';

  export let node: Node;
  export let boardPos: Position;

  let shouldSnapToGrid = false;

  function onDragStart() {
    // console.log('onDragStart', node.editorX, node.editorY)
    return {
      x: node.editorX,
      y: node.editorY
    };
  }
  function onDragMove(x: number, y: number) {
    // console.log('onDragMove', x, y);
    nodeUpdate(node.id, {
      editorX: shouldSnapToGrid ? snapToGrid(x) : x,
      editorY: shouldSnapToGrid ? snapToGrid(y) : y
    });
  }
  function onDragEnd(x: number, y: number) {
    // console.log('onDragEnd', x, y);
    nodeUpdate(node.id, {
      editorX: shouldSnapToGrid ? snapToGrid(x) : x,
      editorY: shouldSnapToGrid ? snapToGrid(y) : y
    });
  }

  let nodesObj: NodesObj = {};

  onMount(() => {
    nodesStore.subscribe(({ nodesObj: ndsObj }) => {
      nodesObj = ndsObj;
    });
  });

  function getNode(nodeId: string): Node {
    const node = nodesObj[nodeId];
    return node;
  }

  interface NodeConnector {
    type: NodeType;
    prop: string;
    origin: Node;
    target: Node;
    dataType: DataType;
  }

  interface NodeDropper {
    type: NodeType;
    prop: string;
    node: Node;
    dataTypes: DataType[];
  }

  let connectors: NodeConnector[] = [];
  let droppers: NodeDropper[] = [];
  // build connectors from all props that are strings
  // TODO there is probably a better way to do this
  $: {
    const cons: NodeConnector[] = [];
    const drops: NodeDropper[] = [];
    for (let prop of possibleNodeConnectors[node.type]) {
      if (typeof node[prop] === 'string') {
        const originNodeId: string = node[prop];
        const originNode: Node = nodesObj[originNodeId];
        cons.push({
          type: node.type,
          prop,
          origin: originNode,
          target: node,
        });
      } else {
        drops.push({
          type: node.type,
          prop,
          node,
          dataTypes: prop === 'color' ? ['vec3'] : ['scalar']
        });
      }
    }
    connectors = cons;
    droppers = drops;
  }

  // $: console.log('c', node.type, connectors, droppers);

  const boxPropConnectors: Record<string, Record<string, number>> = {
    Box: {
      // (header + props padding)
      height: 40 + 20 + 8,
      width: 95 + 8,
      x: 130 + 8,
      y: 165 + 8,
      color: 200 + 8,
    },
    Circle: {
      radius: 40 + 20 + 8,
      x: 95 + 8,
      y: 130 + 8
    },
    Wave: {
      input: 20,
      waveform: 85,
      range: 85 + 70,
      number: 70 + 35
    },
    Map: {
      input: 20
    },
    Absolute: {
      input: 20
    },
    // Constants
    Time: {
      input: 20
    },
    Resolution: {
      input: 20
    },
    // Effects
    Noise: {}
  };

  function deleteNode() {
    closeMenu();
    nodeDelete(node.id);
  }

  let menuVisible = false;
  let menuPos: Position = { x: 0, y: 0 };
  function showMenu(evt: MouseEvent) {
    // hide default menu
    evt.preventDefault();
    // position menu to cursor
    menuPos = { x: evt.clientX, y: evt.clientY };
    menuVisible = true;
  }
  function closeMenu() {
    menuVisible = false;
  }
</script>

{#each connectors as connector}
  {#if connector.origin && connector.target}
    <NodeConnector
      start={{
        x: connector.origin?.editorX + 220,
        y: connector.origin?.editorY + 22
      }}
      end={{
        x: connector.target?.editorX + 0,
        y:
          connector.target?.editorY +
          boxPropConnectors[connector.target.type][connector.prop]
      }}
    />
  {/if}
{/each}

{#each droppers as drop}
  <NodeDropper
    prop={drop.prop}
    x={drop.node.editorX + 0}
    y={drop.node.editorY + boxPropConnectors[drop.node.type][drop.prop]}
    createConnection={(val) => nodeUpdate(node.id, { [drop.prop]: val })}
    dataTypes={drop.dataTypes}
  />
{/each}

{#if nodesWithOutputs.includes(node.type)}
  <ConnectorOrigin 
    start={{
      x: node.editorX + 220, 
      y: node.editorY + 20
    }}
    x={node.editorX + 220}
    y={node.editorY + 20}
    dataType={node.type === 'Color' ? 'vec3' : 'scalar'}
    {node}
    {boardPos}
  />
{/if}

{#if menuVisible}
  <Menu x={menuPos.x - boardPos.x} y={menuPos.y - boardPos.y} on:close={closeMenu}>
    <span class="menu-option" on:click={() => deleteNode()}>Delete node</span>
  </Menu>
{/if}

<div
  class="node"
  use:asDraggable={{
    onlyFrom: '.node-header',
    onDragStart,
    onDragMove,
    onDragEnd
  }}
  style:top={`${node.editorY}px`}
  style:left={`${node.editorX}px`}
  on:contextmenu={showMenu}
  on:click={(evt) => evt.stopPropagation()}
>
  {#if nodesWithInputs.includes(node.type) && node?.input !== undefined}
    <div
      class="node-connector-input"
      on:click={() => nodeUpdate(node.id, { input: undefined })}
    />
  {/if}

  <header class="node-header">
    <span>{node.name}</span>
  </header>

  <section class="node-props" style={node.type === 'Color' ? `padding: 0px;` : ''}>
    {#if node.type === 'Color'}
      <div class="colorpicker">
        <HsvPicker 
          on:colorChange={(rgba) => {
            const {r, g, b} = rgba.detail;
            nodeUpdate(node.id, { color: [r, g, b] });
          }} startColor={rgbToHex(node.rgb[0], node.rgb[1], node.rgb[1])}
        />
      </div>
    {/if}

    {#if node.type === 'Box'}
      <NodeEditorNumber
        title="Height"
        value={node.height}
        onUpdate={(val) => nodeUpdate(node.id, { height: val })}
      />
      <NodeEditorNumber
        title="Width"
        value={node.width}
        onUpdate={(val) => nodeUpdate(node.id, { width: val })}
      />
      <NodeEditorNumber
        title="x"
        value={node.x}
        onUpdate={(val) => nodeUpdate(node.id, { x: val })}
      />
      <NodeEditorNumber
        title="y"
        value={node.y}
        onUpdate={(val) => nodeUpdate(node.id, { y: val })}
      />
      <NodeEditorBlank
        title="Color"
        value={node.color}
        default={[0, 0, 0]}
        onUpdate={(val) => nodeUpdate(node.id, { color: val })}
      />
    {/if}

    {#if node.type === 'Circle'}
      <NodeEditorNumber
        title="Radius"
        value={node.radius}
        onUpdate={(val) => nodeUpdate(node.id, { radius: val })}
      />
      <NodeEditorNumber
        title="x"
        value={node.x}
        onUpdate={(val) => nodeUpdate(node.id, { x: val })}
      />
      <NodeEditorNumber
        title="y"
        value={node.y}
        onUpdate={(val) => nodeUpdate(node.id, { y: val })}
      />
    {/if}

    {#if node.type === 'Wave'}
      <NodeEditorSelect
        title="Waveform"
        value={node.waveform}
        options={['sin', 'cos', 'tan']}
        onUpdate={(val) => nodeUpdate(node.id, { waveform: val })}
      />
      <NodeEditorRange
        title="Amplitude"
        value={node.amplitude}
        min={1}
        max={600}
        step={1}
        onUpdate={(val) => nodeUpdate(node.id, { amplitude: val })}
      />
      <NodeEditorRange
        title="Frequency"
        value={node.frequency}
        min={1}
        max={10}
        step={0.1}
        onUpdate={(val) => nodeUpdate(node.id, { frequency: val })}
      />
    {/if}

    {#if node.type === 'Map'}
      <NodeEditorNumber
        title="Min 1"
        value={node.min1}
        onUpdate={(val) => nodeUpdate(node.id, { min1: val })}
      />
      <NodeEditorNumber
        title="Max 1"
        value={node.max1}
        onUpdate={(val) => nodeUpdate(node.id, { max1: val })}
      />
      <NodeEditorNumber
        title="Min 2"
        value={node.min2}
        onUpdate={(val) => nodeUpdate(node.id, { min2: val })}
      />
      <NodeEditorNumber
        title="Max 2"
        value={node.max2}
        onUpdate={(val) => nodeUpdate(node.id, { max2: val })}
      />
    {/if}

    {#if node.type === 'Noise'}
      <NodeEditorRange
        title="Strength"
        value={node.strength}
        min={0}
        max={0.5}
        step={0.05}
        onUpdate={(val) => nodeUpdate(node.id, { strength: val })}
      />
    {/if}

    {#if ['Number'].includes(node.type)}
      <NodeEditorNumber
        title="Value"
        value={node.value}
        onUpdate={(val) => nodeUpdate(node.id, { value: val })}
      />
    {/if}
  </section>
</div>

<style>
  :global([draggable]) {
    -webkit-touch-callout: none;
    -ms-touch-action: none;
    touch-action: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }

  .node {
    width: 220px;
    position: absolute;
    background-color: rgb(29 31 32 / 77%);
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: -2px 4px 13px 0px rgba(0, 0, 0, 0.4);
    /* transition: all .3s; */
  }

  .node-header {
    background-color: rgb(19 21 21 / 34%);
    border-radius: 10px 10px 0px 0px;
    height: 40px;
    cursor: grab;
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

  .node-connector-input {
    position: absolute;
    top: 12px;
    left: -8px;
    display: block;
    cursor: not-allowed;
    background-color: var(--color-gold);
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  .menu-option {
    text-align: center;
    padding: 5px;
    cursor: pointer;
  }

  .colorpicker {
    overflow: hidden;
    height: 214px;
  }
</style>
