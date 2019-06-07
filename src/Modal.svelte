<script>
  import { fly } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  import { cancelPicking } from './store.js';
  const handleKeyUp = e => {
    if (e.code === 'Escape') cancelPicking();
  }
  export let width = 0;
</script>
<style>
.modal {
  height: 100%;
  position: relative;
  width: 100%;
  z-index: 1;
}
</style>

<svelte:window on:keyup={handleKeyUp}></svelte:window>
<div
  class="modal"
  transition:fly="{{delay: 1, duration: 200, x: width, y: 0, opacity: 1, easing: quintOut}}"
>
  <slot></slot>
</div>
