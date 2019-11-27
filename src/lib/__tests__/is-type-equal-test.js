import { isTypeEqual } from '../is-type-equal.js';

describe('isTypeEqual()', () => {
  it('should return true when called with equal types.', () => {
    expect(isTypeEqual(1, 1)).toBe(true);
    expect(isTypeEqual(undefined, undefined)).toBe(true);
    expect(isTypeEqual(null, null)).toBe(true);
    expect(isTypeEqual({}, {})).toBe(true);
    expect(isTypeEqual([], [])).toBe(true);
    expect(isTypeEqual('', '')).toBe(true);
    expect(
      isTypeEqual(
        () => {},
        () => {}
      )
    ).toBe(true);
    expect(isTypeEqual(true, true)).toBe(true);
  });
  it('should return false when called with different types.', () => {
    expect(isTypeEqual(1, null)).toBe(false);
    expect(isTypeEqual({}, [])).toBe(false);
    expect(isTypeEqual([], null)).toBe(false);
    expect(isTypeEqual('', 2)).toBe(false);
    expect(isTypeEqual(() => {}, 0)).toBe(false);
    expect(isTypeEqual(false, null)).toBe(false);
  });
});
