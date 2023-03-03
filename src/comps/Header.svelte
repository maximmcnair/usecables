<script lang="ts">
  import record from '$lib/record';

  export let height: number;
  export let width: number;
  export let canvas: HTMLCanvasElement;
  export let fragShader: string;

  let isRecording = false;

  async function recordCanvas() {
    if (!isRecording) return;
    isRecording = true;
    await record(canvas);
    isRecording = false;
  }

  let showMsg = false;

  async function exportShader() {
    showMsg = true;
    navigator.clipboard.writeText(fragShader);

    setTimeout(() => {
      showMsg = false;
    }, 2000);
  }
</script>

<nav class="canvas-nav">
  <label>
    <strong>Width</strong>
    <input bind:value={width} type="number" min={100} />
  </label>
  <label>
    <strong>Height</strong>
    <input bind:value={height} type="number" min={100} />
  </label>

  {#if false}
    <button class="canvas-record" on:click={recordCanvas}
      >{isRecording ? 'Recording' : 'Record'}</button
    >
  {/if}
</nav>

<footer>
  <button on:click={exportShader}>
    {showMsg ? 'Copied to clipboard' : 'Export shader'}
  </button>
</footer>

<style>
  .canvas-nav {
    position: absolute;
    top: 18px;
    right: 18px;
    z-index: 8;
    display: flex;
    /* background-color: rgb(29 31 32 / 77%); */
    background: rgba(13, 13, 13, 0.002);
    backdrop-filter: blur(10px);
    padding: 10px 20px;
    border-radius: 10px;
    width: 280px;
  }

  .canvas-nav label {
    display: flex;
    flex-direction: row;
    font-size: 16px;
  }

  .canvas-nav strong {
    margin-top: 2px;
  }

  .canvas-nav input {
    margin-left: 10px;
    font-size: 16px;
  }

  .canvas-nav {
    gap: 15px;
  }

  .canvas-nav button {
    background-color: var(--color-white);
    color: var(--color-grey-dark);
    border-radius: 5px;
    border: none;
  }

  :global(.render-video) {
    position: absolute;
    opacity: 0;
    top: 0px;
    width: 100px;
    z-index: 4;
  }

  footer {
    position: absolute;
    bottom: 18px;
    right: 18px;
    z-index: 8;
    display: flex;
    /* background-color: rgb(29 31 32 / 77%); */
    background: rgba(13, 13, 13, 0.002);
    backdrop-filter: blur(10px);
    padding: 10px 20px;
    border-radius: 10px;
    width: 200px;
  }

  footer button {
    background: transparent;
    width: 200px;
    border: none;
    color: var(--color-white);
    cursor: pointer;
    font-size: 16px;
    text-align: center;
  }
</style>
