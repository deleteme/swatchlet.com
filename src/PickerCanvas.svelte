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
let mounted;
let elements, contexts;
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
  if (!state.width || !state.height) return;
  renderCanvasSize();
  renderPrimaryCanvasSize();
  renderPinnedCanvasSize();

  const a = 255;
  (function renderPrimaryCanvas() {
    var x = 0;
    var y = 0;
    const [pinnedValue] = RANGES[state.pinned];
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
    const [pinnedValue] = RANGES[state.pinned];
    rgb[state.pinned] = pinnedValue;
    const others = COLOR_MODEL_RGB.replace(state.pinned, '').split('');
    // others will be something like ['R', 'G']
    while (y < pinnedHeight) {
      rgb[others[0]] = pinnedHeight - y;
      rgb[others[1]] = pinnedHeight - y;
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
  })();
};

const rotatePinned = () => {
  const index = COLOR_MODEL_RGB.indexOf($pinned);
  let newIndex = index + 1;
  if (!COLOR_MODEL_RGB[newIndex]) newIndex = 0;
  $pinned = COLOR_MODEL_RGB[newIndex];
};

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

  const unsubscribe = canvasState.subscribe(render);

  onDestroy(unsubscribe);
});

onDestroy(() => {
  elements = null;
  contexts = null;
});
</script>

<style>
canvas {
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
</style>

<canvas
  bind:this={mounted}
  bind:clientWidth={$width}
  bind:clientHeight={$height}
  on:click={rotatePinned}
>
</canvas>
