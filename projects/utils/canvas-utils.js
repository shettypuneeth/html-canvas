export const getCanvas = (id) => document.getElementById(id);

export const getContext = (canvas) => canvas.getContext('2d');

export const drawCircle = ({ context, x, y, r, sC, fC, lW }) => {
  context.save();
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI);

  if (sC) {
    context.strokeStyle = sC;
    context.lineWidth = lW;
    context.stroke();
  }

  if (fC) {
    context.fillStyle = fC;
    context.fill();
  }

  context.restore();
};
