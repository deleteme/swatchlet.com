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
    })
    .map(value => value.toLowerCase());
  return {
    swatches: valuesToSwatches(parts),
    picking: getPickingValue(paramString)
  };
});

const valuesToSwatches = memoize(function _valuesToSwatches(values) {
  return values.map(value => ({ value: `#${value}` }));
});

export function toString(state) {
  const { picking, swatches } = state;
  const parts = swatches.map(({ value }) =>
    value.replace('#', '').toUpperCase()
  );
  if (picking !== null) {
    parts.push(`p${picking}`);
  }
  return parts.join(',');
}

export function renderHash(state) {
  return `#${toString(state)}`;
}
