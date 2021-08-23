import { getCanvas, getContext } from '@ps/utils';
import {
  zoomCamera,
  getViewport,
  panCamera,
  windowToCanvas,
  drawCircle,
} from '@ps/utils';

const canvas = getCanvas('zoom-ui');
const context = getContext(canvas);

let camera = { x: 0, y: 0, z: 1 };
const canvasBoundingRect = canvas.getBoundingClientRect();

const viewport = getViewport(camera, {
  minX: canvasBoundingRect.left,
  minY: canvasBoundingRect.top,
  maxX: canvasBoundingRect.right,
  maxY: canvasBoundingRect.bottom,
  width: canvasBoundingRect.width,
  height: canvasBoundingRect.height,
});

// events
canvas.addEventListener('wheel', handleWheel, { passive: false });

const setCamera = (newCamera) => {
  camera = newCamera;
};

function handleWheel(event) {
  event.preventDefault();

  const { clientX, clientY, deltaX, deltaY, ctrlKey } = event;
  const point = windowToCanvas(canvas, clientX, clientY);

  if (ctrlKey) {
    setCamera(zoomCamera(camera, point, deltaY / 100));
  } else {
    setCamera(panCamera(camera, deltaX, deltaY));
  }

  render();
}

const render = () => {
  context.resetTransform();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.scale(camera.z, camera.z);
  context.translate(camera.x, camera.y);

  drawCircle({
    context,
    x: 0,
    y: canvas.height / 2,
    r: 80,
    fC: '#f1c40f',
  });
  drawCircle({
    context,
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: 80,
    fC: '#2980b9',
  });
  drawCircle({
    context,
    x: canvas.width,
    y: canvas.height / 2,
    r: 80,
    fC: '#d35400',
  });
};

render();
