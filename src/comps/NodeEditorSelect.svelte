<script lang="ts">
  export let title: string;
  export let value: string;
  export let options: string[];
  export let onUpdate: any;
</script>

<label>
  <span>{title}</span>
  <select {value} on:change={(evt) => onUpdate(evt.currentTarget.value)}>
    {#each options as option}
      <option value={option}>{option}</option>
    {/each}
  </select>
</label>

<style>
  label {
    /* background-color: blue; */
    height: 70px;
    margin-bottom: 15px;
    display: block;
    width: 100%;
    position: relative;
  }

  option {
    background-color: var(--color-grey-dark);
    color: var(--color-white);
    padding: 5px 0px;
  }
  span {
    display: block;
    color: white;
    font-size: var(--typesize-small);
  }
</style>
