import { BALLS_DENSITY, canvas, ctx, rootStyle } from "./app.js";
import { Circle } from "./models.js";
import { getRandomColor, getRandomNumber, setCanvasToFullScreen, } from "./utils.js";
var drawables = [];
function initialize() {
    var frictionOnBounce = { x: 0.05, y: 0.05 };
    var rect = ctx.canvas.getBoundingClientRect();
    var ballCount = Math.floor((rect.width * rect.height) / BALLS_DENSITY / 10000);
    if (ballCount > drawables.length) {
        for (var i = 0; i < ballCount - drawables.length; i++) {
            var radius = getRandomNumber(20, 70);
            var position = {
                x: getRandomNumber(radius, rect.width - radius),
                y: getRandomNumber(radius, rect.height * 0.97 - radius),
            };
            var velocity = {
                x: getRandomNumber(-70, 70),
                y: getRandomNumber(-70, 70),
            };
            var color = getRandomColor();
            drawables.push(new Circle({
                position: position,
                velocity: velocity,
                acceleration: { x: 0, y: 1000 },
                radius: radius,
                frictionOnBounce: frictionOnBounce,
                strokeStyle: color,
                fillStyle: color,
                keepWithinContextBounds: true,
            }));
        }
    }
    else {
        var deleteCount = drawables.length - ballCount;
        drawables.splice(drawables.length - deleteCount, drawables.length);
    }
}
function joltBalls() {
    drawables.forEach(function (drawable) {
        drawable.velocity = {
            x: getRandomNumber(-1000, 1000),
            y: getRandomNumber(500, 4000),
        };
    });
}
function animate() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawables.forEach(function (drawable) {
        drawable.draw(ctx);
    });
    requestAnimationFrame(animate);
}
window.addEventListener("resize", function () {
    rootStyle.style.setProperty("--viewport-height", "".concat(window.innerHeight, "px"));
    setCanvasToFullScreen(canvas);
    initialize();
});
window.addEventListener("click", function () {
    joltBalls();
});
setCanvasToFullScreen(canvas);
initialize();
animate();
