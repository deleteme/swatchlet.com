import { writable, derived } from 'svelte/store';

export const COLOR_MODEL_RGB = 'RGB';
const COLOR_MODEL_HSL = 'HSL';
const [R, G, B] = COLOR_MODEL_RGB.split('');
const [H, S, L] = COLOR_MODEL_HSL.split('');
export const RANGES = {
  R: [0, 255],
  G: [0, 255],
  B: [0, 255],
  H: [0, 360],
  S: [0, 100],
  L: [0, 100]
};

export const pinned = writable(B);
export const colorModel = writable(COLOR_MODEL_RGB);
export const width = writable(null);
export const height = writable(null);

export const canvasState = derived(
  [pinned, colorModel, width, height],
  ([pinned, colorModel, width, height]) => {
    return { pinned, colorModel, width, height };
  }
);

export const tracking = writable(null);
