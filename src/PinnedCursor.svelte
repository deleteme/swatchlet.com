<script>
  import { spring } from 'svelte/motion';
  let coords = spring({ left: 0, top: 0 }, {
    stiffness: 0.2,
    damping: 0.8
  });
  export let left = 0;
  export let top = 0;
  export let width = 10;

  $: {
    coords.set({ left: left, top: top });
  }
</script>
<style>
.pinned-cursor {
  background: none;
  border: 3px solid white;
  border-radius: 3px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  height: 7px;
  left: -3px;
  position: absolute;
  pointer-events: none;
  top: -3px;
}
</style>
<div class="pinned-cursor" style="transform: translateX({$coords.left}px) translateY({$coords.top}px); width: {width + (3 * 2)}px;"></div>
