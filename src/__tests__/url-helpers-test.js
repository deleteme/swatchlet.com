import { parseURL, toString, renderHash } from '../url-helpers.js';

describe('parseURL()', () => {
  const url =
    'http://localhost:5000/#name=%22world%22&names=%5B%22White%22%2C%22Fuschia%22%5D&values=%5B%22%23ffffff%22%2C%22%23ff00cc%22%5D';
  it('should parse a url correctly.', () => {
    expect(parseURL(url)).toEqual({
      name: 'world',
      swatches: [
        { name: 'White', value: '#ffffff' },
        { name: 'Fuschia', value: '#ff00cc' }
      ]
    });
  });
  it('should be memoized.', () => {
    expect(parseURL(url)).toBe(parseURL(url));
  });
});

describe('toString()', () => {
  const state = {
    name: 'world',
    swatches: [
      { name: 'White', value: '#ffffff' },
      { name: 'Fuschia', value: '#ff00cc' }
    ]
  };
  it('should return the correct string.', () => {
    const string = toString(state);
    expect(string).toBe(
      'name=%22world%22&names=%5B%22White%22%2C%22Fuschia%22%5D&values=%5B%22%23ffffff%22%2C%22%23ff00cc%22%5D'
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
        name: 'Alright',
        swatches: []
      })
    ).toEqual('name=%22Alright%22&names=%5B%5D&values=%5B%5D');
  });
});

describe('renderHash()', () => {
  const state = {
    name: 'world',
    swatches: [
      { name: 'White', value: '#ffffff' },
      { name: 'Fuschia', value: '#ff00cc' }
    ]
  };
  it('should return the correct string.', () => {
    const string = renderHash(state);
    expect(string).toBe(
      '#name=%22world%22&names=%5B%22White%22%2C%22Fuschia%22%5D&values=%5B%22%23ffffff%22%2C%22%23ff00cc%22%5D'
    );
  });
  it('should be memoized.', () => {
    const first = renderHash(state);
    const second = renderHash(state);
    expect(first).toBe(second);
  });
});
