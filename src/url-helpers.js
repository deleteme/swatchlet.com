import { memoize } from './memoize.js';

const fragmentRegExp = /#(.+)$/;

const getPickingValue = string => {
  const match = string.match(/p(\d)+$/);
  if (!match) return null;
  const [_, digits] = match;
  return digits.length > 0 ? Number(digits) : null;
};

export const parseURL = memoize(function _parseURL(url) {
  const match = url.match(fragmentRegExp);
  if (!match) return;
  const [_, paramString] = match;
  // bail early again
  if (!paramString || paramString.length === 0) return;
  const parts = paramString
    .split(',')
    .filter(function rejectPickingValue(value) {
      return !value.startsWith('p');
    });
  return {
    swatches: valuesToSwatches(parts),
    picking: getPickingValue(paramString)
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
const valuesToSwatches = memoize(function _valuesToSwatches(values) {
  return values.map(value => ({ value: `#${value}` }));
});

export function toString(state) {
  const { picking, swatches } = state;
  const parts = swatches.map(({ value }) => value.replace('#', ''));
  if (picking !== null) {
    parts.push(`p${picking}`);
  }
  return parts.join(',');
}

export function renderHash(state) {
  return `#${toString(state)}`;
}
