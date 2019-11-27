import { parseURL, toString, renderHash } from '../url-helpers.js';

describe('parseURL()', () => {
  const url =
    'http://localhost:5000/#values=%5B%22%23ffffff%22%2C%22%23ff00cc%22%5D&picking=0';
  it('should parse a url correctly.', () => {
    expect(parseURL(url)).toEqual({
      swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
      picking: 0
    });
  });
  it('should be memoized.', () => {
    expect(parseURL(url)).toBe(parseURL(url));
  });
});

describe('toString()', () => {
  const state = {
    swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
    picking: 0
  };
  it('should return the correct string.', () => {
    const string = toString(state);
    expect(string).toBe(
      'values=%5B%22%23ffffff%22%2C%22%23ff00cc%22%5D&picking=0'
    );
  });
  it('should be memoized.', () => {
    const first = toString(state);
    const second = toString(state);
    expect(first).toBe(second);
  });
  it('should handle an empty swatches array.', () => {
    expect(
      toString({
        swatches: [],
        picking: null
      })
    ).toEqual('values=%5B%5D');
  });
});

describe('renderHash()', () => {
  const state = {
    swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
    picking: null
  };
  it('should return the correct string.', () => {
    const string = renderHash(state);
    expect(string).toBe('#values=%5B%22%23ffffff%22%2C%22%23ff00cc%22%5D');
  });
  it('should be memoized.', () => {
    const first = renderHash(state);
    const second = renderHash(state);
    expect(first).toBe(second);
  });
});
