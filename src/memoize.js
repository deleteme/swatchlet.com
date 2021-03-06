import { areArrayValuesShallowEqual } from './lib/are-array-values-shallow-equal.js';

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

export function memoize(fn, enableLog) {
  cache.calls.set(fn, 0);
  cache.hits.set(fn, 0);
  let previousArgs = [];
  let previousValue;

  return function memoized() {
    track(cache.calls, fn);
    const args = [...arguments];
    if (areArrayValuesShallowEqual(previousArgs, args)) {
      track(cache.hits, fn);
      //if (enableLog) log(fn);
      return previousValue;
    } else {
      if (enableLog)
        console.log(
          fn,
          'miss!\n  previousArgs',
          previousArgs,
          '\n  !== args',
          args
        );
      const value = fn(...args);
      previousArgs = args;
      previousValue = value;
      //if (enableLog) log(fn);
      return value;
    }
  };
}
