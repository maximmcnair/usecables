<script lang="ts">
  export let title: string;
  export let value: string | number;
  export let onUpdate: any;

  // export let min: number | undefined;
  // export let max: number | undefined;
  // min={min}
  // max={max}
</script>

<label>
  <span>{title}</span>
  {#if typeof value === 'string'} 
    <span class="value">{value}</span>
    <div class="connector" />
  {:else}
    <input 
      value={value} 
      type="number"
      on:change={(evt) => onUpdate(Number(evt.currentTarget.value))}
    />
  {/if}
</label>

<style>
  label {
    /* background-color: blue; */
    height: 20px;
    margin-bottom: 15px;
    display: block;
    width: 100%;
    position: relative;
  }
  span {
    color: white;
    font-size: var(--typesize-small);
  }
  span.value,
  input {
    position: absolute;
    top: 4px;
    right: 0px;
    width: 60px;
    text-align: right;
  }
  input {
    background: transparent;
    font-size: var(--typesize-small);
  }
  input[type=number]::-webkit-inner-spin-button, 
  input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
  }
  .connector {
    position: absolute;
    top: 8px;
    left: -23px;
    display: block;
    background-color: var(--color-gold);
    width: 15px;
    height: 15px;
    border-radius: 50%;
  }
</style>
