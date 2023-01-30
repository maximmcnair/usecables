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
    if (type === 'Box') {
      nodeCreate({
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
      nodeCreate({
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
      nodeCreate({
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
      nodeCreate({
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
    dispatch('close');
  }
</script>

<Menu x={x} y={y}>
  <span on:click={() => createNode('Circle')}>Create Circle</span>
  <span on:click={() => createNode('Box')}>Create Box</span>
  <span on:click={() => createNode('Wave')}>Create Wave</span>
  <span on:click={() => createNode('Map')}>Create Map</span>
</Menu>

<svelte:body on:click={onPageClick} />
