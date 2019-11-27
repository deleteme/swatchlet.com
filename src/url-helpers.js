import { memoize } from './memoize.js';

const fragmentRegExp = /#(.+)$/;

export const parseURL = memoize(function _parseURL(url) {
  const match = url.match(fragmentRegExp);
  if (!match) return;
  const [_, paramString] = match;
  // bail early again
  if (!paramString || !paramString.includes('=')) return;
  const p = new URLSearchParams(paramString);
  const get = key => JSON.parse(p.get(key));
  return {
    name: get('name'),
    swatches: valuesToSwatches(get('values')),
    picking: get('picking')
  };
});

// This converts the swatches to an intermediate representation that is better
// suited for use in the url. The intermediate shape works better with
// memoization because it's not a deep object.
//
// Swatches shape:
// [{ value: '#123bbd' }]
//
// Intermediate shape for the url:
// values: ['#123bbd']
//
const valuesToSwatches = memoize(function _valuesToSwatches(
  values
) {
  return values.map((value) => ({ value }));
});

const swatchesToValues = memoize(function _swatchesToValues(
  swatches
) {
  const values = swatches.map(swatch => swatch.value);
  return values;
});

export function toString(state) {
  const p = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    if (key === 'picking' && value === null) {
      // nope
    } else if (key === 'swatches') {
      const swatches = value;
      const values = swatchesToValues(swatches);
      p.append('values', JSON.stringify(values));
    } else {
      p.append(key, JSON.stringify(value));
    }
  });
  return p.toString();
}

export function renderHash(state) {
  return `#${toString(state)}`;
}
