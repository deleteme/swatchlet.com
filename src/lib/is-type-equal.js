export const isTypeEqual = (a, b) => {
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  return typeof a === typeof b;
};
