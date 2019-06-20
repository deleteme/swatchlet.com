import { writable, derived } from 'svelte/store.js';

import { parseURL } from './url-helpers.js';
import hexToRgb from './lib/hex-to-rgb.js';
import rgbStringToComponents from './lib/rgb-string-to-components.js';

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

export const pickingSwatch = derived(
  [picking, swatches],
  ([picking, swatches]) => {
    return swatches[picking] || null;
  }
);

export const pickingSwatchRgb = derived(pickingSwatch, swatch => {
  var swatchRgb;
  if (!swatch) return;
  if (swatch.value.startsWith('#')) {
    swatchRgb = hexToRgb(swatch.value);
  } else if (swatch.value.startsWith('rgb')) {
    swatchRgb = rgbStringToComponents(swatch.value);
  } else {
    console.warning('unexpected value for swatch', swatch);
  }
  return swatchRgb;
});

export const hoveringSwatchDimensions = writable(null)
