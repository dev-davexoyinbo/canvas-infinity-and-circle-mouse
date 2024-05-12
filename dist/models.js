var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { positionWithinBounds } from "./utils.js";
var IDrawable = (function () {
    function IDrawable() {
        this.keepWithinContextBounds = false;
        this.particleOffset = { x: 0, y: 0 };
        this.frictionOnBounce = { x: 0, y: 0 };
        this.lastUpdate = new Date().getTime();
        this.stickyOnBounceOnLowSpeed = { x: 0, y: 0 };
    }
    IDrawable.prototype.draw = function (ctx) {
        this._draw(ctx);
        this.computeKinetics(ctx);
    };
    IDrawable.prototype.computeKinetics = function (ctx) {
        if (this.velocity.x == 0 &&
            this.velocity.y == 0 &&
            this.acceleration.x == 0 &&
            this.acceleration.y == 0)
            return;
        var newUpdateTime = new Date().getTime();
        var secondsPassed = (newUpdateTime - this.lastUpdate) / 1000;
        if (secondsPassed > 1)
            secondsPassed = 0;
        var rect = ctx.canvas.getBoundingClientRect();
        if (this.keepWithinContextBounds) {
            var newVelocity = {
                x: this.velocity.x,
                y: this.velocity.y,
            };
            var newPosition = {
                x: this.position.x + newVelocity.x * secondsPassed,
                y: this.position.y + newVelocity.y * secondsPassed,
            };
            if (!positionWithinBounds(newPosition.x, rect.left + this.particleOffset.x, rect.right - this.particleOffset.x)) {
                newVelocity.x =
                    Math.abs(newVelocity.x) *
                        (newPosition.x < rect.left + this.particleOffset.x ? 1 : -1);
            }
            if (!positionWithinBounds(newPosition.y, rect.top + this.particleOffset.y, rect.bottom - this.particleOffset.y)) {
                newVelocity.y =
                    Math.abs(newVelocity.y) *
                        (newPosition.y < rect.left + this.particleOffset.y ? 1 : -1);
            }
            var withinBounds = positionWithinBounds(this.position.y, rect.top + this.particleOffset.y, rect.bottom - this.particleOffset.y);
            var newPositionWithinBounds = positionWithinBounds(newPosition.y, rect.top + this.particleOffset.y, rect.bottom - this.particleOffset.y);
            if (!newPositionWithinBounds && withinBounds && this.frictionOnBounce.y > 0) {
                Object.assign(newVelocity, {
                    x: newVelocity.x * (1 - this.frictionOnBounce.y),
                    y: newVelocity.y * (1 - this.frictionOnBounce.y),
                });
            }
            this.velocity = newVelocity;
        }
        this.velocity.x += this.acceleration.x * secondsPassed;
        this.velocity.y += this.acceleration.y * secondsPassed;
        this.position.x += this.velocity.x * secondsPassed;
        this.position.y += this.velocity.y * secondsPassed;
        if (this.keepWithinContextBounds) {
            Object.assign(this.position, {
                x: Math.max(rect.left + this.particleOffset.x, Math.min(rect.right - this.particleOffset.x, this.position.x)),
                y: Math.max(rect.top + this.particleOffset.y, Math.min(rect.bottom - this.particleOffset.y, this.position.y)),
            });
        }
        this.lastUpdate = newUpdateTime;
    };
    return IDrawable;
}());
export { IDrawable };
var Circle = (function (_super) {
    __extends(Circle, _super);
    function Circle(_a) {
        var position = _a.position, velocity = _a.velocity, acceleration = _a.acceleration, radius = _a.radius, strokeStyle = _a.strokeStyle, fillStyle = _a.fillStyle, keepWithinContextBounds = _a.keepWithinContextBounds, frictionOnBounce = _a.frictionOnBounce;
        var _this = _super.call(this) || this;
        _this.frictionOnBounce = frictionOnBounce || { x: 0, y: 0 };
        _this.position = position || { x: 0, y: 0 };
        _this.velocity = velocity || { x: 0, y: 0 };
        _this.acceleration = acceleration || { x: 0, y: 0 };
        _this.radius = radius;
        _this.strokeStyle = strokeStyle || "black";
        _this.fillStyle = fillStyle || "white";
        _this.keepWithinContextBounds = keepWithinContextBounds || false;
        _this.particleOffset = { x: radius, y: radius };
        return _this;
    }
    Circle.prototype._draw = function (ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
    };
    return Circle;
}(IDrawable));
export { Circle };
