import { DEVICE_DPI_RATIO } from "./app.js";
import { Vec } from "./models.js";

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomFloatingNumber(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function getRandomColor(options?: {solid?: boolean}) {
  return `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
    Math.random() * 256
  )}, ${Math.floor(Math.random() * 256)}, ${options?.solid ? 1 : 0.5 + Math.random() * 0.5})`;
}

export function setCanvasToFullScreen(canvas: HTMLCanvasElement) {
  setCanvasSize(canvas, window.innerWidth, window.innerHeight);
}

export function setCanvasSize(
  canvas: HTMLCanvasElement,
  width: number,
  height: number
) {
  const context = canvas.getContext("2d");

  canvas.width = width * DEVICE_DPI_RATIO;
  canvas.height = height * DEVICE_DPI_RATIO;

  context?.scale(DEVICE_DPI_RATIO, DEVICE_DPI_RATIO);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
}

export function positionWithinBounds(val: number, min: number, max: number): boolean {
  return  min <= val && val <= max;
}

export function getColorRGBA(color: string): { r: number, g: number, b: number, a: number } {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  // Set the fillStyle to the color string
  ctx.fillStyle = color;
  // Fill a pixel with the color
  ctx.fillRect(0, 0, 1, 1);
  // Get the ImageData of the pixel
  const pixel = ctx.getImageData(0, 0, 1, 1).data;

  // Return an object with r, g, b, and a values
  return {
      r: pixel[0],
      g: pixel[1],
      b: pixel[2],
      a: pixel[3] / 255 // Normalize alpha value to range 0-1
  };
}

export function closestToEdges(position: number, edgeA: number, edgeB: number): number {
  const distanceToA = Math.abs(position - edgeA);
  const distanceToB = Math.abs(position - edgeB);

  if (distanceToA < distanceToB) {
      return edgeA;
  } else {
      return edgeB;
  }
}

export function getRandomEdgePoint(xMin: number, yMin: number, width: number, height: number): Vec {
  const edge = Math.floor(Math.random() * 4) + 1;
  
  switch (edge) {
    case 1: // Top edge
      return {
        x: Math.floor(Math.random() * width) + xMin,
        y: yMin,
      };
    case 2: // Right edge
      return {
        x: xMin + width - 1,
        y: Math.floor(Math.random() * height) + yMin,
      };
    case 3: // Bottom edge
      return {
        x: Math.floor(Math.random() * width) + xMin,
        y: yMin + height - 1,
      };
    case 4: // Left edge
    default:
      return {
        x: xMin,
        y: Math.floor(Math.random() * height) + yMin,
      };
  }
}