export const screenToCanvas = (point, camera) => ({
  x: point.x / camera.z - camera.x,
  y: point.y / camera.z - camera.y,
});

export const canvasToScreen = (point, camera) => ({
  x: (point.x + camera.y) * camera.x,
  y: (point.y + camera.y) * camera.y,
});

/**
 * The viewport is a box that represents which part of the canvas is shown on the screen.
 */
export const getViewport = (camera, box) => {
  const topLeft = screenToCanvas({ x: box.minX, y: box.minY }, camera);
  const bottomRight = screenToCanvas({ x: box.maxX, y: box.maxY }, camera);

  return {
    minX: topLeft.x,
    minY: topLeft.y,
    maxX: bottomRight.x,
    maxY: bottomRight.y,
    height: bottomRight.x - topLeft.x,
    width: bottomRight.y - topLeft.y,
  };
};

export const panCamera = (camera, dx, dy) => ({
  x: camera.x - dx / camera.z,
  y: camera.y - dy / camera.z,
  z: camera.z,
});

export const zoomCamera = (camera, point, dz) => {
  const zoom = camera.z - dz * camera.z;

  const p1 = screenToCanvas(point, camera);
  const p2 = screenToCanvas(point, { ...camera, z: zoom });

  return {
    x: camera.x + (p2.x - p1.x),
    y: camera.y + (p2.y - p1.y),
    z: zoom,
  };
};

export const zoomIn = (camera, center) => {
  const i = Math.round(camera.z * 100) / 25;
  const nextZoom = (i + 1) * 0.25;
  const centerPoint = center || {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  };

  return zoomCamera(camera, centerPoint, camera.z - nextZoom);
};

export const zoomOut = (camera) => {
  const i = Math.round(camera.z * 100) / 25;
  const nextZoom = (i - 1) * 0.25;
  const center = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

  return zoomCamera(camera, center, camera.z - nextZoom);
};
