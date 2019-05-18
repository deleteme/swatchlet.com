<script>
  import { swatches } from './store.js';
  import Swatch from './Swatch.svelte';
</script>

<style>
.swatches {
  bottom: 0;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 40px;
}
</style>

<div class='swatches'>
  {#each $swatches as swatch, i}
  <Swatch name={swatch.name} value={swatch.value} i={i} />
  {/each}
</div>
