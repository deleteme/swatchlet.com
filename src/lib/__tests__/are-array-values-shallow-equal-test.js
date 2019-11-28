import { areArrayValuesShallowEqual } from '../are-array-values-shallow-equal.js';

describe('areArrayValuesShallowEqual()', () => {
  describe('when called with arrays with values of shallow equality', () => {
    it('should return true', () => {
      const [a, b, c] = 'abc'.split('');
      const array1 = [{ a }, { a, b }, { a, b, c }, []];
      const array2 = [{ a }, { a, b }, { a, b, c }, []];
      expect(areArrayValuesShallowEqual(array1, array2)).toBe(true);
    });
  });
  describe('when called with arrays without values of shallow equality', () => {
    it('should return false', () => {
      const [a, b, c] = 'abc'.split('');
      const array1 = [{ a }, { a, b }, { a, b, c }, []];
      const array2 = [{ a }, { a, b }, {}, []];
      expect(areArrayValuesShallowEqual(array1, array2)).toBe(false);
    });
  });
});
