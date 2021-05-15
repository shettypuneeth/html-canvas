import {
  getCanvas,
  getContext,
  drawCircle,
  getDomNodes,
  clearDrawingSurface,
} from '@ps/utils';
import { timer } from 'd3-timer/src/timer';
import scaleLinear from 'd3-scale/src/linear';
import { cubicOut } from 'd3-ease/src/cubic';

const canvas = getCanvas('pixel-charge');
const context = getContext(canvas);

const DOT_COUNT = 16;
const DOT_RADIUS = 5;

const CIRCLE_RADIUS_START = 40;
const CIRCLE_RADIUS_END = 95;
const ROTATE_TILL = (Math.PI / 24).toPrecision(2);

// ANIMATION DURATION
const TOTAL_DURATION = 4600;
const SCALE_OUT_END = 3500;
const ROTATION_START = 1500;
const ROTATION_END = 3600;
const OPACITY_START = 3700;
const OPACITY_END = 4300;

const chargePercentIndicatorDomNode = getDomNodes('#charge-percent')[0];
let chargeLevel = 1;

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
  .range([CIRCLE_RADIUS_START, CIRCLE_RADIUS_END])
  .clamp(true);

const scaleRotation = scaleLinear()
  .domain([0, ROTATION_START, ROTATION_END])
  .range([0, 0, ROTATE_TILL]);

const scaleOpacity = scaleLinear()
  .domain([OPACITY_START, OPACITY_END])
  .range([1, 0])
  .clamp(true);

const tick = (elapsed) => {
  clearDrawingSurface({
    context,
    x: -canvas.width / 2,
    y: -canvas.height / 2,
  });

  const scaleOutDurationNormalized = (elapsed % TOTAL_DURATION) / SCALE_OUT_END;

  const radius = scaleRadius(cubicOut(scaleOutDurationNormalized));
  const rotation = scaleRotation(elapsed);

  context.save();
  context.rotate(rotation);
  drawRing(radius);
  context.restore();

  if (elapsed > OPACITY_START) {
    context.globalAlpha = scaleOpacity(elapsed).toPrecision(2);
  }

  if (elapsed > TOTAL_DURATION) {
    TIMER.restart(tick);
    context.globalAlpha = 1;
  }
};

const startCharging = () => {
  if (chargeLevel === 100) return;

  chargePercentIndicatorDomNode.innerText = ++chargeLevel;
};

TIMER = timer(tick);

// start charging
setInterval(startCharging, 10000);
