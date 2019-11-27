<script>
import Swatches from './Swatches.svelte';
import Header from './Header.svelte';
import Picker from './Picker.svelte';
import { picking, swatchesDimensionsIsReady } from './store.js';
let width = 0;
let height = 0;
$: hasPicker = $picking !== null && $swatchesDimensionsIsReady;
$: debuggingOutput = JSON.stringify({swatchesDimensionsIsReady: $swatchesDimensionsIsReady, $picking, hasPicker});
</script>

<style>
.app {
  font-family: "SF Mono", monospace;
  height: 100%;
  width: 100%;
  position: relative;
}
#alive { display: none; }
:global(body) { padding: 0; }
</style>

<div class="app" bind:offsetWidth={width} bind:offsetHeight={height}>
  <Header />
  <Swatches />
  {#if hasPicker}
    <Picker width={width} height={height} />
  {/if}
  <span id='alive'>{debuggingOutput}</span>
</div>
