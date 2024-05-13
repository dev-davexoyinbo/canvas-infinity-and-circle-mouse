import { canvas, canvasBackgroundRGBA, ctx, rootStyle, } from "./app.js";
import { closestToEdges, getRandomColor, getRandomEdgePoint, getRandomFloatingNumber, getRandomNumber, setCanvasToFullScreen, } from "./utils.js";
var selectedShapeType = "circle";
var selectedShapeBehaviour = "default";
var behaviourRadioButtons = Array.from(document.querySelectorAll('input[name="behaviour"]'));
behaviourRadioButtons.forEach(function (radio) {
    if (radio.value === selectedShapeBehaviour) {
        radio.checked = true;
    }
    radio.addEventListener("input", function () {
        if (radio.checked) {
            selectedShapeBehaviour = radio.value;
        }
    });
});
var particles = [];
function initialize() {
    var rect = ctx.canvas.getBoundingClientRect();
    particles = [];
    for (var i = 0; i < 20; i++) {
        particles.push({
            radius: getRandomNumber(150, 250),
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
    if (selectedShapeType === "circle") {
        particles.forEach(function (particle) {
            var radius = particle.radius;
            var angle = particle.frequency * 2 * Math.PI * timestamp + (particle.phaseLagInRadians || 0);
            var position = particle.position;
            var newPosition = {
                x: center.x + Math.sin(angle) * radius,
                y: center.y + Math.cos(angle) * radius,
            };
            ctx.beginPath();
            if (selectedShapeBehaviour === "from-corner") {
                ctx.moveTo(closestToEdges(position.x, 0, rect.width), closestToEdges(position.y, 0, rect.height));
            }
            else if (selectedShapeBehaviour === "from-corner-through-center") {
                ctx.moveTo(closestToEdges(particle.edgesPosition.x, 0, rect.width), closestToEdges(particle.edgesPosition.y, 0, rect.height));
            }
            else if (selectedShapeBehaviour === "from-edge") {
                ctx.moveTo(particle.edgesPosition.x, particle.edgesPosition.y);
            }
            else {
                ctx.moveTo(position.x, position.y);
            }
            ctx.lineTo(newPosition.x, newPosition.y);
            ctx.lineWidth = particle.lineWidth;
            ctx.strokeStyle = particle.color;
            ctx.lineCap = "round";
            ctx.stroke();
            particle.position = newPosition;
        });
    }
    else if (selectedShapeType) {
        particles.forEach(function (particle) {
            var radius = particle.radius;
            var angle = particle.frequency * 2 * Math.PI * timestamp + (particle.phaseLagInRadians || 0);
            var position = particle.position;
            var newPosition = {
                x: center.x + Math.cos(angle) * radius,
                y: center.y + (Math.sin(angle) * Math.cos(angle) * radius) / Math.sqrt(2),
            };
            ctx.beginPath();
            ctx.moveTo(position.x, position.y);
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
window.addEventListener("resize", function () {
    rootStyle.style.setProperty("--viewport-height", "".concat(window.innerHeight, "px"));
    setCanvasToFullScreen(canvas);
    initialize();
});
setCanvasToFullScreen(canvas);
initialize();
animate();
