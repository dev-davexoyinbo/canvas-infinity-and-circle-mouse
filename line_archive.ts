import {
    BALLS_DENSITY,
    canvas,
    canvasBackgroundRGBA,
    ctx,
    rootStyle,
  } from "./app.js";
  import { Circle, IDrawable, Vec } from "./models.js";
  import {
    getRandomColor,
    getRandomFloatingNumber,
    getRandomNumber,
    setCanvasToFullScreen,
  } from "./utils.js";
  
  let drawables: {
    infinityPath: Array<{
      radius: number;
      frequency: number;
      drawable: IDrawable;
      phaseLagInRadians?: number;
    }>;
    circlePaths: Array<{
      radius: number;
      frequency: number;
      // drawable: IDrawable;
      position: Vec;
      lineWidth: number;
      color: string;
      phaseLagInRadians?: number;
    }>;
  } = { infinityPath: [], circlePaths: [] };
  
  function initialize() {
    const rect = ctx.canvas.getBoundingClientRect();
    drawables = { infinityPath: [], circlePaths: [] };
  
    for (let i = 0; i < 2; i++) {
      drawables.circlePaths.push({
        radius: getRandomNumber(150, 250),
        frequency: getRandomFloatingNumber(0.5, 2),
        // frequency: getRandomFloatingNumber(0.5, 2),
        position: {
          x: 0,
          y: 0,
        },
        lineWidth: getRandomNumber(3, 8),
        color: getRandomColor({ solid: true }),
      });
    }
  
    // drawables.infinityPath.push({
    //   radius: 200,
    //   frequency: 0.5,
    //   drawable: new Circle({
    //     position: {
    //       x: rect.width / 2,
    //       y: rect.height / 2,
    //     },
    //     radius: 20,
    //     strokeStyle: "black",
    //     fillStyle: "green",
    //   }),
    // });
  } //end initialize
  
  function animate() {
    const rect = ctx.canvas.getBoundingClientRect();
    const timestamp = new Date().getTime() / 1000;
    const center: Vec = {
      x: rect.width / 2,
      y: rect.height / 2,
    };
    const { r, g, b } = canvasBackgroundRGBA;
    ctx.fillStyle = `rgba(${r},${g}, ${b}, 0.1)`;
    ctx.fillRect(0, 0, rect.width, rect.height);
  
    // Circles
    drawables.circlePaths.forEach((el) => {
      const radius = el.radius;
      const angle =
        el.frequency * 2 * Math.PI * timestamp + (el.phaseLagInRadians || 0);
  
      const position = el.position;
      const newPosition = {
        x: center.x + Math.sin(angle) * radius,
        y: center.y + Math.cos(angle) * radius,
      };
      ctx.beginPath();
      ctx.moveTo(position.x, position.y);
      ctx.lineTo(newPosition.x, newPosition.y);
      ctx.stroke();
    });
  
    // Infinity path
    drawables.infinityPath.forEach((el) => {
      const radius = el.radius;
      const angle =
        el.frequency * 2 * Math.PI * timestamp + (el.phaseLagInRadians || 0);
  
      el.drawable.position = {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + (Math.sin(angle) * Math.cos(angle) * radius) / Math.sqrt(2),
      };
      el.drawable.draw(ctx);
    });
  
    requestAnimationFrame(animate);
  }
  
  window.addEventListener("resize", () => {
    rootStyle.style.setProperty("--viewport-height", `${window.innerHeight}px`);
    setCanvasToFullScreen(canvas);
    initialize();
  });
  
  setCanvasToFullScreen(canvas);
  
  initialize();
  animate();
  