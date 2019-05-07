import { Store } from 'svelte/store.js';

import { parseURL } from './url-helpers.js';

const initialStateFromURL = parseURL(location.href) || {};

const defaultState = {
  name: 'world',
  swatches: [
    { name: 'White', value: '#ffffff' },
    { name: 'Fuschia', value: '#ff00cc' }
  ],
  picking: null
};

class SwatchStore extends Store {}

export default new SwatchStore({
  ...defaultState,
  ...initialStateFromURL
});

export const cancelPicking = () => {
  store.set({
    picking: defaultState.picking
  });
};
