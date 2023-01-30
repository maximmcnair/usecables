<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade } from 'svelte/transition';

  export let x: number;
  export let y: number;

  const dispatch = createEventDispatcher();

  let menuEl: HTMLDivElement | undefined;

  $: (() => {
    if (!menuEl) return;
    const rect = menuEl.getBoundingClientRect();
    x = Math.min(window.innerWidth - rect.width, x);
    if (y > window.innerHeight - rect.height) y -= rect.height;
  })(x, y);

  function onPageClick(evt: MouseEvent) {
    if (evt.target === menuEl || menuEl?.contains(evt.target)) return;
    dispatch('close');
  }
</script>

<div
  class="menu"
  transition:fade={{ duration: 100 }}
  bind:this={menuEl}
  style="top: {y}px; left: {x}px;"
>
  <slot />
</div>

<svelte:body on:click={onPageClick} />

<style>
  .menu {
    position: absolute;
    display: grid;
    padding: 10px;
    border: 1px solid var(--color-grey-dark);
    background-color: rgb(29 31 32 / 98%);
    box-shadow: -2px 4px 13px 0px rgba(0, 0, 0, 0.4);
    z-index: 9999;
    font-size: 16px;
  }
</style>
