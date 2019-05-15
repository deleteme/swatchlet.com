<script>
  import ActionBar from './ActionBar.svelte';
  import Button from './Button.svelte';
  import PickerCanvas from './PickerCanvas.svelte';
  import { picking, swatches, cancelPicking } from './store.js';
  import { tracking } from './picker-canvas-store.js';
  import PinnedRadios from './PinnedRadios.svelte';
  import { getHighContrastColorFromHex } from './lib/get-high-contrast-color.js';
  $: backgroundColor = $swatches[$picking] ? $swatches[$picking].value : '#ffffff';
  $: document.documentElement.style.background = backgroundColor;
  $: contrastingColor = getHighContrastColorFromHex(backgroundColor);
</script>

<style>
.picker {
  height: 100%;
  position: relative;
  width: 100%;
  transition: background 0.2s;
  user-select: none;
}
.picker.tracking {
  transition: none;
}
.picker :global(.actions) {
  display: flex;
  justify-content: flex-end;
  right: 45px;
  width: 33%;
  z-index: 1;
}
strong {
  font-size: 4vh;
  left: 45px;
  position: absolute;
  top: 45px;
}
</style>

<div class="picker" class:tracking={$tracking} style='background: {backgroundColor}; color: {contrastingColor}'>
  <strong>{$swatches[$picking].value}</strong>
  <ActionBar>
    <Button on:click={cancelPicking}>Close</Button>
  </ActionBar>
  <PinnedRadios />
  <PickerCanvas />
</div>
