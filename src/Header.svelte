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

input, label {
  background: none;
  border: 0;
  color: white;
  display: inline;
}

input {
  text-decoration: underline;
}
input:focus {
  background: black;
}
</style>

<header>
  <div>
    <label for="name">Name</label>
    <input type="text" bind:value=$name id="name" />
  </div>
  <div>
    <AddNewColor />
  </div>
</header>
