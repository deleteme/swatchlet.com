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

<script>
  export default {
    components: {
      Swatches: './Swatches.svelte',
      Header: './Header.svelte',
      Picker: './Picker.svelte'
    }
  };
</script>
