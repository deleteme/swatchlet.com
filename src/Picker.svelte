<script>
  import ActionBar from './ActionBar.svelte';
  import Button from './Button.svelte';
  import PickerCanvas from './PickerCanvas.svelte';
  import { picking, swatches, cancelPicking } from './store.js';
  import PinnedRadios from './PinnedRadios.svelte';
  $: document.documentElement.style.background = $swatches[$picking] ? $swatches[$picking].value : 'white';
</script>

<style>
.picker {
  height: 100%;
  position: relative;
  width: 100%;
  transition: background 0.2s;
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
  <PinnedRadios />
  <PickerCanvas />
</div>
