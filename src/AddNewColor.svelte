<script>
  import { renderHash } from './url-helpers.js';
  import {name, swatches} from './store.js';
  import ButtonLink from './ButtonLink.svelte';
  $: addHref = renderHash({
      name: $name,
      swatches: [...$swatches, { name: 'White', value: '#ffffff' }]
    })
</script>

<ButtonLink href={addHref}>+ Add New Color</ButtonLink>
