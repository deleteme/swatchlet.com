<script>
  export let href = '';
  let klass;
  export klass as class;
</script>
<style>
  a {
    align-items: center;
    align-self: center;
    background: rgba(0, 0, 0, 0.6);
    border: 0;
    border-radius: 15px;
    color: white;
    cursor: pointer;
    display: flex;
    font-weight: bold;
    line-height: 30px;
    padding: 0px 1em;
  }
  a:hover {
    background: black;
    text-decoration: none;
  }
  a:active {
    transform: translateY(1px);
  }
  a:focus {
    outline: white;
  }
</style>

<a
  {href}
  class={klass}
>
  <slot></slot>
</a>
