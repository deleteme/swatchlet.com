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
  let isHovering = false;
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
  $: outerBackgroundColor = isHovering ? '' : `background-color: ${value}`;
  const handleMouseenter = () => isHovering = true;
  const handleMouseleave = () => isHovering = false;
</script>

<style>
.swatch {
  box-sizing: border-box;
  /*border: 3px solid;*/
  /*
  display: flex;
  align-items: center;
  justify-content: center;
  */
  position: relative;
  width: 100%;
  border-radius: 3px;
}

.swatch.swatch-is-hovering:hover {
  /*border-color: white !important;*/
  background-color: white;
}

.swatch:hover :global(.actions) {
  display: flex;
  justify-content: flex-end;
}

:global(.swatch-action) {
  margin-left: 5px;
}

.swatch-inner {
  --gap: 3px;
  border-radius: 8px;
  bottom: var(--gap);
  display: flex;
  align-items: center;
  height: calc(100% - var(--gap) * 2);
  left: var(--gap);
  margin: 3px;
  justify-content: center;
  right: var(--gap);
  top: var(--gap);
  transition: background 0.5s;
  width: calc(100% - var(--gap) * 2);
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

<div
  class="swatch" class:swatch-is-hovering={isHovering}
  style='{outerBackgroundColor}; color: {contrastingColor};'
  on:click={() => pick(i)}
  on:mouseenter={handleMouseenter}
  on:mouseleave={handleMouseleave}
>
  <div
    class="swatch-inner"
    style="background-color: {value};"
  >
    <input
      type="text"
      bind:value={value}
      style='font-size: calc(100vw / {$swatches.length} * 0.2); color: { contrastingColor }'
      on:change={() => edit(value, i)}
    />
    <ActionBar>
      {swatchName}
      <ButtonLink href={removeHref} class='swatch-action'>
        Remove
      </ButtonLink>
    </ActionBar>
  </div>
</div>
