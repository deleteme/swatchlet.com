import App from './App.svelte';
import store from './store.js';
import { parseURL, toString, renderHash } from './url-helpers.js';
//import initialState from './initial-state.js';
import { memoize } from './memoize.js';

window.store = store;

const syncURLtoState = memoize(function _syncURLtoState(url) {
  //console.log('syncURLtoState');
  const newState = parseURL(url);
  if (newState) {
    //console.log('newState', newState);
    store.set(newState);
    return true;
  }
});

if (!syncURLtoState(location.href)) {
  console.log('redirecting to ', store.get());
  location.hash = toString(store.get());
  //console.log('manually setting initial state');
  //store.set(initialState);
}

const syncStateToUrl = memoize(function _syncStateToUrl(state) {
  //console.log('syncStateToUrl', state);
  const url = renderHash(state);
  if (url !== location.hash) {
    location.hash = url;
  }
});

const handleStateChange = ({ current }) => syncStateToUrl(current);

store.on('state', handleStateChange);

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
