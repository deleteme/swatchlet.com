import { isShallowEqual } from '../is-shallow-equal.js';

describe('isShallowEqual()', () => {
  describe('when called with arguments of shallow equality', () => {
    it('should return true', () => {
      expect(isShallowEqual(1, 1)).toBe(true);
      expect(isShallowEqual([], [])).toBe(true);
      expect(isShallowEqual({}, {})).toBe(true);
      expect(isShallowEqual(null, null)).toBe(true);
      expect(isShallowEqual(undefined, undefined)).toBe(true);
      expect(isShallowEqual('a string', 'a string')).toBe(true);
      expect(isShallowEqual(true, true)).toBe(true);
      expect(isShallowEqual({ a: 'a' }, { a: 'a' })).toBe(true);
    });
  });
  describe('when called with arguments without shallow equality', () => {
    it('should return false', () => {
      expect(isShallowEqual(1, 2)).toBe(false);
      expect(isShallowEqual([], [1])).toBe(false);
      expect(isShallowEqual({}, [])).toBe(false);
      expect(isShallowEqual(null, '')).toBe(false);
      expect(isShallowEqual(undefined, {})).toBe(false);
      expect(isShallowEqual('a string', 'another string')).toBe(false);
      expect(isShallowEqual(false, true)).toBe(false);
      expect(isShallowEqual({ a: 'a' }, { b: 'b' })).toBe(false);
    });
  });
});
