<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import * as easing from 'svelte/easing';
  import { cancelPicking } from './store.js';
  const handleKeyUp = e => {
    if (e.code === 'Escape') cancelPicking();
  }
  export let targetHeight = 0;
  export let targetWidth = 0;
  export let originElementDimensions;
  export let background = '';
  let dimensions = originElementDimensions;
  $: transitionSwatchScale = {
      duration: 150,
      position: {
        start: { x: dimensions.offsetLeft, y: dimensions.offsetTop },
        end: { x: 0, y: 0 },
      },
      origin: {
        end: { x: 0, y: 0 },
        start: { x: dimensions.offsetLeft / 2, y: dimensions.offsetTop / 2 },
      },
      scale: {
        start: {
          x: dimensions.offsetWidth / targetWidth,
          y: dimensions.offsetHeight / targetHeight
        },
        end: { x: 1, y: 1 },
      }}
  function renderTransformStyles (s, p, o) {
    const includeOrigin = false;
    var styles = `
      transform: scale(${s.x}, ${s.y}) translate(${p.x}px, ${p.y}px);
      `.trim();
    if (includeOrigin) styles += `transform-origin: ${o.x} ${o.y}`;
    return styles;
  }
  function swatchScale(node, { duration, scale, position, origin }) {
    const css = t => {
      t = easing.cubicOut(t);
      const o = {
        x: (origin.start.x - origin.end.x) * (1 - t),
        y: (origin.start.y - origin.end.y) * (1 - t)
      };
      const s = {
        x: scale.start.x + (Math.abs(scale.start.x - scale.end.x) * t),
        y: scale.start.y + (Math.abs(scale.start.y - scale.end.y) * t)
      };
      const p = {
        x: Math.abs((position.end.x - position.start.x) * (1 - t)) / s.x,
        y: Math.abs((position.end.y - position.start.y) * (1 - t)) / s.y
      };
      return renderTransformStyles(s, p, o);
    };
    return { duration, css };
  }

  $: overlayStyle = [
      `left: 0px`,
      `top: 0px`,
      `width:  ${targetWidth}px`,
      `height: ${targetHeight}px`,
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
  <div
    style="{ overlayStyle }; background: { background }"
    class="overlay"
    transition:swatchScale|local="{transitionSwatchScale}"
  >
  </div>
  <div
    class="modal"
    in:fly|local="{{delay: 100, duration: 200, x: targetWidth / 10, y: 0, opacity: 0, easing: easing.quintOut}}"
    out:fly|local="{{delay: 0, duration: 100, x: targetWidth / 10, y: 0, opacity: 0, easing: easing.quintOut}}"
  >
    <slot></slot>
  </div>
</div>
