import { writable } from 'svelte/store.js';

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

export const name = writable(initialStateFromURL.name || defaultState.name);
export const swatches = writable(
  initialStateFromURL.swatches || defaultState.swatches
);

export const picking = writable(defaultState.picking);

export const pick = index => {
  picking.set(index);
};

export const cancelPicking = () => {
  picking.set(defaultState.picking);
};
