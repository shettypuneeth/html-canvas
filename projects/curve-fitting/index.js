import {
  windowToCanvas,
  addClickEventListener,
  getDomNodes,
  saveDrawingSurface,
  restoreDrawingSurface,
  resetDrawingSurfaceCache,
} from '@ps/utils';
import regression from 'regression';

const canvas = document.getElementById('art-board');
const context = canvas.getContext('2d');

const THEME = {
  light: {
    background: '#e8e8e8',
    canvas: '#ffffff',
  },
};

const CANVAS_DIMENSIONS_DESKTOP = {
  width: 700,
  height: 500,
};
const CURVE_FIT_TYPES = {
  linear: 'linear',
  polynomial: 'polynomial',
};

// STATE
let selectedTheme = 'light';
let curveFitType = 'linear';
let points = [];
let selectedToolDomNode = getDomNodes('.active')[0];

const changeTheme = (theme) => {
  selectedTheme = theme;
  applyThemeColors(theme);
};

const applyThemeColors = (theme = selectedTheme) => {
  const palette = THEME[theme];
  if (!palette) return;

  canvas.style.background = palette.canvas;
};

const setCanvasDimensions = () => {
  if (window.innerWidth < 700) {
    canvas.width = window.innerWidth - 20;
    canvas.height = window.innerHeight - 170;
  } else {
    canvas.width = CANVAS_DIMENSIONS_DESKTOP.width;
    canvas.height = CANVAS_DIMENSIONS_DESKTOP.height;
  }
};

const drawLine = (start, end) => {
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.lineTo(end.x, end.y);
  context.stroke();
};

const handleResetClick = () => {
  clearCanvas();
  resetDrawingSurfaceCache();
};

const handleToolClick = (e) => {
  if (e.currentTarget) {
    const { currentTarget } = e;
    if (selectedToolDomNode) selectedToolDomNode.classList.remove('active');
    selectedToolDomNode = currentTarget;

    currentTarget.classList.add('active');
    curveFitType = currentTarget.getAttribute('data-curvetype');
  }
};

const attachEventListeners = () => {
  addClickEventListener('#reset-canvas', handleResetClick);
  addClickEventListener('[data-curvetype]', handleToolClick);
};

const clearCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

const linearCurveFit = (points) => {
  const result = regression.linear(points);
  const gradient = result.equation[0];
  const yIntercept = result.equation[1];

  const startX = points[0][0];
  const endX = points[points.length - 1][0];
  let startY;
  let endY;
  if (gradient) {
    startY = gradient * startX + yIntercept;
    endY = gradient * endX + yIntercept;
  } else {
    startY = points[0][1];
    endY = points[points.length - 1][1];
  }

  return { startX, startY, endX, endY };
};

const polynomialCurveFit = (points) => {
  const result = regression.polynomial(points, { order: 3 });

  const mappedPoints = result.points;

  let start = mappedPoints[0];
  for (let index = 1; index < mappedPoints.length; index++) {
    const [x, y] = mappedPoints[index];

    drawLine(
      { x: start[0], y: canvas.height - start[1] },
      { x, y: canvas.height - y }
    );
    start = mappedPoints[index];
  }
};

const curveFit = (points) => {
  clearCanvas();
  restoreDrawingSurface(context, true);

  switch (curveFitType) {
    case CURVE_FIT_TYPES.linear: {
      const { startX, startY, endX, endY } = linearCurveFit(points);
      drawLine(
        { x: startX, y: canvas.height - startY },
        { x: endX, y: canvas.height - endY }
      );
      break;
    }
    case CURVE_FIT_TYPES.polynomial:
      polynomialCurveFit(points);
      break;
    default:
      break;
  }

  saveDrawingSurface(context);
};

let isDragging;
let previous;

const onPress = (e) => {
  previous = windowToCanvas(canvas, e.clientX, e.clientY);
  points.push([previous.x, canvas.height - previous.y]);
  isDragging = true;
};

const onDragEnd = () => {
  isDragging = false;

  curveFit(points);

  points = [];
};

const onDrag = (e) => {
  if (isDragging) {
    const loc = windowToCanvas(canvas, e.clientX, e.clientY);
    drawLine(previous, loc);
    previous = loc;
    points.push([previous.x, canvas.height - previous.y]);
  }
};

const run = () => {
  applyThemeColors();
  setCanvasDimensions();

  attachEventListeners();

  canvas.onmousedown = onPress;

  canvas.onmousemove = onDrag;

  canvas.onmouseup = onDragEnd;

  canvas.ontouchstart = (e) => {
    const touchEvent = e.touches[0];
    onPress(touchEvent);
  };

  canvas.ontouchend = onDragEnd;

  canvas.ontouchmove = (e) => {
    const touchEvent = e.touches[0];
    onDrag(touchEvent);
  };
};

run();
