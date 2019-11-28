import { longHex, shortHex } from './constants.js';

export default function isValidHex(possibleHex) {
  return longHex.test(possibleHex) || shortHex.test(possibleHex);
}
