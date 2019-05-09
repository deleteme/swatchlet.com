<style>
.swatches {
  bottom: 0;
  display: flex;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
}
</style>

<div class='swatches'>
  {#each $swatches as swatch, i}
  <Swatch name={swatch.name} value={swatch.value} i={i} />
  {/each}
</div>

<script>
  import store from './store.js';
  export default {
    components: { Swatch: './Swatch.svelte' }
  };
</script>
