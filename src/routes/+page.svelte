<script lang="ts">
  import { onMount } from 'svelte';
  import type { Node, NodesObj } from './types';
  import Nodes from './comps/Nodes.svelte';
  import Canvas from './comps/Canvas.svelte';
  import nodesStore from './stores/nodes';

  let nodes: Node[] = [];
  let nodesObj: NodesObj;

  onMount(() => {
    nodesStore.subscribe(({ nodes: nds, nodesObj: ndsObj }) => {
      nodes = nds;
      nodesObj = ndsObj;
    });
  });
</script>

<svelte:head>
  <title>Cables</title>
  <meta name="description" content="" />
</svelte:head>

<Nodes {nodes} {nodesObj} />
<Canvas {nodes} {nodesObj} />
