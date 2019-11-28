import { isShallowEqual } from './is-shallow-equal.js';

export const areArrayValuesShallowEqual = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  } else {
    return array1.every((value, i) => {
      return isShallowEqual(value, array2[i]);
    });
  }
};
