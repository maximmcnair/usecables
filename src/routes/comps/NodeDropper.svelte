<script lang="ts">
  export let x: number;
  export let y: number;
  export let prop: string;
  export let createConnection: any;
</script>

<div
  class="dropper"
  style={`top: ${y - 7}px; left: ${x - 8}px;`}
  on:dragover={(evt) => {
    evt.preventDefault();
  }}
  on:drop={(evt) => {
    if (evt?.dataTransfer) {
      createConnection(evt.dataTransfer.getData('text'));
    }
  }}
/>

<style>
  .dropper {
    position: absolute;
    height: 16px;
    width: 16px;
    border-radius: 10px;
    z-index: 44;
    background-color: rgba(255, 255, 255, 0.58);
  }
</style>
