import {
  getCanvas,
  getContext,
  drawCircle,
  clearDrawingSurface,
} from '@ps/utils';
import { timer } from 'd3-timer/src/timer';
import scaleLinear from 'd3-scale/src/linear';
import { cubicOut } from 'd3-ease/src/cubic';

const canvas = getCanvas('pixel-charge');
const context = getContext(canvas);

const DOT_COUNT = 16;
const DOT_RADIUS = 5;

const CIRCLE_RADIUS_START = 35;
const CIRCLE_RADIUS_END = 92;

const TOTAL_DURATION = 3800;
const SCALE_OUT_DURATION = 3000;

const ROTATE_TILL = (Math.PI / 24).toPrecision(2);

let TIMER = null;

context.translate(canvas.width / 2, canvas.height / 2);

const drawRing = (radius, fill = '#fff') => {
  for (let index = 0; index < DOT_COUNT; index++) {
    const angle = (2 * index * Math.PI) / DOT_COUNT;
    const r = radius;
    const x = r * Math.cos(angle);
    const y = r * Math.sin(angle);
    drawCircle({ context, x, y, r: DOT_RADIUS, fC: fill });
  }
};

const scaleRadius = scaleLinear()
  .domain([0, 1])
  .rangeRound([CIRCLE_RADIUS_START, CIRCLE_RADIUS_END])
  .clamp(true);

const scaleRotation = scaleLinear()
  .domain([0, 0.4, 1])
  .range([0, 0, ROTATE_TILL]);

const scaleOpacity = scaleLinear()
  .domain([SCALE_OUT_DURATION, TOTAL_DURATION])
  .range([1, 0])
  .clamp(true);

const tick = (elapsed) => {
  clearDrawingSurface({
    context,
    x: -canvas.width / 2,
    y: -canvas.height / 2,
  });

  const normalizedScaleOutElapsedTime =
    (elapsed % TOTAL_DURATION) / SCALE_OUT_DURATION;
  const normalizedRotateElapsedTime =
    (elapsed % TOTAL_DURATION) / TOTAL_DURATION;

  const radius = scaleRadius(cubicOut(normalizedRotateElapsedTime));
  const rotation = scaleRotation(normalizedRotateElapsedTime);
  context.save();
  context.rotate(rotation);
  drawRing(radius);
  context.restore();

  if (elapsed > SCALE_OUT_DURATION) {
    context.globalAlpha = scaleOpacity(elapsed).toPrecision(2);
  }

  if (elapsed > TOTAL_DURATION) {
    TIMER.restart(tick);
    context.globalAlpha = 1;
  }
};

TIMER = timer(tick);
