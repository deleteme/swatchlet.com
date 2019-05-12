<script>
  import ActionBar from './ActionBar.svelte';
  import Button from './Button.svelte';
  import PickerCanvas from './PickerCanvas.svelte';
  import { picking, swatches, cancelPicking } from './store.js';
</script>

<style>
.picker {
  height: 100%;
  position: relative;
  width: 100%;
}
.picker:hover :global(.actions) {
  display: flex;
  justify-content: flex-end;
  z-index: 1;
}
</style>

<div class="picker" style='background: {$swatches[$picking].value}'>
  <ActionBar>
    Picking: {$swatches[$picking].name}
    <Button on:click={cancelPicking}>X</Button>
  </ActionBar>
  <PickerCanvas />
</div>
