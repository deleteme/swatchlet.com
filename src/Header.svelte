<script>
import AddNewColor from './AddNewColor.svelte';
</script>

<style>
header {
  background: rgba(0, 0, 0, 0.6);
  align-items: baseline;
  display: flex;
  height: 30px;
  line-height: 30px;
  justify-content: space-between;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
}

h1 {
  color: white;
  display: inline;
  font-size: 14px;
  margin: 0;
  padding: 0;
}

</style>

<header>
  <h1>
    swatchlet.com: share colors easily.
  </h1>
  <div>
    <AddNewColor />
  </div>
</header>
