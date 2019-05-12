<script>
  import { onMount } from 'svelte';
  import { canvasState, COLOR_MODEL_RGB, RANGES, pinned, colorModel, width, height } from './picker-canvas-store.js';
  let mounted;
  let elements, contexts;
  const rgb = { R: 0, G: 0, B: 0 };

  const getAxisFromPinned = () => {
    const [xAxis, yAxis] = $colorModel.replace($pinned, "");
    return [xAxis, yAxis];
  }
  const getImageDataDimensions = () => {
    const [xAxis, yAxis] = getAxisFromPinned();
    const [, width] = RANGES[xAxis];
    const [, height] = RANGES[yAxis];
    return [width, height];
  }

  const getBuffers = () => {
    const [w, h] = getImageDataDimensions();
    const buf = new ArrayBuffer(h * w * 4); //imageData.data.length);
    const buf8 = new Uint8ClampedArray(buf);
    const data = new Uint32Array(buf);
    return [ buf, buf8, data ]
  };

  const renderPrimaryCanvasSize = () => {
    if ($colorModel === COLOR_MODEL_RGB) {
      const max = RANGES.R[1]; // 255
      elements.primary.width = max;
      elements.primary.height = max;
    }
  }
  const getImageData = () => {
    const [width, height] = getImageDataDimensions();
    return contexts.primary.createImageData(width, height);
  };

  const render = (state) => {
    if (!state.width || !state.height) return;
    renderPrimaryCanvasSize();

    var x = 0;
    var y = 0;
    const a = 255;
    const [pinnedValue] = RANGES[state.pinned];
    var index = 0;
    const [imageDataWidth, imageDataHeight] = getImageDataDimensions();
    const imageData = getImageData();
    const [xAxis, yAxis] = getAxisFromPinned();
    const primaryWidth = RANGES[xAxis][1];// 255
    const primaryHeight = RANGES[yAxis][1];// 255
    const xScale = state.width / primaryWidth;
    const yScale = state.height / primaryHeight;

    const [buf, buf8, data] = getBuffers();

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
      Math.floor(primaryWidth * xScale),
      Math.floor(primaryHeight * yScale)
    );
  };

  onMount(() => {
    elements = {
      mounted,
      primary: document.createElement("canvas"),
      //pinned: document.createElement("canvas")
    };
    contexts = {
      mounted: elements.mounted.getContext("2d"),
      primary: elements.primary.getContext("2d"),
      //pinned: elements.pinned.getContext("2d")
    };

    //render();
    canvasState.subscribe(render);
  });
</script>

<style>
canvas {
  background: white;
  height: 100%;
  width: 100%;
}
</style>

<canvas
  bind:this={mounted}
  bind:clientWidth={$width}
  bind:clientHeight={$height}
>
</canvas>
