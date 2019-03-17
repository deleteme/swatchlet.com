import { isStrictlyEqual } from './lib/is-strictly-equal.js';
import { isEqualWithin } from './lib/is-equal-within.js';

const isTypeEqual = (a, b) => {
  return typeof a === typeof b;
};

const isShallowEqual = (a, b) => {
  if (isStrictlyEqual(a, b)) {
    return true;
  } else if (!isTypeEqual(a, b)) {
    return false;
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

const cache = { calls: new WeakMap(), hits: new WeakMap() };
const track = (weakmap, fn) => {
  const count = weakmap.get(fn) || 0;
  weakmap.set(fn, count + 1);
};

const log = fn => {
  const calls = cache.calls.get(fn);
  const hits = cache.hits.get(fn);
  const misses = cache.calls.get(fn) - cache.hits.get(fn);
  const percentage = n => {
    return (n * 100).toFixed(1) + '%';
  };
  console.table([
    {
      function: fn,
      'hit rate': percentage(hits / calls),
      'miss rate': percentage(misses / calls),
      calls,
      hits,
      misses
    }
  ]);
};

export function memoize(fn) {
  cache.calls.set(fn, 0);
  cache.hits.set(fn, 0);
  let previousArgs = [];
  let previousValue;

  return function memoized() {
    track(cache.calls, fn);
    const args = [...arguments];
    if (areArrayValuesShallowEqual(previousArgs, args)) {
      track(cache.hits, fn);
      //log(fn);
      return previousValue;
    } else {
      //console.log(
        //fn,
        //'miss!\n  previousArgs',
        //previousArgs,
        //'\n  !== args',
        //args
      //);
      const value = fn(...args);
      previousArgs = args;
      previousValue = value;
      //log(fn);
      return value;
    }
  };
}
