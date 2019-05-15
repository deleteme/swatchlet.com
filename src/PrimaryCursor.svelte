<script>
  import { spring } from 'svelte/motion';

  let coords = spring({ left: 0, top: 0 }, {
    stiffness: 0.2,
    damping: 0.8
  });
  export let left = 0;
  export let top = 0;

  $: {
    coords.set({ left: left, top: top });
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
<div class="cursor" style="transform: translateX({$coords.left}px) translateY({$coords.top}px);"></div>
