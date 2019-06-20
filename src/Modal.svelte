<script>
  import { onMount, onDestroy } from 'svelte';
  import { fly } from 'svelte/transition';
  import { spring } from 'svelte/motion';
  import { quintOut } from 'svelte/easing';
  import { cancelPicking } from './store.js';
  const handleKeyUp = e => {
    if (e.code === 'Escape') cancelPicking();
  }
  export let width = 0;
  export let targetHeight = 0;
  export let targetWidth = 0;
  export let originElementDimensions;
  export let background = '';
  let dimensions = originElementDimensions;
  /*
  target width, height
  original width, height

  original * scale = target
  original = target / scale
  target = original * scale
  target / original = scale
  */
  const position = spring({
    x: dimensions.offsetLeft,
    y: dimensions.offsetTop
  }, { damping: 0.8, stiffness: 0.15 });

  const scale = spring(
    { x: 1, y: 1 },
    { damping: 0.8, stiffness: 0.15 }
  );
  const scaleLag = 50;
  const origin = spring(
    { x: dimensions.offsetWidth, y: dimensions.offsetHeight },
    { damping: 0.8, stiffness: 0.15 }
  );
  $: overlayStyle = [
      `left: ${0}px`,
      `top: ${0}px`,
      `width: ${dimensions.offsetWidth}px`,
      `height: ${dimensions.offsetHeight}px`,
      `transform: scale(${$scale.x}, ${$scale.y}) translate(${$position.x}px, ${$position.y}px)`,
      `transform-origin: ${$origin.x}px ${$origin.y}px`
    ].join('; ')
  $: {
  }
  onMount(() => {
    $position = { x: 0, y: 0 };
    $origin = { x: 0, y: 0 };
    $scale = {
      // scale: target / original
      x: targetWidth / dimensions.offsetWidth,
      y: targetHeight / dimensions.offsetHeight
    }
  });
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
  transform-origin: top left;
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
{#if overlayStyle}
<div class="overlay-overflow">
  <div
    style="{ overlayStyle }; background: { background }"
    class="overlay"
  >
  </div>
</div>
{/if}
{#if false }
<div
  class="modal"
  transition:fly="{{delay: 1, duration: 200, x: width, y: 0, opacity: 1, easing: quintOut}}"
>
  <slot></slot>
</div>
{/if}
