(function () {
  const CANVAS_DIMENSIONS = {
    width: 225,
    height: 225,
  };

  const WATCH_DIMENSIONS = {
    radius: 100,
    dialWidth: 10,
    tickWidth: 3,
    tickLenght: 20,
    secHandWidth: 3,
    secHandLenght: 75,
    minHandWidth: 5,
    minHandLenght: 75,
    hourHandWidth: 5,
    hourHandLenght: 45,
    dialColors: ["#45aaf2", "#2ecc71", "#f1c40f", "#1abc9c", "#F97F51"],
    basePivotColor: "#fff",
    topPivotColor: "#d63031",
    screwColor: "#2d3436",
  };

  const canvas = document.getElementById("watch-face");
  const context = canvas.getContext("2d");

  let drawingSurfaceImageData;
  const saveDrawingSurface = (context) => {
    drawingSurfaceImageData = context.getImageData(
      0,
      0,
      context.canvas.width,
      context.canvas.height
    );
  };

  const restoreDrawingSurface = (context) => {
    context.putImageData(drawingSurfaceImageData, 0, 0);
  };

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
        // WATCH_DIMENSIONS.tickLenght -
        10
      ),
      WATCH_DIMENSIONS.tickWidth,
      WATCH_DIMENSIONS.tickLenght
    );

    context.restore();
  };

  const drawTicks = () => {
    for (let index = 0; index < 12; index++) {
      context.save();

      const angle = (index * Math.PI) / 6;
      context.rotate(angle);

      drawTick(index);

      context.restore();
    }
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
      context.fillStyle = color;
      context.fillRect(-width / 2, -offset, width, length + offset);
    } else {
      context.strokeStyle = color;
      context.strokeRect(-width / 2, -offset, width, length + offset);
    }

    context.restore();
  };

  const drawHands = (secAngle, minAngle, hourAngle) => {
    drawHand({
      length: WATCH_DIMENSIONS.minHandLenght,
      width: WATCH_DIMENSIONS.minHandWidth,
      color: "#dfe6e9",
      angle: minAngle,
      offset: 0,
      type: "fill",
    });
    drawHand({
      length: WATCH_DIMENSIONS.hourHandLenght,
      width: WATCH_DIMENSIONS.hourHandWidth,
      color: "#dfe6e9",
      angle: hourAngle,
      offset: 0,
      type: "fill",
    });

    drawPivot(WATCH_DIMENSIONS.basePivotColor, 6);

    drawHand({
      length: WATCH_DIMENSIONS.secHandLenght,
      width: WATCH_DIMENSIONS.secHandWidth,
      color: "#d63031",
      angle: secAngle,
      offset: 20,
      type: "fill",
    });

    drawPivot(WATCH_DIMENSIONS.topPivotColor, 4);
    drawPivot(WATCH_DIMENSIONS.screwColor, 2);
  };

  const tick = (date) => {
    restoreDrawingSurface(context);

    const seconds = date.getSeconds();
    const minutes = date.getMinutes() + seconds / 60;
    const hour = date.getHours() + minutes / 60;
    const hoursInBase60 = (hour * 60) / 12;

    const secAngle = base60ToRadians(seconds) + Math.PI;
    const minAngle = base60ToRadians(minutes) + Math.PI;
    const hourAngle = base60ToRadians(hoursInBase60) + Math.PI;

    drawHands(secAngle, minAngle, hourAngle);
  };

  let clearIntervalId;
  let isRunning = false;

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
    if (!isRunning) {
      context.translate(canvas.width / 2, canvas.height / 2);
    } else {
      context.clearRect(
        -CANVAS_DIMENSIONS.width / 2,
        -CANVAS_DIMENSIONS.height / 2,
        CANVAS_DIMENSIONS.width,
        CANVAS_DIMENSIONS.height
      );
    }
  };

  const drawWatchFace = () => {
    initialize();

    drawDials();

    drawTicks();

    // save the drawing surface that doesn't change
    saveDrawingSurface(context);

    if (clearIntervalId) clearInterval(clearIntervalId);

    // first tick intentionally delayed by a second to give the flash effect
    clearIntervalId = setInterval(() => tick(new Date()), 1000);
  };

  // BEGIN
  const render = () => {
    context.canvas.onmousedown = drawWatchFace;

    drawWatchFace();
    isRunning = true;
  };

  render();
})();
