import { isStrictlyEqual } from './is-strictly-equal.js';

export const isEqualWithin = (a, b) => {
  return Object.entries(a).every(([aKey, aValue]) => {
    const bValue = b[aKey];
    return isStrictlyEqual(aValue, bValue);
  });
};
