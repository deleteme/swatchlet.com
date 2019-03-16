const isStrictlyEqual = (a, b) => a === b;

const isEqualWithin = (a, b) => {
  return Object.entries(a).every(([aKey, aValue]) => {
    const bValue = b[aKey];
    return isStrictlyEqual(aValue, bValue);
  });
};

const isShallowEqual = (a, b) => {
  if (isStrictlyEqual(a, b)) {
    return true;
  } else {
    const isAShallowEqualToB = isEqualWithin(a, b);
    if (isAShallowEqualToB) {
      const isBShallowEqualToA = isEqualWithin(b, a);
      return isBShallowEqualToA;
    } else {
      return false;
    }
  }
};

const areArrayValuesShallowEqual = (array1, array2) => {
  if (array1.length !== array2.length) {
    return false;
  } else {
    return array1.every((value, i) => {
      return isShallowEqual(value, array2[i]);
    });
  }
};

export function memoize(fn) {
  var previousArgs = [];
  var previousValue;

  return function memoized () {
    const args = [...arguments];
    if (areArrayValuesShallowEqual(previousArgs, args)) {
      return previousValue;
    } else {
      const value = fn(...args);
      previousArgs = args;
      previousValue = value;
      return value;
    }
  };
}
