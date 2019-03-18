import { Store } from 'svelte/store.js';

import { parseURL } from './url-helpers.js';

const initialStateFromURL = parseURL(location.href);

class SwatchStore extends Store {}

export default new SwatchStore(initialStateFromURL || {});
