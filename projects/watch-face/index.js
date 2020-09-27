import { delay } from "@ps/async";
import { timer } from "d3-timer/src/timer";
import scaleLinear from "d3-scale/src/linear";
import { polyInOut } from "d3-ease/src/poly";
import {
  saveDrawingSurface,
  restoreDrawingSurface,
  popDrawingSurfaceCache,
  resetDrawingSurfaceCache,
} from "@ps/utils";

const CANVAS_DIMENSIONS = {
  width: 225,
  height: 225,
};

const WATCH_DIMENSIONS = {
  radius: 100,
  dialWidth: 10,
  tickWidth: 3,
  tickLength: 20,
  secHandWidth: 2,
  secHandLength: 75,
  minHandWidth: 8,
  minHandLength: 75,
  hourHandWidth: 8,
  hourHandLength: 48,
  dialColors: ["#45aaf2", "#2ecc71", "#f1c40f", "#1abc9c", "#F97F51"],
  basePivotColor: "#f5f6fa",
  topPivotColor: "#d63031",
  screwColor: "#2d3436",
};

const WATCH_STATE = {};

const canvas = document.getElementById("watch-face");
const context = canvas.getContext("2d");

const getRandomNumber = (max, min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1) - min);
};

// map 60 ticks to 2 * PI
const base60ToRadians = (base60Number) => (2 * Math.PI * base60Number) / 60;

const getCanvasCenter = () => ({
  x: 0,
  y: 0,
});

const drawDial = (radius, color = "#45aaf2") => {
  context.save();

  const { x, y } = getCanvasCenter();
  context.beginPath();
  context.arc(x, y, radius, 0, 2 * Math.PI);

  context.strokeStyle = color;
  context.lineWidth = 2;
  context.stroke();

  context.restore();
};

const drawTick = () => {
  context.save();
  context.strokeStyle = "#fff";

  context.strokeRect(
    -WATCH_DIMENSIONS.tickWidth / 2,
    -(
      WATCH_DIMENSIONS.radius -
      WATCH_DIMENSIONS.dialWidth -
      // WATCH_DIMENSIONS.tickLength -
      10
    ),
    WATCH_DIMENSIONS.tickWidth,
    WATCH_DIMENSIONS.tickLength
  );

  context.restore();
};

const drawTicks = () => {
  return new Promise((resolve) => {
    WATCH_STATE.tickCount = 0;

    WATCH_STATE.tickAnimationTimer = setInterval(() => {
      if (WATCH_STATE.tickCount === 12) {
        clearInterval(WATCH_STATE.tickAnimationTimer);
        delete WATCH_STATE.tickAnimationTimer;
        WATCH_STATE.tickCount = 0;

        resolve();
      } else {
        context.save();

        const angle = (WATCH_STATE.tickCount * Math.PI) / 6;
        context.rotate(angle);

        drawTick(WATCH_STATE.tickCount);
        WATCH_STATE.tickCount += 1;

        context.restore();
      }
    }, 50);
  });
};

const drawPivot = (color, size) => {
  context.beginPath();
  context.save();

  context.fillStyle = color;
  context.shadowColor = "#000";
  context.shadowBlur = 20;
  context.shadowOffsetX = -2;
  context.shadowOffsetY = -2;
  context.arc(0, 0, size, 0, 2 * Math.PI);
  context.clip();
  context.fill();

  context.restore();
};

const drawHand = ({ length, width, color, angle, offset, type }) => {
  context.save();

  context.rotate(angle);

  if (type === "fill") {
    const innerLength = 16;
    context.beginPath();

    context.lineWidth = 3;
    context.strokeStyle = color;

    context.moveTo(0, 0);
    context.lineTo(0, innerLength);
    context.stroke();

    context.beginPath();

    context.lineWidth = width;
    context.lineCap = "round";

    context.moveTo(0, innerLength);
    context.lineTo(0, length + offset);
    context.stroke();
  } else {
    context.fillStyle = color;
    context.fillRect(-width / 2, -offset, width, length + offset);
  }

  context.restore();
};

const drawSecondsHand = (angle) =>
  drawHand({
    length: WATCH_DIMENSIONS.secHandLength,
    width: WATCH_DIMENSIONS.secHandWidth,
    color: "#d63031",
    angle,
    offset: 20,
  });

const drawHands = (secAngle, minAngle, hourAngle) => {
  minAngle &&
    drawHand({
      length: WATCH_DIMENSIONS.minHandLength,
      width: WATCH_DIMENSIONS.minHandWidth,
      color: "#dcdde1",
      angle: minAngle,
      offset: 0,
      type: "fill",
    });

  hourAngle &&
    drawHand({
      length: WATCH_DIMENSIONS.hourHandLength,
      width: WATCH_DIMENSIONS.hourHandWidth,
      color: "#dcdde1",
      angle: hourAngle,
      offset: 0,
      type: "fill",
    });

  drawPivot(WATCH_DIMENSIONS.basePivotColor, 5);

  if (secAngle) {
    drawSecondsHand(secAngle);

    drawPivot(WATCH_DIMENSIONS.topPivotColor, 4);
    drawPivot(WATCH_DIMENSIONS.screwColor, 3);
  }
};

const getAnglesForDate = (date) => {
  const seconds = date.getSeconds();
  const minutes = date.getMinutes() + seconds / 60;
  const hour = date.getHours() + minutes / 60;
  const hoursInBase60 = (hour * 60) / 12;

  const secAngle = base60ToRadians(seconds) + Math.PI;
  const minAngle = base60ToRadians(minutes) + Math.PI;
  const hourAngle = base60ToRadians(hoursInBase60) + Math.PI;

  return {
    secAngle,
    minAngle,
    hourAngle,
  };
};

const tick = (date) => {
  restoreDrawingSurface(context);

  const { secAngle, minAngle, hourAngle } = getAnglesForDate(date);

  drawHands(secAngle, minAngle, hourAngle);
};

const drawDials = () => {
  const dialColorIndex = getRandomNumber(
    WATCH_DIMENSIONS.dialColors.length - 1
  );
  const dialColor = WATCH_DIMENSIONS.dialColors[dialColorIndex];

  drawDial(WATCH_DIMENSIONS.radius, dialColor);
  drawDial(WATCH_DIMENSIONS.radius - WATCH_DIMENSIONS.dialWidth, dialColor);
};

const initialize = () => {
  // For the first run, translate context to center of canvas
  if (!WATCH_STATE.isRunning) {
    context.translate(canvas.width / 2, canvas.height / 2);
  } else {
    if (WATCH_STATE.clearIntervalId) clearInterval(WATCH_STATE.clearIntervalId);

    context.clearRect(
      -CANVAS_DIMENSIONS.width / 2,
      -CANVAS_DIMENSIONS.height / 2,
      CANVAS_DIMENSIONS.width,
      CANVAS_DIMENSIONS.height
    );
    resetDrawingSurfaceCache();
  }
};

const slideClockHandToPlace = ({
  end,
  start = 0,
  converter = (d) => d,
  duration = 1000,
}) => {
  return new Promise((resolve) => {
    const handScale = scaleLinear().domain([0, 1]).range([start, end]);

    WATCH_STATE.slideClockHandTimer = timer((elapsed) => {
      restoreDrawingSurface(context);
      const normalizedElapsedTime = (elapsed % duration) / duration;
      const easedElapsedTime = polyInOut(normalizedElapsedTime);

      const target = handScale(easedElapsedTime);
      const angle = converter(target);

      if (elapsed > duration) {
        WATCH_STATE.slideClockHandTimer.stop();
        popDrawingSurfaceCache();
        drawHands(converter(end));
        resolve();
        return true;
      }
      drawHands(angle);
    });
  });
};

const drawWatchFace = async () => {
  WATCH_STATE.renderComplete = false;

  initialize();

  drawDials();

  await drawTicks();

  // save the drawing surface that doesn't change
  saveDrawingSurface(context);

  await delay(300);

  const now = new Date();

  // get the seconds + time taken to animate the hand in place + delay
  const seconds = now.getSeconds() + 1.3;

  const { minAngle, hourAngle } = getAnglesForDate(now);
  drawHands(null, minAngle, hourAngle);
  saveDrawingSurface(context);

  await delay(300);

  const converter = (seconds) => base60ToRadians(seconds) + Math.PI;
  await slideClockHandToPlace({ end: seconds, converter });

  // first tick intentionally delayed by a second to give the flash effect
  WATCH_STATE.clearIntervalId = setInterval(() => tick(new Date()), 1000);

  WATCH_STATE.renderComplete = true;
};

// BEGIN
const render = () => {
  context.canvas.onmousedown = () => {
    if (!WATCH_STATE.renderComplete) return;

    drawWatchFace();
  };

  drawWatchFace();
  WATCH_STATE.isRunning = true;
};

render();
