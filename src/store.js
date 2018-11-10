import { Store } from 'svelte/store.js';

import { parseURL } from './url-helpers.js';

const initialStateFromURL = parseURL(location.href);

const DEFAULT_SWATCH = { value: '#ffffff' };

class SwatchStore extends Store {
  addSwatch(swatch=DEFAULT_SWATCH){
    const { swatches } = this.get();
    this.set({ swatches: [...swatches, swatch] });
  }
}

export default new SwatchStore(initialStateFromURL || {});
