import { writable } from 'svelte/store';

const isMobileMediaQuery = window.matchMedia('(min-width: 0) and (max-width: 812px)');

export const isMobile = writable(isMobileMediaQuery.matches);

isMobileMediaQuery.addListener(e => {
  isMobile.set(e.matches);
});

