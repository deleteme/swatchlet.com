import { parseURL, toString, renderHash } from '../url-helpers.js';

describe('parseURL()', () => {
  const url = 'http://localhost:5000/#ffffff,ff00cc,p0';
  it('should parse a url correctly.', () => {
    expect(parseURL(url)).toEqual({
      swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
      picking: 0
    });
  });
  it('should be memoized.', () => {
    expect(parseURL(url)).toBe(parseURL(url));
  });
  it('should handle uppercase hex values', () => {
    expect(parseURL('http://localhost:5000/#FFFFFF,FF00CC,p0')).toEqual({
      swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
      picking: 0
    });
  });
});

describe('toString()', () => {
  const state = {
    swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
    picking: 0
  };
  it('should return the correct string.', () => {
    const string = toString(state);
    expect(string).toBe('FFFFFF,FF00CC,p0');
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
    ).toEqual('');
  });
});

describe('renderHash()', () => {
  const state = {
    swatches: [{ value: '#ffffff' }, { value: '#ff00cc' }],
    picking: null
  };
  it('should return the correct string.', () => {
    const string = renderHash(state);
    expect(string).toBe('#FFFFFF,FF00CC');
  });
  it('should be memoized.', () => {
    const first = renderHash(state);
    const second = renderHash(state);
    expect(first).toBe(second);
  });
});
