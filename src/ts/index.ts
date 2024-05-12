import { BALLS_DENSITY, canvas, ctx, rootStyle } from "./app.js";
import { Circle, IDrawable, Vec } from "./models.js";
import {
  getRandomColor,
  getRandomNumber,
  setCanvasToFullScreen,
} from "./utils.js";

const drawables: IDrawable[] = [];

function initialize() {
  const frictionOnBounce: Vec = { x: 0.05, y: 0.05 };
  const rect = ctx.canvas.getBoundingClientRect();

  const ballCount = Math.floor(
    (rect.width * rect.height) / BALLS_DENSITY / 10_000
  );

  // const ballCount = 1

  if (ballCount > drawables.length) {
    for (let i = 0; i < ballCount - drawables.length; i++) {
      const radius = getRandomNumber(20, 70);
      const position: Vec = {
        x: getRandomNumber(radius, rect.width - radius),
        y: getRandomNumber(radius, rect.height * 0.97 - radius),
      };
      const velocity: Vec = {
        x: getRandomNumber(-70, 70),
        y: getRandomNumber(-70, 70),
      };
      const color = getRandomColor();

      drawables.push(
        new Circle({
          position,
          velocity,
          acceleration: { x: 0, y: 1000 },
          radius,
          frictionOnBounce,
          strokeStyle: color,
          fillStyle: color,
          keepWithinContextBounds: true,
        })
      );
    }
  } else {
    const deleteCount = drawables.length - ballCount;
    drawables.splice(drawables.length - deleteCount, drawables.length);
  }
} //end initialize

function joltBalls() {
  drawables.forEach((drawable) => {
    drawable.velocity = {
      x: getRandomNumber(-1000, 1000),
      y: getRandomNumber(500, 4_000),
    };
  });
}

function animate() {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  drawables.forEach((drawable) => {
    drawable.draw(ctx);
  });

  requestAnimationFrame(animate);
}

window.addEventListener("resize", () => {
  rootStyle.style.setProperty("--viewport-height", `${window.innerHeight}px`);
  setCanvasToFullScreen(canvas);
  initialize();
});

window.addEventListener("click", () => {
  joltBalls();
})

setCanvasToFullScreen(canvas);

initialize();
animate();
