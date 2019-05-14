<script>
import { onMount, onDestroy } from "svelte";
import {
  canvasState,
  COLOR_MODEL_RGB,
  RANGES,
  pinned,
  colorModel,
  width,
  height
} from "./picker-canvas-store.js";
import { picking, swatches, pickingSwatchRgb } from './store';
import PrimaryCursor from './PrimaryCursor.svelte';
import PinnedCursor from './PinnedCursor.svelte';

let mounted;
let elements, contexts;
let cursorLeft = 0, cursorTop = 0;
let pinnedCursorLeft = 0, pinnedCursorTop = 0, pinnedCursorWidth = 10;

const rgb = { R: 0, G: 0, B: 0 };
const primaryVsPinnedThreshold = 0.65;

const getAxisFromPinned = () => {
  const [xAxis, yAxis] = $colorModel.replace($pinned, "");
  return [xAxis, yAxis];
};

const getImageDataDimensions = () => {
  const [xAxis, yAxis] = getAxisFromPinned();
  const [, width] = RANGES[xAxis];
  const [, height] = RANGES[yAxis];
  return [width, height];
};

const getPinnedImageDataDimensions = () => {
  const width = 1;
  const height = RANGES[$pinned][1];
  return [width, height];
};

const getBuffers = (w, h) => {
  const buf = new ArrayBuffer(h * w * 4); //imageData.data.length);
  const buf8 = new Uint8ClampedArray(buf);
  const data = new Uint32Array(buf);
  return [buf, buf8, data];
};

const renderCanvasSize = () => {
  elements.mounted.width = $width;
  elements.mounted.height = $height;
};

const renderPrimaryCanvasSize = () => {
  if ($colorModel === COLOR_MODEL_RGB) {
    const max = RANGES.R[1]; // 255
    elements.primary.width = max;
    elements.primary.height = max;
  }
};

const renderPinnedCanvasSize = () => {
  if ($colorModel === COLOR_MODEL_RGB) {
    const max = RANGES[$pinned][1]; // 255
    elements.pinned.width = 1;
    elements.pinned.height = max;
  }
};

const render = state => {
  if (!elements || !contexts || !state.width || !state.height) return;
  const swatchRgb = $pickingSwatchRgb;
  renderCanvasSize();
  renderPrimaryCanvasSize();
  renderPinnedCanvasSize();

  const a = 255;
  (function renderPrimaryCanvas() {
    var x = 0;
    var y = 0;
    var index = 0;
    const [imageDataWidth, imageDataHeight] = getImageDataDimensions();
    const imageData = contexts.primary.createImageData(
      imageDataWidth,
      imageDataHeight
    );
    const [xAxis, yAxis] = getAxisFromPinned();
    const primaryWidth = RANGES[xAxis][1]; // 255
    const primaryHeight = RANGES[yAxis][1]; // 255
    const xScale = state.width / primaryWidth;
    const yScale = state.height / primaryHeight;

    const [buf, buf8, data] = getBuffers(imageDataWidth, imageDataHeight);

    const pinnedValue = swatchRgb[state.pinned];
    rgb[state.pinned] = pinnedValue;
    while (y < imageDataHeight) {
      let yAxisValue = y;
      rgb[yAxis] = yAxisValue;
      while (x < imageDataWidth) {
        let xAxisValue = x;

        rgb[xAxis] = xAxisValue;

        // is little endian
        data[index] =
          (a << 24) | // alpha
          (rgb.B << 16) | // blue
          (rgb.G << 8) | // green
          rgb.R;

        // is not little endian
        //data[y * imageDataWidth + x] =
        //(rgb.R << 24) | // red
        //(rgb.G << 16) | // green
        //(rgb.B << 8) | // blue
        //a;

        x += 1;
        index += 1;
      }
      x = 0;
      y += 1;
    }

    imageData.data.set(buf8);
    contexts.primary.putImageData(imageData, 0, 0);
    contexts.mounted.drawImage(
      elements.primary,
      0,
      0,
      Math.floor(primaryWidth * xScale * primaryVsPinnedThreshold),
      Math.floor(primaryHeight * yScale)
    );

    cursorLeft = Math.floor(swatchRgb[xAxis] * xScale * primaryVsPinnedThreshold);
    cursorTop = Math.floor(swatchRgb[yAxis] * yScale);
  })();

  (function renderPinnedCanvas(){
    var y = 0;
    const [pinnedWidth, pinnedHeight] = getPinnedImageDataDimensions();
    const imageData = contexts.pinned.createImageData(
      pinnedWidth,
      pinnedHeight
    );

    const yScale = state.height / pinnedHeight;
    const [buf, buf8, data] = getBuffers(pinnedWidth, pinnedHeight);
    // create a gradient from one to 255
    const others = COLOR_MODEL_RGB.replace(state.pinned, '').split('');
    // others will be something like ['R', 'G']
    rgb[others[0]] = swatchRgb[others[0]];
    rgb[others[1]] = swatchRgb[others[1]];
    while (y < pinnedHeight) {
      rgb[state.pinned] = pinnedHeight - y;
      data[y] =
        (a << 24) | // alpha
        (rgb.B << 16) | // blue
        (rgb.G << 8) | // green
        rgb.R;
      y += 1;
    }

    imageData.data.set(buf8);
    contexts.pinned.putImageData(imageData, 0, 0);
    contexts.mounted.drawImage(
      elements.pinned,
      Math.floor($width * primaryVsPinnedThreshold),
      0,
      Math.ceil($width * (1 - primaryVsPinnedThreshold)),
      Math.floor(pinnedHeight * yScale)
    );

    pinnedCursorLeft = Math.floor($width * primaryVsPinnedThreshold);
    pinnedCursorWidth = Math.ceil($width * (1 - primaryVsPinnedThreshold));
    pinnedCursorTop = (RANGES[$pinned][1] - swatchRgb[$pinned]) * yScale;
  })();
};

const rotatePinned = () => {
  const index = COLOR_MODEL_RGB.indexOf($pinned);
  let newIndex = index + 1;
  if (!COLOR_MODEL_RGB[newIndex]) newIndex = 0;
  $pinned = COLOR_MODEL_RGB[newIndex];
};

let unsubscribe;

onMount(() => {
  elements = {
    mounted,
    primary: document.createElement("canvas"),
    pinned: document.createElement("canvas")
  };
  contexts = {
    mounted: elements.mounted.getContext("2d"),
    primary: elements.primary.getContext("2d"),
    pinned: elements.pinned.getContext("2d")
  };

  unsubscribe = canvasState.subscribe(render);
});


onDestroy(() => {
  unsubscribe();
  elements = null;
  contexts = null;
});
</script>

<style>
.picker-canvas {
  --golden-ratio: 1.618;
  --side: calc((1 / var(--golden-ratio)) * 100%);
  --margin: calc((100% - var(--side)) / 2);
  bottom: var(--margin);
  height: var(--side);
  left: var(--margin);
  right: var(--margin);
  position: absolute;
  top: var(--margin);
  width: var(--side);
}
canvas {
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  height: 100%;
  width: 100%;
}
</style>

<div class="picker-canvas">
  <canvas
    bind:this={mounted}
    bind:clientWidth={$width}
    bind:clientHeight={$height}
    on:click={rotatePinned}
  >
  </canvas>
  <PrimaryCursor left={cursorLeft} top={cursorTop} />
  <PinnedCursor left={pinnedCursorLeft} top={pinnedCursorTop} width={pinnedCursorWidth} />
</div>
