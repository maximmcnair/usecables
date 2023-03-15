<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { nodeCreate } from '$stores/nodes';
  import type { NodeType, Node } from '$types';
  import colors from '$lib/colors';
  import Menu from './Menu.svelte';

  export let x: number;
  export let y: number;

  const dispatch = createEventDispatcher();

  function onBgClick(evt: MouseEvent) {
    dispatch('close');
  }

  async function createNode(title: string, type: NodeType, defaults: Node) {
    dispatch('close');
    // default
    return nodeCreate({
      type: type,
      name: title,
      editorX: x,
      editorY: y,
      ...defaults
    });
  }

  const shapes = [
    { title: 'Box',
      type: 'Box',
      defaults: {
        x: 0,
        y: 10,
        width: 100,
        height: 100,
        color: colors.purple,
      },
    },
    { title: 'Circle',
      type: 'Circle',
      defaults: {
        x: 200,
        y: 200,
        radius: 200,
        color: colors.red,
      },
    }
  ];

  const math = [
    { title: 'Wave',
      type: 'Wave',
      defaults: {
        waveform: 'sin',
        period: 10,
        amplitude: 122,
        frequency: 2,
        offset: 0,
        phase: 0,
      }
    },
    { title: 'Map',
      type: 'Map',
      defaults: {
        input: 100,
        min1: 10,
        max1: 100,
        min2: 10,
        max2: 100
      }
    },
    { title: 'Absolute',
      type: 'Absolute',
      defaults: {}
    },
  ];

  const constants = [
    // { title: 'Canvas Size',
    //   type: 'Resolution',
    //   defaults: {}
    // },
    { title: 'Time',
      type: 'Time',
      defaults: {}
    },
    { title: 'Color',
      type: 'Color',
      defaults: {
        rgb: colors.blue,
      }
    },
    // { title: 'Mouse',
    //   type: 'Mouse',
    //   defaults: {}
    // },
    { title: 'Number',
      type: 'Number',
      defaults: {}
    },
    // { title: 'Vector',
    //   type: 'Vector',
    //   defaults: {}
    // },
  ];

  const effects = [
    { title: 'Noise',
      type: 'Noise',
      defaults: {
        strength: 0.1
      }
    },
  ];
</script>

<Menu {x} {y}>
  <div class="node-creator">
    <div class="creator-columns">
      <div class="creator-col">
        <small class="menu-title">Create</small>
      </div>
      <div class="creator-col">
        <small class="menu-title">Shapes</small>
        {#each shapes as node}
          <span class="menu-option" on:click={() => createNode(node.title, node.type, node.defaults)}
            >{node.title}</span
          >
        {/each}
      </div>
      <div class="creator-col">
        <small class="menu-title">Math</small>
        {#each math as node}
          <span class="menu-option" on:click={() => createNode(node.title, node.type, node.defaults)}
            >{node.title}</span
          >
        {/each}
      </div>
      <div class="creator-col">
        <small class="menu-title">Constants</small>
        {#each constants as node}
          <span class="menu-option" on:click={() => createNode(node.title, node.type, node.defaults)}
            >{node.title}</span
          >
        {/each}
      </div>
      <div class="creator-col">
        <small class="menu-title">Effects</small>
        {#each effects as node}
          <span class="menu-option" on:click={() => createNode(node.title, node.type, node.defaults)}
            >{node.title}</span
          >
        {/each}
      </div>
    </div>
  </div>
</Menu>

<!-- <svelte:body on:click={onBgClick} /> -->

<div class="creator-bg" on:click={onBgClick} />

<style>
  .creator-bg {
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    z-index: 88;
  }

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
    user-select: none;
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
