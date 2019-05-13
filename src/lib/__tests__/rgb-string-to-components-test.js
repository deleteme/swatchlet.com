import rgbStringToComponents from '../rgb-string-to-components.js';

describe('rgbStringToComponents()', () => {
  it('should correctly parse an rgb string.', () => {
    expect(rgbStringToComponents('rgb(1, 2, 3)')).toEqual({ R: 1, G: 2, B: 3 });
    expect(rgbStringToComponents('rgb(4,5,6)')).toEqual({ R: 4, G: 5, B: 6 });
  });
});
