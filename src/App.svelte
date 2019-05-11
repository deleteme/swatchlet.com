<script>
import Swatches from './Swatches.svelte';
import Header from './Header.svelte';
import Picker from './Picker.svelte';
import { picking } from './store.js';
</script>

<style>
.app {
  font-family: "SF Mono";
  height: 100%;
  width: 100%;
  position: relative;
}
:global(body) { padding: 0; }
</style>

<div class="app">
  {#if typeof $picking === 'number'}
    <Picker />
  {:else}
    <Header />
    <Swatches />
  {/if}
</div>
