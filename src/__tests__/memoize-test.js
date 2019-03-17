import { memoize } from '../memoize.js';

describe('memoize()', () => {
  it('should return a new function', () => {
    expect(memoize(() => {})).toBeInstanceOf(Function);
  });
  describe('memoized function', () => {
    describe('with simple arguments', () => {
      it('should be called when given new arguments.', () => {
        expect.assertions(4);
        const add = jest.fn((...values) =>
          values.reduce((total, n) => {
            return total + n;
          }, 0)
        );
        const memoizedAdd = memoize(add);
        const value1 = memoizedAdd(1, 2);
        expect(add).toHaveBeenCalledTimes(1);
        expect(value1).toBe(3);
        const value2 = memoizedAdd(1, 2, 3);
        expect(add).toHaveBeenCalledTimes(2);
        expect(value2).toBe(6);
      });
      it('should not be called when given the same arguments.', () => {
        expect.assertions(4);
        const add = jest.fn((...values) =>
          values.reduce((total, n) => {
            return total + n;
          }, 0)
        );
        const memoizedAdd = memoize(add);
        const value1 = memoizedAdd(1, 2);
        expect(add).toHaveBeenCalledTimes(1);
        expect(value1).toBe(3);
        const value2 = memoizedAdd(1, 2);
        expect(add).toHaveBeenCalledTimes(1);
        expect(value2).toBe(3);
      });
    });
    describe('with complex arguments', () => {
      it('should be called when given arguments that do not have shallow equality.', () => {
        expect.assertions(4);
        const getKeys = jest.fn((...objectsWithKeys) =>
          objectsWithKeys.reduce((allKeys, object) => {
            allKeys.push(...Object.keys(object));
            return allKeys;
          }, [])
        );
        const memoizedGetKeys = memoize(getKeys);
        const value1 = memoizedGetKeys(
          { a: 'a' },
          { b: 'b' }
        );
        expect(getKeys).toHaveBeenCalledTimes(1);
        expect(value1).toEqual(['a', 'b']);
        const value2 = memoizedGetKeys(
          { a: 'a' },
          { b: 'b' },
          [0]
        );
        expect(getKeys).toHaveBeenCalledTimes(2);
        expect(value2).toEqual(['a', 'b', '0']);
      });
      it('should not be called when given the same arguments.', () => {
        expect.assertions(4);
        const getKeys = jest.fn((...objectsWithKeys) =>
          objectsWithKeys.reduce((allKeys, object) => {
            allKeys.push(...Object.keys(object));
            return allKeys;
          }, [])
        );
        const memoizedGetKeys = memoize(getKeys);
        const value1 = memoizedGetKeys({ a: 'a', c: 'c' }, { b: 'b', d: 'd' });
        expect(getKeys).toHaveBeenCalledTimes(1);
        expect(value1).toEqual(['a', 'c', 'b', 'd']);
        const value2 = memoizedGetKeys({ a: 'a', c: 'c' }, { b: 'b', d: 'd' });
        expect(getKeys).toHaveBeenCalledTimes(1);
        expect(value2).toBe(value1);
      });
    });
  });
});
