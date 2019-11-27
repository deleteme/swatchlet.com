import { writable, derived } from 'svelte/store';

import { parseURL } from './url-helpers.js';
import hexToRgb from './lib/hex-to-rgb.js';
import rgbStringToComponents from './lib/rgb-string-to-components.js';

const initialStateFromURL = parseURL(location.href) || {};

const defaultState = {
  name: 'world',
  swatches: [
    { value: '#ffffff' },
    { value: '#ff00cc' }
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

export const swatchesDimensions = writable({});

swatchesDimensions.subscribe(v => {
  console.log('swatchesDimensions', v);
});

export const swatchesDimensionsIsReady = derived(swatchesDimensions, d => {
  return (
    Object.values(d).filter(dimensions => {
      return dimensions !== null;
    }).length > 0
  );
});
