import { parseURL } from '../url-helpers.js';

describe('parseURL()', () => {
  it('should parse a url correctly.', () => {
    expect(parseURL('http://localhost:5000#name=world')).toEqual({
      name: 'world'
    });
  });
  it('should be memoized.', () => {});
});
