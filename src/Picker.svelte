<script>
  import { onMount, onDestroy } from 'svelte';
  import ActionBar from './ActionBar.svelte';
  import Button from './Button.svelte';
  import ButtonLink from './ButtonLink.svelte';
  import PickerCanvas from './PickerCanvas.svelte';
  import { name, picking, swatches, cancelPicking, pickingSwatch, swatchesDimensions } from './store.js';
  import { tracking } from './picker-canvas-store.js';
  import PinnedRadios from './PinnedRadios.svelte';
  import { getHighContrastColorFromHex } from './lib/get-high-contrast-color.js';
  import isValidHex from './lib/is-valid-hex.js';
  import Modal from './Modal.svelte';
  import { renderHash } from './url-helpers.js';
  import delay from './lib/delay.js';

  $: backgroundColor = $swatches[$picking] && $swatches[$picking].value;
  $: previousBackgroundColor = $swatches[$picking] ? $swatches[$picking].value : previousBackgroundColor;
  $: background = previousBackgroundColor;
  $: contrastingColor = getHighContrastColorFromHex(backgroundColor || previousBackgroundColor);
  $: originElementDimensions = $swatchesDimensions[$picking]
  $: previousOriginElementDimensions = originElementDimensions || previousOriginElementDimensions;

  export let width = 0;
  export let height = 0;
  let value = $pickingSwatch.value;
  let isOpen = true;
  const timeScale = 1;
  const duration1 = 200 * timeScale;
  const duration2 = 150 * timeScale;
  const effectOverlap = 50 * timeScale;

  $: {
    if (isValidHex(value) && $pickingSwatch) {
      $swatches[$picking].value = value;
    }
  }

  $: removeHref = renderHash({
    name: $name,
    swatches: $swatches.filter((s, j) => {
      return $picking !== j;
    })
  });

  let unsub = pickingSwatch.subscribe((swatch) => {
    if (swatch && swatch.value !== value) {
      value = swatch.value;
    }
  });
  onDestroy(() => {
    console.log('picker unmounted');
    unsub();
  });

  const close = () => {
    console.log('close');
    isOpen = false;
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('resolving');
        resolve()
    }, duration1 + duration2 - effectOverlap + 1);
    });
  };

  const handleRemoveButton = e => {
    e.preventDefault();
    const href = e.target.href;
    close().then(() => {
      cancelPicking();
      location.href = href;
    });
  };
  const handleCloseButton = e => {
    e.preventDefault();
    close().then(() => {
      console.log('about to cancel picking');
      cancelPicking();
    });
  };
  onMount(() => {
    console.log('picker mounted');
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
@media screen and (min-width: 0) and (max-width: 812px) {
  input {
    left: 30px;
  }
  .picker :global(.actions) {
    right: 30px;
    top: 43px;
  }
}
</style>


<svelte:head>
{@html `<style>html { background: ${backgroundColor || previousBackgroundColor} }</style>`}
</svelte:head>
{#if isOpen }
<Modal
  targetWidth={width}
  targetHeight={height}
  dimensions={previousOriginElementDimensions}
  background={background}
  duration1={duration1}
  duration2={duration2}
  effectOverlap={effectOverlap}
>
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
      <ButtonLink href={removeHref} class='swatch-action' on:click={handleRemoveButton}>
        Remove
      </ButtonLink>
      <Button on:click={handleCloseButton}>Close</Button>
    </ActionBar>
    <PinnedRadios />
    <PickerCanvas />
  </div>
</Modal>
{/if}
