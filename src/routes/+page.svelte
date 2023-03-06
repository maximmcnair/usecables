<script lang="ts">
  import { onMount } from 'svelte';
  import type { Node, NodesObj } from '$types';
  import Nodes from '$comps/Nodes.svelte';
  import OnBoarding from '$comps/OnBoarding.svelte';
  import nodesStore from '$stores/nodes';

  let nodes: Node[] = [];
  let nodesObj: NodesObj;
  let canvas: any = null;

  onMount(async () => {
    nodesStore.subscribe(({ nodes: nds, nodesObj: ndsObj }) => {
      nodes = nds;
      nodesObj = ndsObj;
    });

    try {
      canvas = (await import('../comps/Canvas.svelte')).default;
    } catch (err) {
      console.error(err);
    }
  });
</script>

<svelte:head>
  <title>Cables</title>
  <meta name="description" content="" />
</svelte:head>

<OnBoarding />

<Nodes {nodes} {nodesObj} />

<svelte:component this={canvas} {nodes} {nodesObj} />

