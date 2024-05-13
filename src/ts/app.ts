import { getColorRGBA, getRandomColor, setCanvasToFullScreen } from "./utils.js";

export const rootStyle = document.documentElement;
export const DEVICE_DPI_RATIO = window.devicePixelRatio || 1;
export const canvas: HTMLCanvasElement = document.querySelector(
  ".canvas"
) as HTMLCanvasElement;
export const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export const SHAPE_TYPES = ["infinity", "circle"];
export const SHAPE_BEHAVIOUR = ["default", "from-edge", "from-corner-through-center", "from-corner"];

// number of balls per 10_000 pixels square, ie 100px x 100px
export const BALLS_DENSITY = 1;

const backgroundColors: string[] = [
    "lightcyan",
    "lightblue",
    "rgb(0, 51, 14)",
    "rgb(65, 0, 66)",
    "#29363C",
    "#2B273C"
]

const backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
export const canvasBackgroundRGBA = getColorRGBA(backgroundColor)

canvas.style.backgroundColor = backgroundColor;
