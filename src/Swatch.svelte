<style>
.swatch {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.5s;
  position: relative;
  width: 100%;
}

.swatch:hover :global(.actions) {
  display: flex;
  justify-content: flex-end;
}

:global(.swatch-action) {
  margin-left: 5px;
}

input {
  background: none;
  border: 0;
  border-radius: 5px;
  font-weight: bold;
  height: 40%;
  margin: 0;
  padding: 0;
  position: relative;
  text-align: center;
  width: 100%;
}
</style>

<div class="swatch" style='background-color: {value};'>
  <input
    type="text"
    bind:value=value
    on:change='edit(value, i)'
    style='font-size: calc(100vw / {$swatches.length} * 0.2);'
  />
  <ActionBar>
    {name}
    <Button on:click='pick(i)' type='button' class='swatch-action'>
      Pick
    </Button>
    <ButtonLink href='{removeHref}' class='swatch-action'>
      X
    </ButtonLink>
  </ActionBar>
</div>

<script>
  import { renderHash } from './url-helpers.js';
  import store, { pick } from './store.js';
	export default {
		components: {
			ButtonLink: './ButtonLink.svelte',
			Button: './Button.svelte',
      ActionBar: './ActionBar.svelte'
		},
    methods: {
      edit: (value, i) => {
        const state = store.get();
        location.hash = renderHash({
          ...state,
          swatches: state.swatches.map((swatch, j) => {
            return i === j ? { value } : swatch
          })
        });
      },
      pick
    },
    computed: {
      removeHref: ({ i, $swatches }) => {
        const state = store.get()
        return renderHash({
          ...state,
          swatches: $swatches.filter((s, j) => {
            return i !== j;
          })
        });
      }
    }
	};
</script>
