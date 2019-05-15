import trap from '../trap';

describe('trap()', () => {
  describe('given a > 1 number', () => {
    it('should return 1.', () => {
      expect(trap(1.1)).toBe(1);
    });
  });
  describe('given 1', () => {
    it('should return 1.', () => {
      expect(trap(1)).toBe(1);
    });
  });
  describe('given a < 1 number', () => {
    it('should return the input number.', () => {
      expect(trap(0.8)).toBe(0.8);
    });
  });
  describe('given 0', () => {
    it('should return 0.', () => {
      expect(trap(0)).toBe(0);
    });
  });
  describe('given a < 0 number', () => {
    it('should return 0.', () => {
      expect(trap(-0.1)).toBe(0);
      expect(trap(-1)).toBe(0);
    });
  });
});
