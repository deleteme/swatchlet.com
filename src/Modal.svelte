<script>
  import { cancelPicking } from './store.js';
  const handleKeyUp = e => {
    if (e.code === 'Escape') cancelPicking();
  }
</script>

<svelte:window on:keyup={handleKeyUp}></svelte:window>
<slot></slot>
