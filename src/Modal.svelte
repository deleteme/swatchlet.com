<script>
  import { fly } from 'svelte/transition';
  import * as easing from 'svelte/easing';
  import { cancelPicking } from './store.js';
  const handleKeyUp = e => {
    if (e.code === 'Escape') cancelPicking();
  }
  export let targetHeight = 0;
  export let targetWidth = 0;
  export let background = '';
  export let dimensions;
  $: cachedDimensions = dimensions ? dimensions : cachedDimensions;

  $: transitionSwatchScale = cachedDimensions ? {
      position: {
        start: { x: cachedDimensions.offsetLeft, y: cachedDimensions.offsetTop },
        end: { x: 0, y: 0 },
      },
      scale: {
        start: {
          x: cachedDimensions.offsetWidth / targetWidth,
          y: cachedDimensions.offsetHeight / targetHeight
        },
        end: { x: 1, y: 1 },
      }} : null;

  function renderTransformStyles (s, p) {
    const styles = `
      transform: scale(${s.x}, ${s.y}) translate(${p.x}px, ${p.y}px);
      `.trim();
    return styles;
  }

  function swatchScale(node, { duration, scale, position }) {
    console.log({ duration, scale, position });
    const css = t => {
      t = easing.cubicOut(t);
      const s = {
        x: scale.start.x + (Math.abs(scale.start.x - scale.end.x) * t),
        y: scale.start.y + (Math.abs(scale.start.y - scale.end.y) * t)
      };
      const p = {
        x: Math.abs((position.end.x - position.start.x) * (1 - t)) / s.x,
        y: Math.abs((position.end.y - position.start.y) * (1 - t)) / s.y
      };
      return renderTransformStyles(s, p);
    };
    return { duration, css };
  }

  $: overlayStyle = [
      `width:  ${targetWidth}px`,
      `height: ${targetHeight}px`,
      `background: ${background}`
    ].join('; ')
</script>
<style>
.modal {
  height: 100%;
  position: relative;
  width: 100%;
  z-index: 1;
}
.overlay {
  left: 0;
  top: 0;
  position: absolute;
  transform-origin: 0px 0px;
  z-index: 1;
}
.overlay-overflow {
  height: 100%;
  overflow: hidden;
  position: absolute;
  width: 100%;
  z-index: 1;
}
</style>
<svelte:window on:keyup={handleKeyUp}></svelte:window>
<div class="overlay-overflow">
  {#if transitionSwatchScale}
  <div
    style="{ overlayStyle }"
    class="overlay"
    in:swatchScale="{{ ...transitionSwatchScale, duration: 200 }}"
    out:swatchScale="{{ ...transitionSwatchScale, delay: 150, duration: 200 }}"
  >
  </div>
  {/if}
  <div
    class="modal"
    in:fly="{{ delay: 200, duration: 150, x: targetWidth / 10, y: 0, opacity: 0, easing: easing.quintOut }}"
    out:fly="{{ delay: 0, duration: 150, x: targetWidth / 10, y: 0, opacity: 0, easing: easing.quintOut }}"
  >
    <slot></slot>
  </div>
</div>
