<style>
  button {
    align-items: center;
    align-self: center;
    background: rgba(0, 0, 0, 0.6);
    border: 0;
    border-radius: 15px;
    color: white;
    cursor: pointer;
    display: flex;
    font-weight: bold;
    margin-bottom: 0;
    line-height: 30px;
    padding: 0 1em;
  }
  button:hover {
    background: black;
  }
  button:active {
    transform: translateY(1px);
  }
  button:focus {
    outline: white;
  }
</style>

<button
  {type}
  class={class}
  on:click
>
  <slot></slot>
</button>
