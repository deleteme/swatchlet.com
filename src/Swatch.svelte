<script>
  import { onMount, onDestroy } from 'svelte';
  import { renderHash } from './url-helpers.js';
  import { isMobile } from './breakpoint-store.js';
  import ButtonLink from './ButtonLink.svelte';
  import Button from './Button.svelte';
  import ActionBar from './ActionBar.svelte';
  import { pick, swatches, name, picking, swatchesDimensions } from './store.js';
  import { getHighContrastColorFromHex } from './lib/get-high-contrast-color.js';
  export let i;
  export let value;
  let isHovering = false;
  const noop = () => {};
  const safe = (fn, fallback) => {
    try {
      const v = fn();
      return v;
    } catch (e) {
      return fallback;
    }
  };
  $: removeHref = renderHash({
    name: $name,
    swatches: $swatches.filter((s, j) => {
      return i !== j;
    })
  });
  $: contrastingColor = safe(() => getHighContrastColorFromHex(value), '#000');
  $: outerBackgroundColor = isHovering ? '' : `background-color: ${value}`;
  $: valueFontSize = $isMobile ? '10vw' : `calc(100vw / ${$swatches.length} * 0.2)`;

  let element;

  const measure = () => {
    let { offsetWidth, offsetHeight, offsetLeft, offsetTop } = element;
    let parentElement = element.parentElement;
    while (parentElement) {
      offsetLeft += parentElement.offsetLeft;
      offsetTop += parentElement.offsetTop;
      parentElement = parentElement.parentElement;
    }
    return { offsetWidth, offsetHeight, offsetLeft, offsetTop };
  };

  const isAnchor = e => e.target.tagName === 'A';
  const measureDimensions = () => {
    $swatchesDimensions = {
      ...$swatchesDimensions,
      [i]: measure()
    };
  };
  const handleWindowResize = () => { measureDimensions(); };
  onMount(measureDimensions);
  onDestroy(() => {
    $swatchesDimensions = { ...$swatchesDimensions, [i]: null }
  });

</script>

<style>
.swatch {
  box-sizing: border-box;
  display: inline-flex;
  height: 100%;
  margin: auto;
  position: relative;
  width: 100%;
  border-radius: 3px;
  user-select: none;
}

.swatch.swatch-is-hovering:hover {
  background-color: white;
}

.swatch:hover :global(.actions) {
  display: flex;
  justify-content: flex-end;
}

:global(.swatch-action) {
  margin-right: 5px;
}

.swatch-inner {
  --gap: 0px;
  border-radius: 0px;
  bottom: var(--gap);
  display: flex;
  align-items: center;
  height: calc(100% - var(--gap) * 2);
  left: var(--gap);
  justify-content: center;
  right: var(--gap);
  top: var(--gap);
  transition: background 0.5s;
  width: calc(100% - var(--gap) * 2);
}

.value {
  cursor: default;
  font-weight: bold;
  margin: 0;
  padding: 0;
  position: relative;
  text-align: center;
  width: 100%;
}
</style>

<window on:resize={handleWindowResize} />
<div
  class="swatch" class:swatch-is-hovering={isHovering}
  style='{outerBackgroundColor}; color: {contrastingColor};'
  on:click={(e) => { if (!isAnchor(e)) { pick(i) }}}
  bind:this={element}
>
  <div
    class="swatch-inner"
    style="background-color: {value};"
  >
    <span
      class="value"
      style='font-size: {valueFontSize}; color: { contrastingColor }'
    >{value}</span>
    {#if !$isMobile}
      <ActionBar>
        <ButtonLink href={removeHref} class='swatch-action'>
          Remove
        </ButtonLink>
      </ActionBar>
    {/if}
  </div>
</div>
