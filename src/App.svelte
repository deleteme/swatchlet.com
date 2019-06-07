<script>
import Swatches from './Swatches.svelte';
import Header from './Header.svelte';
import Picker from './Picker.svelte';
import { picking } from './store.js';
let width = 0;
</script>

<style>
.app {
  font-family: "SF Mono", monospace;
  height: 100%;
  width: 100%;
  position: relative;
}
:global(body) { padding: 0; }
</style>

<div class="app" bind:offsetWidth={width}>
  <Header />
  <Swatches />
  {#if typeof $picking === 'number'}
    <Picker width={width} />
  {/if}
</div>
