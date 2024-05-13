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
  getRandomNumber,
  setCanvasToFullScreen,
} from "./utils.js";

const drawables: {
  infinityPath: Array<{
    radius: number;
    frequency: number;
    drawable: IDrawable;
    phaseLagInRadians?: number;
  }>;
  circlePaths: Array<{
    radius: number;
    frequency: number;
    drawable: IDrawable;
    phaseLagInRadians?: number;
  }>;
} = { infinityPath: [], circlePaths: [] };

function initialize() {
  const rect = ctx.canvas.getBoundingClientRect();
  drawables.circlePaths = [];

  drawables.circlePaths.push(
    {
      radius: 200,
      frequency: 0.5,
      drawable: new Circle({
        position: {
          x: rect.width / 2,
          y: rect.height / 2,
        },
        radius: 20,
        strokeStyle: "black",
        fillStyle: "black",
      }),
    },
    {
      radius: 200,
      frequency: 0.5,
      phaseLagInRadians: Math.PI,
      drawable: new Circle({
        position: {
          x: rect.width / 2,
          y: rect.height / 2,
        },
        radius: 20,
        strokeStyle: "black",
        fillStyle: "red",
      }),
    }
  );

  drawables.infinityPath.push({
    radius: 200,
    frequency: 0.5,
    drawable: new Circle({
      position: {
        x: rect.width / 2,
        y: rect.height / 2,
      },
      radius: 20,
      strokeStyle: "black",
      fillStyle: "green",
    }),
  });
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

    el.drawable.position = {
      x: center.x + Math.sin(angle) * radius,
      y: center.y + Math.cos(angle) * radius,
    };

    el.drawable.draw(ctx);
  });

  // Infinity path
  drawables.infinityPath.forEach((el) => {
    const radius = el.radius;
    const angle =
      el.frequency * 2 * Math.PI * timestamp + (el.phaseLagInRadians || 0);

    el.drawable.position = {
      x: center.x + Math.cos(angle) * radius ,
      y: center.y + Math.sin(angle) * Math.cos(angle) * radius / Math.sqrt(2),
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
