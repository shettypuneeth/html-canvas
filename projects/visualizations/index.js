import { drawGrid } from '@ps/fabric';
import {
  getCanvas,
  getContext,
  saveDrawingSurface,
  restoreDrawingSurface,
} from '@ps/utils';
import { scaleLinear } from 'd3-scale';
import { timer } from 'd3-timer/src/timer';

// Equations taken from the below observable post from Chris Camargo
// https://observablehq.com/@camargo/the-fourier-transform#:~:text=The%20Fourier%20Transform%20is%20a,the%20Fourier%20Transform%20in%20action.
const canvas = getCanvas('visualizations');
const context = getContext(canvas);

const GRID_STEP = canvas.width / 10;

drawGrid({
  context,
  color: '#9c88ff',
  xStep: GRID_STEP,
  yStep: GRID_STEP,
});

saveDrawingSurface(context);

context.translate(canvas.width / 2, canvas.height / 2);

const SIGNAL_FREQUENCY = 3;
const DURATION = 6000;
let TIMER;

const f = (t, f) => 0.75 + 0.5 * Math.cos(2 * Math.PI * f * t);
const xScaleWindingGraph = scaleLinear().domain([-1.5, 1.5]).range([-200, 200]);
const yScaleWindingGraph = scaleLinear().domain([-1.5, 1.5]).range([-200, 200]);
const scaleTime = scaleLinear()
  .domain([0, 1])
  .range([0, SIGNAL_FREQUENCY * 2]);

let previous;

const drawWindingGraph = (start, end) => {
  context.beginPath();

  const xEndScaled = xScaleWindingGraph(end.x);
  const yEndScaled = yScaleWindingGraph(end.y);
  if (start) {
    const xStartScaled = xScaleWindingGraph(start.x);
    const yStartScaled = yScaleWindingGraph(start.y);

    context.moveTo(xStartScaled, yStartScaled);
  }

  context.lineTo(xEndScaled, yEndScaled);
  context.strokeStyle = '#fed330';
  context.lineWidth = 1.5;
  context.stroke();
};

const computeWindingGraphPoint = (time, frequency) => {
  const g = f(time, SIGNAL_FREQUENCY);

  const x = g * Math.cos(-2 * Math.PI * time * frequency);
  const y = g * Math.sin(-2 * Math.PI * time * frequency);

  return { x, y };
};

let frequencyStep = 0.2;

const tick = (elapsed) => {
  const normalizedElapsed = (elapsed % DURATION) / DURATION;
  const time = scaleTime(normalizedElapsed);

  const nextPoint = computeWindingGraphPoint(time, frequencyStep);
  drawWindingGraph(previous, nextPoint);

  previous = nextPoint;
};

const runner = (elapsed) => {
  if (elapsed >= DURATION) {
    restoreDrawingSurface(context);

    frequencyStep += 0.1;
    if (frequencyStep > 6) {
      frequencyStep = 0.2;
    }
    previous = null;

    TIMER.restart(runner);
    return;
  }

  tick(elapsed);
};

TIMER = timer(runner);
