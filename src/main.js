import { derived, get } from 'svelte/store';
import App from './App.svelte';
import { swatches, picking } from './store.js';
import { parseURL, toString, renderHash } from './url-helpers.js';
import { memoize } from './memoize.js';
import { tracking } from './picker-canvas-store.js';
import throttle from 'lodash.throttle';

const syncURLtoState = memoize(function _syncURLtoState(url) {
  const newState = parseURL(url);
  if (newState) {
    swatches.set(newState.swatches);
    picking.set(newState.picking);
    return true;
  }
});

if (!syncURLtoState(location.href)) {
  location.hash = toString({
    swatches: get(swatches),
    picking: get(picking)
  });
}

const derivedLocationHash = derived(
  [swatches, picking],
  ([$swatches, $picking]) => {
    return renderHash({
      swatches: $swatches,
      picking: $picking
    });
  }
);

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
