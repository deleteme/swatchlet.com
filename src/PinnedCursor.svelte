<script>
  export let left = 0;
  export let top = 0;
  export let width = 10;
</script>
<style>
.pinned-cursor {
  background: none;
  border: 3px solid white;
  border-radius: 3px;
  box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.7);
  box-sizing: border-box;
  height: 7px;
  position: absolute;
  pointer-events: none;
  transform: translateX(-3px) translateY(-3px);
}
</style>
<div class="pinned-cursor" style="left: {left}px; top: {top}px; width: {width + (3 * 2)}px;"></div>
