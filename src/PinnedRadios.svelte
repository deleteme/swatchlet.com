<script>
  import { pinned } from './picker-canvas-store.js';
</script>

<style>
div {
  --golden-ratio: 1.618;
  --side: calc((1 / var(--golden-ratio)) * 100%);
  --margin: calc((100% - var(--side)) / 2);
  box-sizing: border-box;
  left: calc(var(--side) + var(--margin));
  line-height: 4rem;
  padding: 1rem;
  position: absolute;
  width: var(--margin);
  top: var(--margin);
}
</style>

<div>
  <label>
    <input type=radio bind:group={$pinned} value='R'>
    R
  </label>

  <label>
    <input type=radio bind:group={$pinned} value='G'>
    G
  </label>

  <label>
    <input type=radio bind:group={$pinned} value='B'>
    B
  </label>
</div>
