import { getColorRGBA } from "./utils.js";
export var rootStyle = document.documentElement;
export var DEVICE_DPI_RATIO = window.devicePixelRatio || 1;
export var canvas = document.querySelector(".canvas");
export var ctx = canvas.getContext("2d");
export var SHAPE_TYPES = ["infinity", "circle"];
export var SHAPE_BEHAVIOUR = ["default", "from-edge", "from-corner-through-center", "from-corner"];
export var BALLS_DENSITY = 1;
var backgroundColors = [
    "lightcyan",
];
var backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
export var canvasBackgroundRGBA = getColorRGBA(backgroundColor);
canvas.style.backgroundColor = backgroundColor;
