import isValidHex from '../is-valid-hex.js';

describe('isValidHex()', () => {
  describe('given invalid hex values', () => {
    it('should return false.', () => {
      expect(isValidHex('#FxCC00')).toBe(false);
      expect(isValidHex('#FFCC00x')).toBe(false);
      expect(isValidHex('#FFCC0')).toBe(false);
    });
  });
  describe('given valid hex values', () => {
    it('should return true.', () => {
      expect(isValidHex('#FFCC00')).toBe(true);
      expect(isValidHex('#FC0')).toBe(true);
      expect(isValidHex('#FFCC00')).toBe(true);
      expect(isValidHex('#ca0')).toBe(true);
    });
  });
});
