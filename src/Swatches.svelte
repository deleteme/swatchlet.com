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
@media screen and (min-width: 0) and (max-width: 812px) {
  .swatches {
    flex-direction: column;
  }
}
</style>

<div class='swatches'>
  {#each $swatches as swatch, i}
  <Swatch value={swatch.value} i={i} />
  {/each}
</div>
