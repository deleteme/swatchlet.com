<script>
  import { fly, fade } from 'svelte/transition';
  import * as easing from 'svelte/easing';
  import { cancelPicking } from './store.js';
  const handleKeyUp = e => {
    if (e.code === 'Escape') cancelPicking();
  }
  export let targetHeight = 0;
  export let targetWidth = 0;
  export let background = '';
  export let dimensions;
  export let forceHidden = false;
  //$: cachedDimensions = dimensions ? dimensions : cachedDimensions;

  $: transitionSwatchScale = dimensions ? {
      position: {
        start: { x: dimensions.offsetLeft, y: dimensions.offsetTop },
        end: { x: 0, y: 0 },
      },
      scale: {
        start: {
          x: dimensions.offsetWidth / targetWidth,
          y: dimensions.offsetHeight / targetHeight
        },
        end: { x: 1, y: 1 },
      }} : null;

  function renderTransformStyles (s, p) {
    const styles = `
      transform: scale(${s.x}, ${s.y}) translate(${p.x}px, ${p.y}px);
      `.trim();
    return styles;
  }

  function swatchScale(node, { duration, scale, position, reverse }) {
    console.log('swatchScale called', { duration, scale, position, reverse });
    const css = t => {
      console.log('t', t);
      //if (reverse) t = 100 - t;
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
  function swatchScaleOut(node, options) {
    console.log('swatch scale out called');
    return swatchScale(node, { ...options, reverse: true });
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

.force-hidden {
  display: none;
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
<!--
    transition:fade
    transition:swatchScale="{{ ...transitionSwatchScale, duration: 2000 }}"
    in:swatchScale="{{ ...transitionSwatchScale, duration: 2000 }}"
    out:swatchScaleOut|local="{{ ...transitionSwatchScale, delay: 1500, duration: 2000 }}"
-->
<div class="overlay-overflow {forceHidden ? 'force-hidden' : ''}">
  <div
    style="{ overlayStyle }"
    class="overlay"
    in:swatchScale="{{ ...transitionSwatchScale, duration: 2000 }}"
    out:swatchScaleOut="{{ ...transitionSwatchScale, delay: 1500, duration: 2000 }}"
  >
  </div>
  <div
    class="modal"
    in:fly="{{ delay: 2000, duration: 1500, x: targetWidth / 10, y: 0, opacity: 0, easing: easing.quintOut }}"
    out:fly="{{ delay: 0, duration: 1500, x: targetWidth / 10, y: 0, opacity: 0, easing: easing.quintOut }}"
  >
    <slot></slot>
  </div>
</div>
