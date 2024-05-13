import { canvas, canvasBackgroundRGBA, ctx, rootStyle, } from "./app.js";
import { Circle } from "./models.js";
import { getRandomColor, getRandomFloatingNumber, getRandomNumber, setCanvasToFullScreen, } from "./utils.js";
var drawables = { infinityPath: [], circlePaths: [] };
function initialize() {
    var rect = ctx.canvas.getBoundingClientRect();
    drawables = { infinityPath: [], circlePaths: [] };
    for (var i = 0; i < 2; i++) {
        drawables.circlePaths.push({
            radius: getRandomNumber(150, 250),
            frequency: getRandomFloatingNumber(0.5, 2),
            drawable: new Circle({
                position: {
                    x: rect.width / 2,
                    y: rect.height / 2,
                },
                radius: getRandomNumber(3, 8),
                strokeStyle: "transparent",
                fillStyle: getRandomColor({ solid: true }),
            }),
        });
    }
}
function animate() {
    var rect = ctx.canvas.getBoundingClientRect();
    var timestamp = new Date().getTime() / 1000;
    var center = {
        x: rect.width / 2,
        y: rect.height / 2,
    };
    var r = canvasBackgroundRGBA.r, g = canvasBackgroundRGBA.g, b = canvasBackgroundRGBA.b;
    ctx.fillStyle = "rgba(".concat(r, ",").concat(g, ", ").concat(b, ", 0.1)");
    ctx.fillRect(0, 0, rect.width, rect.height);
    drawables.circlePaths.forEach(function (el) {
        var radius = el.radius;
        var angle = el.frequency * 2 * Math.PI * timestamp + (el.phaseLagInRadians || 0);
        el.drawable.position = {
            x: center.x + Math.sin(angle) * radius,
            y: center.y + Math.cos(angle) * radius,
        };
        el.drawable.draw(ctx);
    });
    drawables.infinityPath.forEach(function (el) {
        var radius = el.radius;
        var angle = el.frequency * 2 * Math.PI * timestamp + (el.phaseLagInRadians || 0);
        el.drawable.position = {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * Math.cos(angle) * radius / Math.sqrt(2),
        };
        el.drawable.draw(ctx);
    });
    requestAnimationFrame(animate);
}
window.addEventListener("resize", function () {
    rootStyle.style.setProperty("--viewport-height", "".concat(window.innerHeight, "px"));
    setCanvasToFullScreen(canvas);
    initialize();
});
setCanvasToFullScreen(canvas);
initialize();
animate();
