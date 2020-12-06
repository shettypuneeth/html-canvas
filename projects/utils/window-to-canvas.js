export const windowToCanvas = (canvas, x, y) => {
  const boundingBox = canvas.getBoundingClientRect();

  return {
    x: x - boundingBox.left * (canvas.width / boundingBox.width),
    y: y - boundingBox.top * (canvas.height / boundingBox.height),
  };
};
