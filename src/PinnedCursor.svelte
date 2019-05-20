<script>
  import { spring } from 'svelte/motion';

  const initialLeft = -1;
  const initialTop = -1;
  let transform = '';
  export let left = initialLeft;
  export let top = initialTop;
  export let width = 10;
  const coords = spring({ left: left, top: top }, {
    stiffness: 0.2,
    damping: 0.8
  });
  $: isUsingDefaults = left === initialLeft || top === initialTop;
  $: isSettled = $coords.left === left && $coords.top === top;
  $: initialized = !isUsingDefaults;

  $: {
    if (!isUsingDefaults) {
      if (!isSettled) {
        coords.set({ left: left, top: top });
      }
      transform = `transform: translateX(${$coords.left}px) translateY(${$coords.top}px);`;
    }
  }
</script>
<style>
.pinned-cursor {
  background: none;
  border: 3px solid white;
  border-radius: 3px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  display: none;
  height: 7px;
  left: -3px;
  position: absolute;
  pointer-events: none;
  top: -3px;
}
.initialized {
  display: block;
}
</style>

<div
  class="pinned-cursor"
  class:initialized={initialized}
  style="{transform} width: {width + (3 * 2)}px;"
></div>
