import { longHex, shortHex } from './constants.js';

export default function hexToRgb(hex) {
  let result = shortHex.exec(hex);
  if (result) {
    result = result.map(fragment => fragment.repeat(2));
  } else {
    result = longHex.exec(hex);
  }
  return result
    ? {
        R: parseInt(result[1], 16),
        G: parseInt(result[2], 16),
        B: parseInt(result[3], 16)
      }
    : null;
}
