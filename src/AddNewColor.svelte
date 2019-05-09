<script>
  import { renderHash } from './url-helpers.js';
  import store from './store.js';
  import ButtonLink from './ButtonLink.svelte';
  const addHref = ({$swatches}) => {
    const state = store.get();
    return renderHash({
      ...state,
      swatches: [...$swatches, { name: 'White', value: '#ffffff' }]
    })
  }
</script>

<ButtonLink href={addHref}>+ Add New Color</ButtonLink>
