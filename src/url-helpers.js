const fragmentRegExp = /#(.+)$/;

export function parseURL(url) {
  const match = url.match(fragmentRegExp);
  if (!match) return;
  const [_, paramString] = match;
  // bail early again
  if (!paramString || !paramString.includes('=')) return;
  const p = new URLSearchParams(paramString);
  const state = {};
  try {
    for (var [key, value] of p) {
      state[key] = JSON.parse(value);
    }
  } catch (e) {
    return;
  }
  return state;
}

export function toString(state) {
  const p = new URLSearchParams();
  Object.entries(state).forEach(([key, value]) => {
    p.append(key, JSON.stringify(value));
  });
  return p.toString();
}

export function renderHash(state) {
  return `#${toString(state)}`;
}
