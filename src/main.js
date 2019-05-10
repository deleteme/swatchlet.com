import { derived, get } from 'svelte/store';
import App from './App.svelte';
import { name, swatches } from './store.js';
import { parseURL, toString, renderHash } from './url-helpers.js';
import { memoize } from './memoize.js';


const syncURLtoState = memoize(function _syncURLtoState(url) {
  const newState = parseURL(url);
  if (newState) {
    name.set(newState.name);
    swatches.set(newState.swatches);
    //store.set(newState);
    return true;
  }
});

if (!syncURLtoState(location.href)) {
  console.log('redirecting to ');
  location.hash = toString({
    name: get(name),
    swatches: get(swatches)
  });
}

/*
const syncStateToUrl = memoize(function _syncStateToUrl(state) {
  //console.log('syncStateToUrl', state);
  const url = renderHash(state);
  if (url !== location.hash) {
    location.hash = url;
  }
});

const handleStateChange = ({ current }) => syncStateToUrl(current);

store.on('state', handleStateChange);
*/

const derivedLocationHash = derived([name, swatches], ([$name, $swatches]) => {
  return renderHash({
    name: $name, swatches, $swatches
  });
});

derivedLocationHash.subscribe(hash => {
  location.hash = hash;
});

const handleHashChange = e => {
  //console.log('handle hash change');
  syncURLtoState(e.newURL);
};

window.addEventListener('hashchange', handleHashChange, false);

const app = new App({
  target: document.body,
  store
});
//console.log('exporting app');
export default app;
