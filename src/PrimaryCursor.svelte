<script>
  export let left = 0;
  export let top = 0;
</script>
<style>
.cursor {
  --size: 45px;
  --offset: calc((var(--size) + 1px) / -2);
  background: none;
  border: 3px solid white;
  box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  height: var(--size);
  position: absolute;
  width: var(--size);
  pointer-events: none;
  transform: translateX(var(--offset)) translateY(var(--offset));
}
</style>
<div class="cursor" style="left: {left}px; top: {top}px;"></div>
