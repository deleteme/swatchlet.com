export function isLightColor({ R, G, B }) {
  const sum = Math.round((R * 299 + G * 587 + B * 114) / 1000);
  return sum > 128;
}

export function getHighContrastColorFromRGB(RGB) {
  return isLightColor(RGB) ? 'black' : 'white';
}
