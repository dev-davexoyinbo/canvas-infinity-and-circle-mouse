export var rootStyle = document.documentElement;
export var DEVICE_DPI_RATIO = window.devicePixelRatio || 1;
export var canvas = document.querySelector(".canvas");
export var ctx = canvas.getContext("2d");
export var BALLS_DENSITY = 1;
var backgroundColors = [
    "lightcyan",
    "lightblue",
    "rgb(0, 51, 14)",
    "rgb(65, 0, 66)",
    "#29363C",
    "#2B273C"
];
canvas.style.backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];
