<script lang="ts">
  import type { Node, NodesObj } from '../../types';
  import NodeEditor from './NodeEditor.svelte';

  export let nodes: Node[];
  export let nodesObj: NodesObj;
</script>

<section class="nodes">
  <section class="nodes-editor">
    {#each nodes as node}
      <NodeEditor {node} />
    {/each}
  </section>
</section>

<style>
  .nodes {
    position: absolute;
    top: 0px;
    bottom: 0px;
    right: 0px;
    left: 0px;
    z-index: 3;
    overflow: hidden;
  }

  .nodes-editor {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
