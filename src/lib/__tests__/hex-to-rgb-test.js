import hexToRgb from '../hex-to-rgb.js';

describe('hexToRgb()', () => {
  it('should return null if the string is not a hex code.', () => {
    expect(hexToRgb('#')).toBe(null);
    expect(hexToRgb('')).toBe(null);
  });
  it(`should return an rgb object if the string doesn't start with a #.`, () => {
    expect(hexToRgb('ffcc00')).toEqual({ R: 255, G: 204, B: 0 });
    expect(hexToRgb('FFCC00')).toEqual({ R: 255, G: 204, B: 0 });
  });
  it('should return an rgb object if the string is a hex code.', () => {
    expect(hexToRgb('#ffcc00')).toEqual({ R: 255, G: 204, B: 0 });
    expect(hexToRgb('#FFCC00')).toEqual({ R: 255, G: 204, B: 0 });
  });
  it('should return an rgb object if the string is a short hex code.', () => {
    expect(hexToRgb('#fc0')).toEqual({ R: 255, G: 204, B: 0 });
    expect(hexToRgb('#FC0')).toEqual({ R: 255, G: 204, B: 0 });
  });
});
