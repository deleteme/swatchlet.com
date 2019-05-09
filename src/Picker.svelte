<style>
.picker {
  height: 100%;
  width: 100%;
}
.picker:hover :global(.actions) {
  display: flex;
  justify-content: flex-end;
}
</style>

<div class="picker" style='background: {$swatches[$picking].value}'>
  <ActionBar>
    Picking: {$swatches[$picking].name}
    <Button on:click="cancelPicking()">X</Button>
  </ActionBar>
</div>

<script>
  import store, { cancelPicking } from './store.js';
  export default {
    components: { ActionBar: './ActionBar.svelte', Button: './Button.svelte' },
    methods: {
      cancelPicking
    }
  };
</script>
