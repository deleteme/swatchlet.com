<script>
  import { renderHash } from './url-helpers.js';
  import {swatches} from './store.js';
  import ButtonLink from './ButtonLink.svelte';
  $: addHref = renderHash({
      swatches: [...$swatches, { value: '#ffffff' }]
    })
</script>

<ButtonLink href={addHref}>+ Add New Color</ButtonLink>
