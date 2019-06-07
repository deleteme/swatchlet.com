<script>
  import { onMount, onDestroy } from 'svelte';
  import ActionBar from './ActionBar.svelte';
  import Button from './Button.svelte';
  import PickerCanvas from './PickerCanvas.svelte';
  import { picking, swatches, cancelPicking, pickingSwatch } from './store.js';
  import { tracking } from './picker-canvas-store.js';
  import PinnedRadios from './PinnedRadios.svelte';
  import { getHighContrastColorFromHex } from './lib/get-high-contrast-color.js';
  import isValidHex from './lib/is-valid-hex.js';
  import Modal from './Modal.svelte';
  $: backgroundColor = $swatches[$picking] && $swatches[$picking].value;
  $: previousBackgroundColor = $swatches[$picking] ? $swatches[$picking].value : previousBackgroundColor;
  $: document.documentElement.style.background = backgroundColor || previousBackgroundColor;
  $: contrastingColor = getHighContrastColorFromHex(backgroundColor || previousBackgroundColor);

  export let width = 0;
  let value = $pickingSwatch.value;

  $: {
    if (isValidHex(value) && $pickingSwatch) {
      $swatches[$picking].value = value;
    }
  }

  let unsub = pickingSwatch.subscribe((swatch) => {
    if (swatch && swatch.value !== value) {
      value = swatch.value;
    }
  });
  onDestroy(() => {
    unsub();
  });
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
  top: 50px;
  width: 33%;
  z-index: 1;
}
input {
  background: none;
  border: 0;
  border-radius: 0;
  font-size: 4vh;
  font-weight: bold;
  left: 45px;
  margin: 0;
  padding: 0;
  position: absolute;
  top: 45px;
  width: 6em;
}

input:hover, input:focus {
  border-bottom: 3px solid;
}
</style>

<Modal width={width}>
  <div
    class="picker"
    class:tracking={$tracking}
    style='background: {backgroundColor || previousBackgroundColor}; color: {contrastingColor};'
  >
    <input
      type="text"
      bind:value={value}
      style='color: {contrastingColor}; border-color: {contrastingColor};'
    />
    <ActionBar>
      <Button on:click={cancelPicking}>Close</Button>
    </ActionBar>
    <PinnedRadios />
    <PickerCanvas />
  </div>
</Modal>
