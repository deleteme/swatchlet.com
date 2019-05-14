const longHex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
const shortHex = /^#?([a-f\d]{1})([a-f\d]{1})([a-f\d]{1})$/i;
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
