import { getCanvas, getContext } from '@ps/utils';
import { zoomCamera, getViewport, zoomIn } from '@ps/utils';

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

  if (ctrlKey) {
    setCamera(zoomCamera(camera, { x: clientX, y: clientY }, deltaY / 100));
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

  context.fillRect(canvas.width / 2 - 50, canvas.height / 2 - 50, 100, 100);
};

render();
