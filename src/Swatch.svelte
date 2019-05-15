<script>
  import { renderHash } from './url-helpers.js';
  import ButtonLink from './ButtonLink.svelte';
  import Button from './Button.svelte';
  import ActionBar from './ActionBar.svelte';
  import { pick, swatches, name } from './store.js';
  import { getHighContrastColorFromHex } from './lib/get-high-contrast-color.js';
  export let i;
  export let value;
  let swatchName;
  export { swatchName as name };
  const safe = (fn, fallback) => {
    try {
      const v = fn();
      return v;
    } catch (e) {
      return fallback;
    }
  };
  $: edit = (value, i) => {
    location.hash = renderHash({
      name: $name,
      swatches: $swatches.map((swatch, j) => {
        return i === j ? { value } : swatch
      })
    });
  };
  $: removeHref = renderHash({
    name: $name,
    swatches: $swatches.filter((s, j) => {
      return i !== j;
    })
  });
  $: contrastingColor = safe(() => getHighContrastColorFromHex(value), '#000');
</script>

<style>
.swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s;
  position: relative;
  width: 100%;
}

.swatch:hover :global(.actions) {
  display: flex;
  justify-content: flex-end;
}

:global(.swatch-action) {
  margin-left: 5px;
}

input {
  background: none;
  border: 0;
  border-radius: 5px;
  font-weight: bold;
  height: 40%;
  margin: 0;
  padding: 0;
  position: relative;
  text-align: center;
  width: 100%;
}
</style>

<div class="swatch" style='background-color: {value}; color: {contrastingColor}'>
  <input
    type="text"
    bind:value={value}
    on:change={() => edit(value, i)}
    style='font-size: calc(100vw / {$swatches.length} * 0.2); color: { contrastingColor }'
  />
  <ActionBar>
    {swatchName}
    <Button on:click={() => pick(i)} type='button' class='swatch-action'>
      Pick
    </Button>
    <ButtonLink href={removeHref} class='swatch-action'>
      X
    </ButtonLink>
  </ActionBar>
</div>
