import App from './App.html';
import store from './store.js';
import { parseURL, toString } from './url-helpers.js';
import initialState from './initial-state.js';
const a = toString(initialState);
const b = toString(parseURL(`x#${a}`));
console.log('testing url helpers');
console.assert(
  a === b,
  { message: 'parseURL is compatable with toString' }
);

window.store = store;

const syncURLtoState = url => {
  console.log('syncURLtoState');
  const newState = parseURL(url);
  if (newState) {
    console.log('newState', newState);
    store.set(newState);
    return true;
  }
};

if (!syncURLtoState(location.href)) {
  console.log('redirecting to ', toString(initialState));
  location.hash = toString(initialState);
  console.log('manually setting initial state');
  store.set(initialState);
}

const handleHashChange = e => {
  console.log('handle hash change');
  syncURLtoState(e.newURL);
};

window.addEventListener('hashchange', handleHashChange, false);

const app = new App({
  target: document.body,
  store
});
console.log(' exporting app');
export default app;
