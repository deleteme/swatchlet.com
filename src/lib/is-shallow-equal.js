import { isTypeEqual } from './is-type-equal.js';
import { isStrictlyEqual } from './is-strictly-equal.js';
import { isEqualWithin } from './is-equal-within.js';

export const isShallowEqual = (a, b) => {
  if (isStrictlyEqual(a, b)) return true;

  if (isTypeEqual(a, b)) {
    if (typeof a === 'object') {
      return isEqualWithin(a, b) && isEqualWithin(b, a);
    } else {
      return isStrictlyEqual(a, b);
    }
  }
  return false;
};
