<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { nodeCreate } from '$stores/nodes';
  import type { NodeType, NodeBox } from '$types';
  import colors from '$lib/colors';
  import Menu from './Menu.svelte';

  export let x: number;
  export let y: number;

  const dispatch = createEventDispatcher();

  function onPageClick(evt: MouseEvent) {
    dispatch('close');
  }

  async function createNode(type: NodeType) {
    dispatch('close');
    if (type === 'Box') {
      return nodeCreate({
        type: 'Box',
        name: 'Box',
        x: 0,
        y: 10,
        width: 100,
        height: 100,
        color: colors.purple,
        editorX: x,
        editorY: y
      } as Omit<NodeBox, 'id'>);
    }
    if (type === 'Circle') {
      return nodeCreate({
        type: 'Circle',
        name: 'Circle',
        x: 200,
        y: 200,
        radius: 200,
        color: colors.red,
        editorX: x,
        editorY: y
      });
    }
    if (type === 'Wave') {
      return nodeCreate({
        type: 'Wave',
        name: 'Wave',
        waveform: 'sin',
        period: 10,
        amplitude: 122,
        frequency: 2,
        offset: 0,
        phase: 0,
        editorX: x,
        editorY: y
      });
    }
    if (type === 'Map') {
      return nodeCreate({
        type: 'Map',
        name: 'Map',
        editorX: x,
        editorY: y,
        input: 100,
        min1: 10,
        max1: 100,
        min2: 10,
        max2: 100
      });
    }
    if (type === 'Number') {
      return nodeCreate({
        type: 'Number',
        name: 'Number',
        editorX: x,
        editorY: y,
        value: 10
      });
    }
    if (type === 'Noise') {
      return nodeCreate({
        type: 'Noise',
        name: 'Noise',
        editorX: x,
        editorY: y,
        strength: 0.1
      });
    }
    // default
    return nodeCreate({
      type: type,
      name: type,
      editorX: x,
      editorY: y
    });
    dispatch('close');
  }
</script>

<Menu {x} {y}>
  <div class="node-creator">
    <div class="creator-columns">
      <div class="creator-col">
        <small class="menu-title">Create</small>
      </div>
      <div class="creator-col">
        <small class="menu-title">Shapes</small>
        <span class="menu-option" on:click={() => createNode('Circle')}
          >Circle</span
        >
        <span class="menu-option" on:click={() => createNode('Box')}>Box</span>
      </div>
      <div class="creator-col">
        <small class="menu-title">Math</small>
        <span class="menu-option" on:click={() => createNode('Wave')}>Wave</span
        >
        <span class="menu-option" on:click={() => createNode('Map')}>Map</span>
        <span class="menu-option" on:click={() => createNode('Absolute')}
          >Absolute</span
        >
      </div>
      <div class="creator-col">
        <small class="menu-title">Constants</small>
        <!-- <span on:click={() => createNode('Resolution')}>Resolution</span> -->
        <span class="menu-option" on:click={() => createNode('Time')}>Time</span
        >
        <span class="menu-option" on:click={() => createNode('Number')}
          >Number</span
        >
      </div>
      <div class="creator-col">
        <small class="menu-title">Effects</small>
        <span class="menu-option" on:click={() => createNode('Noise')}
          >Noise</span
        >
      </div>
    </div>
  </div>
</Menu>

<svelte:body on:click={onPageClick} />

<style>
  .node-creator {
    width: 480px;
  }

  .creator-columns {
    display: flex;
    flex-direction: row;
  }

  .creator-col {
    width: 20%;
  }

  .menu-title,
  .menu-option {
    display: block;
    padding: 5px;
  }
  .menu-title {
    color: var(--color-grey-light);
  }
  .menu-option {
    color: rgba(350, 350, 350, 0.7);
    transition: color 0.3s;
    cursor: pointer;
  }
  .menu-option:hover {
    color: rgba(350, 350, 350, 1);
  }
</style>
