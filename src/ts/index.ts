import {
  BALLS_DENSITY,
  canvas,
  canvasBackgroundRGBA,
  ctx,
  rootStyle,
} from "./app.js";
import { Circle, IDrawable, Vec } from "./models.js";
import {
  closestToEdges,
  getRandomColor,
  getRandomEdgePoint,
  getRandomFloatingNumber,
  getRandomNumber,
  setCanvasToFullScreen,
} from "./utils.js";

type Particle = {
  radius: number;
  frequency: number;
  position: Vec;
  edgesPosition: Vec;
  lineWidth: number;
  color: string;
  phaseLagInRadians?: number;
};

let selectedShapeType = "circle";
let selectedShapeBehaviour = "default";
let particleCount = 30;

const behaviourRadioButtons: HTMLInputElement[] = Array.from(
  document.querySelectorAll('input[name="behaviour"]')
);
behaviourRadioButtons.forEach((radio) => {
  if (radio.value === selectedShapeBehaviour) {
    radio.checked = true;
  }

  radio.addEventListener("input", () => {
    if (radio.checked) {
      selectedShapeBehaviour = radio.value;
    }
  });
});

const shapeRadioButtons: HTMLInputElement[] = Array.from(
  document.querySelectorAll('input[name="shape"]')
);
shapeRadioButtons.forEach((radio) => {
  if (radio.value === selectedShapeType) {
    radio.checked = true;
  }

  radio.addEventListener("input", () => {
    if (radio.checked) {
      selectedShapeType = radio.value;
    }
  });
});

let particles: Particle[] = [];

function initialize() {
  const rect = ctx.canvas.getBoundingClientRect();
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      radius: getRandomNumber(Math.min(150, rect.width * 0.2), Math.min(300, rect.width * 0.5)),
      frequency: getRandomFloatingNumber(0.4, 0.8),
      position: {
        x: rect.width / 2,
        y: rect.height / 2,
      },
      edgesPosition: getRandomEdgePoint(0, 0, rect.width, rect.height),
      lineWidth: getRandomNumber(2, 4),
      color: getRandomColor({ solid: true }),
    });
  }
} //end initialize

function getStartingPointForBehaviour(
  behaviour: string,
  particle: Particle
): Vec {
  const rect = ctx.canvas.getBoundingClientRect();
  const position = particle.position;

  switch (behaviour) {
    case "from-corner":
      return {
        x: closestToEdges(position.x, 0, rect.width),
        y: closestToEdges(position.y, 0, rect.height),
      };
    case "from-corner-through-center":
      return {
        x: closestToEdges(particle.edgesPosition.x, 0, rect.width),
        y: closestToEdges(particle.edgesPosition.y, 0, rect.height),
      };
    case "from-edge":
      return {
        x: particle.edgesPosition.x,
        y: particle.edgesPosition.y,
      };
    default:
      return position;
  }
}

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

  if (selectedShapeType === "circle") {
    // Circles
    particles.forEach((particle) => {
      const radius = particle.radius;
      const angle =
        particle.frequency * 2 * Math.PI * timestamp +
        (particle.phaseLagInRadians || 0);

      const position = particle.position;
      const newPosition = {
        x: center.x + Math.sin(angle) * radius,
        y: center.y + Math.cos(angle) * radius,
      };
      ctx.beginPath();
      const startPosition = getStartingPointForBehaviour(
        selectedShapeBehaviour,
        particle
      );
      ctx.moveTo(startPosition.x, startPosition.y);
      ctx.lineTo(newPosition.x, newPosition.y);
      ctx.lineWidth = particle.lineWidth;
      ctx.strokeStyle = particle.color;
      ctx.lineCap = "round";
      ctx.stroke();

      particle.position = newPosition;
    });
  } else if (selectedShapeType) {
    // Infinity path
    particles.forEach((particle) => {
      const radius = particle.radius;
      const angle =
        particle.frequency * 2 * Math.PI * timestamp +
        (particle.phaseLagInRadians || 0);

      const position = particle.position;
      const newPosition = {
        x: center.x + Math.cos(angle) * radius,
        y:
          center.y +
          (Math.sin(angle) * Math.cos(angle) * radius) / Math.sqrt(2),
      };
      ctx.beginPath();
      const startPosition = getStartingPointForBehaviour(
        selectedShapeBehaviour,
        particle
      );
      ctx.moveTo(startPosition.x, startPosition.y);
      ctx.lineTo(newPosition.x, newPosition.y);
      ctx.lineWidth = particle.lineWidth;
      ctx.strokeStyle = particle.color;
      ctx.lineCap = "round";
      ctx.stroke();

      particle.position = newPosition;
    });
  }

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
