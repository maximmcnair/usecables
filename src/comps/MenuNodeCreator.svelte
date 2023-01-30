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
        value: 10,
      });
    }
    if (type === 'Noise') {
      return nodeCreate({
        type: 'Noise',
        name: 'Noise',
        editorX: x,
        editorY: y,
        strength: 0.1,
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
  <small class="menu-title">Create Node</small>
  <span class="menu-option" on:click={() => createNode('Circle')}>Circle</span>
  <span class="menu-option" on:click={() => createNode('Box')}>Box</span>
  <small class="menu-title">Math</small>
  <span class="menu-option" on:click={() => createNode('Wave')}>Wave</span>
  <span class="menu-option" on:click={() => createNode('Map')}>Map</span>
  <span class="menu-option" on:click={() => createNode('Absolute')}>Absolute</span>
  <small class="menu-title">Constants</small>
  <!-- <span on:click={() => createNode('Resolution')}>Resolution</span> -->
  <span class="menu-option" on:click={() => createNode('Time')}>Time</span>
  <span class="menu-option" on:click={() => createNode('Number')}>Number</span>
  <small class="menu-title">Effects</small>
  <span class="menu-option" on:click={() => createNode('Noise')}>Noise</span>
</Menu>

<svelte:body on:click={onPageClick} />

<style>
  .menu-title,
  .menu-option {
    text-align: center;
    padding: 5px;
    cursor: pointer;
  }
  .menu-title {
    color: var(--color-grey-light);
  }
</style>
