export default function rgbStringToComponents(rgbString) {
  const [R, G, B] = rgbString
    .replace(/[a-z\(\)]/g, '')
    .split(',')
    .map(Number);
  return { R, G, B };
}
