<script lang="ts">
  import colors from '$lib/colors';

  export let title: string;
  export let value: string | number;
  export let onUpdate: any;
  // export let default;

  // export let min: string;
  // export let max: string;
  // export let step: string;

  // {min}
  // {max}
  // {step}

  // <span class="value">{value}</span>
  // TODO onUpdate should use default value
</script>

<label>
  <span>{title}</span>
  {#if typeof value === 'string'}
    <div class="connector" on:click={onUpdate(colors.purple)} />
  {:else}
    <input
      {value}
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
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
  }
  .connector {
    position: absolute;
    top: 6px;
    left: -23px;
    display: block;
    background-color: var(--color-gold);
    width: 16px;
    height: 16px;
    border-radius: 50%;
    cursor: not-allowed;
  }
</style>
