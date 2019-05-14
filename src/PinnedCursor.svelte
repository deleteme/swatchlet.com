<script>
  export let left = 0;
  export let top = 0;
  export let width = 10;
</script>
<style>
.pinned-cursor {
  background: none;
  border: 3px solid white;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  height: 5px;
  position: absolute;
  pointer-events: none;
  transform: translateY(-3px);
}
</style>
<div class="pinned-cursor" style="left: {left}px; top: {top}px; width: {width}px;"></div>
