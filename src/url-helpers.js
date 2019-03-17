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
    swatches: namesAndValuesToSwatches(get('names'), get('values'))
  };
});

// This converts the swatches to an intermediate representation that is better
// suited for use in the url. The intermediate shape works better with
// memoization because it's not a deep object.
//
// Swatches shape:
// [{ name: 'some name', value: '#123bbd' }]
//
// Intermediate shape for the url:
// names: ['some name']
// values: ['#123bbd']
//
const namesAndValuesToSwatches = memoize(function _namesAndValuesToSwatches(
  names,
  values
) {
  return names.map((name, i) => ({ name, value: values[i] }));
});

const swatchesToNamesAndValues = memoize(function _swatchesToNamesAndValues(
  ...swatches
) {
  const names = swatches.map(swatch => swatch.name);
  const values = swatches.map(swatch => swatch.value);
  return { names, values };
});

export const toString = memoize(function _toString(state) {
  const p = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    if (key === 'swatches') {
      const swatches = value;
      const { names, values } = swatchesToNamesAndValues(...swatches);
      p.append('names', JSON.stringify(names));
      p.append('values', JSON.stringify(values));
    } else {
      p.append(key, JSON.stringify(value));
    }
  });
  return p.toString();
});

export const renderHash = memoize(function _renderHash(state) {
  return `#${toString(state)}`;
});
