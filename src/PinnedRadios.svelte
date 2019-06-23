<script>
  import { pinned } from './picker-canvas-store.js';
  import { pickingSwatchRgb } from './store.js';
</script>

<style>
label {
  font-weight: bold;
}
@media screen and (min-width: 813px) {
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
}
@media screen and (min-width: 0) and (max-width: 812px) {
  div {
    left: 30px;
    position: absolute;
    top: 120px;
  }
  label {
    align-items: center;
    display: inline-flex;
    padding-right: 1rem;
  }
  input {
    margin-bottom: 0;
    margin-right: 0.5rem;
  }
  label * {
    align-self: center;
  }
}
</style>

{#if $pickingSwatchRgb}
<div>
  <label>
    <input type=radio bind:group={$pinned} value='R'>
    R: { $pickingSwatchRgb.R }
  </label>

  <label>
    <input type=radio bind:group={$pinned} value='G'>
    G: { $pickingSwatchRgb.G }
  </label>

  <label>
    <input type=radio bind:group={$pinned} value='B'>
    B: { $pickingSwatchRgb.B }
  </label>
</div>
{/if}
