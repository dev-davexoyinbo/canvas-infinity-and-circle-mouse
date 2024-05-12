import { DEVICE_DPI_RATIO } from "./app.js";

export function getRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min) + min);
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
