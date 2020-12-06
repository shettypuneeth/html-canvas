let DRAWING_SURFACE_CACHE = [];

export const saveDrawingSurface = (context) => {
  DRAWING_SURFACE_CACHE.push(
    context.getImageData(0, 0, context.canvas.width, context.canvas.height)
  );
};

export const restoreDrawingSurface = (context, popOnRestore) => {
  const imageData = DRAWING_SURFACE_CACHE[DRAWING_SURFACE_CACHE.length - 1];

  imageData && context.putImageData(imageData, 0, 0);

  if (popOnRestore) popDrawingSurfaceCache();
};

export const popDrawingSurfaceCache = () => DRAWING_SURFACE_CACHE.pop();

export const resetDrawingSurfaceCache = () => {
  DRAWING_SURFACE_CACHE = [];
};
