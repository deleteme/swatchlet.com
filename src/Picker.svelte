<script>
  import ActionBar from './ActionBar.svelte';
  import Button from './Button.svelte';
  import store, { cancelPicking } from './store.js';
</script>

<style>
.picker {
  height: 100%;
  width: 100%;
}
.picker:hover :global(.actions) {
  display: flex;
  justify-content: flex-end;
}
</style>

<div class="picker" style='background: {$swatches[$picking].value}'>
  <ActionBar>
    Picking: {$swatches[$picking].name}
    <Button on:click="cancelPicking()">X</Button>
  </ActionBar>
</div>
