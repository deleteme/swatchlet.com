import {
  isLightColor,
  getHighContrastColorFromRGB
} from '../get-high-contrast-color.js';

describe('isLightColor()', () => {
  it('should return false if given a darker color.', () => {
    expect(isLightColor({ R: 1, G: 2, B: 3 })).toBe(false);
    expect(isLightColor({ R: 122, G: 2, B: 3 })).toBe(false);
  });
  it('should return true if given a lighter color.', () => {
    expect(isLightColor({ R: 1, G: 255, B: 223 })).toBe(true);
    expect(isLightColor({ R: 122, G: 233, B: 211 })).toBe(true);
  });
});
describe('getHighContrastColorFromRGB()', () => {
  it('should return #FFF if given a darker color.', () => {
    expect(getHighContrastColorFromRGB({ R: 1, G: 2, B: 3 })).toBe('#FFF');
    expect(getHighContrastColorFromRGB({ R: 122, G: 2, B: 3 })).toBe('#FFF');
  });
  it('should return #000 if given a lighter color.', () => {
    expect(getHighContrastColorFromRGB({ R: 1, G: 255, B: 223 })).toBe('#000');
    expect(getHighContrastColorFromRGB({ R: 122, G: 233, B: 211 })).toBe(
      '#000'
    );
  });
});
