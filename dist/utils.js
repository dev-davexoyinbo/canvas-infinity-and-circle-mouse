import { DEVICE_DPI_RATIO } from "./app.js";
export function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
export function getRandomColor(options) {
    return "rgba(".concat(Math.floor(Math.random() * 256), ", ").concat(Math.floor(Math.random() * 256), ", ").concat(Math.floor(Math.random() * 256), ", ").concat((options === null || options === void 0 ? void 0 : options.solid) ? 1 : 0.5 + Math.random() * 0.5, ")");
}
export function setCanvasToFullScreen(canvas) {
    setCanvasSize(canvas, window.innerWidth, window.innerHeight);
}
export function setCanvasSize(canvas, width, height) {
    var context = canvas.getContext("2d");
    canvas.width = width * DEVICE_DPI_RATIO;
    canvas.height = height * DEVICE_DPI_RATIO;
    context === null || context === void 0 ? void 0 : context.scale(DEVICE_DPI_RATIO, DEVICE_DPI_RATIO);
    canvas.style.width = "".concat(width, "px");
    canvas.style.height = "".concat(height, "px");
}
export function positionWithinBounds(val, min, max) {
    return min <= val && val <= max;
}
