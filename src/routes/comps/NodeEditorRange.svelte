<script lang="ts">
  export let title: string;
  export let value: number;
  export let min: number;
  export let max: number;
  export let onUpdate: any;
</script>

<label>
  <span>{title}</span>
  <input
    {value}
    type="range"
    {min}
    {max}
    on:change={(evt) => onUpdate(evt.currentTarget.value)}
  />
</label>

<style>
  label {
    /* background-color: blue; */
    height: 55px;
    margin-bottom: 15px;
    display: block;
    width: 100%;
    position: relative;
  }
  span {
    display: block;
    color: white;
    font-size: var(--typesize-small);
  }
</style>
