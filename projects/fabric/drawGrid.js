export const drawGrid = ({
  context,
  xStep = 10,
  yStep = 10,
  color = '#000',
  lineWidth = 0.75,
}) => {
  context.save();

  // styles
  context.strokeStyle = color;
  context.lineWidth = lineWidth;

  const { width, height } = context.canvas;

  // draw horizontal lines
  for (let i = yStep + lineWidth; i <= height; i += xStep) {
    context.beginPath();
    const y = i - lineWidth / 2;
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  // draw vertical lines
  for (let j = xStep + lineWidth; j <= width; j += yStep) {
    context.beginPath();
    const x = j - lineWidth / 2;
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  context.restore();
};
