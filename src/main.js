import { derived, get } from 'svelte/store';
import App from './App.svelte';
import { name, swatches } from './store.js';
import { parseURL, toString, renderHash } from './url-helpers.js';
import { memoize } from './memoize.js';
import { tracking } from './picker-canvas-store.js';
import throttle from 'lodash.throttle';

const syncURLtoState = memoize(function _syncURLtoState(url) {
  const newState = parseURL(url);
  if (newState) {
    name.set(newState.name);
    swatches.set(newState.swatches);
    return true;
  }
});

if (!syncURLtoState(location.href)) {
  location.hash = toString({
    name: get(name),
    swatches: get(swatches)
  });
}

const derivedLocationHash = derived([name, swatches], ([$name, $swatches]) => {
  return renderHash({
    name: $name,
    swatches: $swatches
  });
});

const handleDerivedLocationHash = throttle(
  hash => {
    if (hash !== location.hash) {
      location.hash = hash;
    }
  },
  1000,
  { leading: true, trailing: true }
);

derivedLocationHash.subscribe(handleDerivedLocationHash);

const handleHashChange = e => {
  syncURLtoState(e.newURL);
};

window.addEventListener('hashchange', handleHashChange, false);

export default new App({ target: document.body });
