import hexToRgb from './hex-to-rgb.js';
export function isLightColor({ R, G, B }) {
  const sum = Math.round((R * 299 + G * 587 + B * 114) / 1000);
  return sum > 128;
}

export function getHighContrastColorFromRGB(RGB) {
  return isLightColor(RGB) ? '#000' : '#FFF';
}

export function getHighContrastColorFromHex(hex) {
  const RGB = hexToRgb(hex);
  return isLightColor(RGB) ? '#000' : '#FFF';
}
