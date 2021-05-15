import { getCanvas, getContext, drawCircle } from '@ps/utils';

const canvas = getCanvas('find-my');
const context = getContext(canvas);

context.translate(canvas.width / 2, canvas.height / 2);

// (𝑥𝑘,𝑦𝑘)=(𝑥0+𝑟cos(2𝑘𝜋/𝑛),𝑦0+𝑟sin(2𝑘𝜋/𝑛)) for 𝑘=0 to 𝑛−1.

const circles = [];

const drawRing = (radius, fill = 'rgba(255, 255, 255, 0.3)') => {
  for (let index = 0; index < 30; index++) {
    const angle = (2 * index * Math.PI) / 30;
    const r = radius;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    drawCircle({ context, x, y, r: 4, fC: fill });
  }
};

drawRing(200);
context.rotate(Math.PI / 18);
drawRing(210, 'yellow');
context.rotate(Math.PI / 10);
drawRing(215, 'red');
