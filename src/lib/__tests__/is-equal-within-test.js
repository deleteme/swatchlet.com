import { isEqualWithin } from '../is-equal-within.js';

describe('isEqualWithin()', () => {
  const [a, b, c] = 'abc'.split('');
  const ab = { a, b };
  const abc = { a, b, c };
  describe('when the first object is contained within the second.', () => {
    it('should return true', () => {
      expect(isEqualWithin(ab, abc)).toBe(true);
    });
  });
  describe(`when the first object isn't contained within the second.`, () => {
    it('should return false', () => {
      expect(isEqualWithin(abc, ab)).toBe(false);
    });
  });
});
