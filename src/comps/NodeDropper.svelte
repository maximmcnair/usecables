<script lang="ts">
  export let x: number;
  export let y: number;
  export let prop: string;
  export let createConnection: any;
</script>

<div
  class="dropper"
  style={`top: ${y - 10 - 7}px; left: ${x - 10 - 8}px;`}
  on:dragover={(evt) => {
    evt.preventDefault();
  }}
  on:drop={(evt) => {
    if (evt?.dataTransfer) {
      createConnection(evt.dataTransfer.getData('text'));
    }
  }}
/>

<div class="dropper-vis" style={`top: ${y - 7}px; left: ${x - 8}px;`} />

<style>
  .dropper-vis {
    position: absolute;
    z-index: 33;
    pointer-events: none;
    height: 16px;
    width: 16px;
    background-color: rgba(255, 255, 255, 0.58);
    border-radius: 10px;
  }

  .dropper {
    position: absolute;
    z-index: 44;
    /* background-color: red; */
    height: 36px;
    width: 36px;
  }
</style>
