<script>
  import { spring } from 'svelte/motion';

  const initialLeft = -1;
  const initialTop = -1;
  let transform = '';
  export let left = initialLeft;
  export let top = initialTop;
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
.cursor {
  --size: 45px;
  --offset: calc((var(--size) - 1px) / -2);
  background: none;
  border: 3px solid white;
  border-radius: 3px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  height: var(--size);
  position: absolute;
  width: var(--size);
  pointer-events: none;
  left: var(--offset);
  top: var(--offset);
}
</style>
<div class="cursor" style="{transform}"></div>
