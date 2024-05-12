import { positionWithinBounds } from "./utils.js";

export type Vec = {
  x: number;
  y: number;
};

export abstract class IDrawable {
  //   requiresUpdate: boolean = true;
  keepWithinContextBounds: boolean = false;
  particleOffset: Vec = { x: 0, y: 0 };
  frictionOnBounce: Vec = { x: 0, y: 0 };
  lastUpdate: number = new Date().getTime();
  stickyOnBounceOnLowSpeed: Vec = {x: 0, y: 0};

  abstract position: Vec;
  abstract velocity: Vec;
  abstract acceleration: Vec;

  draw(ctx: CanvasRenderingContext2D): void {
    // if (!this.requiresUpdate) return;
    this._draw(ctx);
    this.computeKinetics(ctx);
    // this.requiresUpdate = false;
  }

  protected abstract _draw(ctx: CanvasRenderingContext2D): void;
  /**
   * Computes the new position, velocity, and acceleration of the current
   * instance based on the canvas context bounds.
   * @param {CanvasRenderingContext2D} ctx the canvas context
   */
  protected computeKinetics(ctx: CanvasRenderingContext2D) {
    // If there is no velocity and acceleration, no need to compute.
    if (
      this.velocity.x == 0 &&
      this.velocity.y == 0 &&
      this.acceleration.x == 0 &&
      this.acceleration.y == 0
    )
      return;
    const newUpdateTime = new Date().getTime();

    let secondsPassed = (newUpdateTime - this.lastUpdate) / 1000;
    if (secondsPassed > 1) secondsPassed = 0;

    const rect = ctx.canvas.getBoundingClientRect();

    

    // If the object is supposed to be kept within the context bounds.
    if (this.keepWithinContextBounds) {
      const newVelocity = {
        x: this.velocity.x,
        y: this.velocity.y,
      };
      const newPosition = {
        x: this.position.x + newVelocity.x * secondsPassed,
        y: this.position.y + newVelocity.y * secondsPassed,
      };

      // If the object is outside the context bounds on the x-axis.
      if (
        !positionWithinBounds(
          newPosition.x,
          rect.left + this.particleOffset.x,
          rect.right - this.particleOffset.x
        )
      ) {
        // Reverse the velocity on the x-axis.
        newVelocity.x =
          Math.abs(newVelocity.x) *
          (newPosition.x < rect.left + this.particleOffset.x ? 1 : -1);
      }

      // If the object is outside the context bounds on the y-axis.
      if (
        !positionWithinBounds(
          newPosition.y,
          rect.top + this.particleOffset.y,
          rect.bottom - this.particleOffset.y
        )
      ) {
        // Reverse the velocity on the y-axis.
        newVelocity.y =
          Math.abs(newVelocity.y) *
          (newPosition.y < rect.left + this.particleOffset.y ? 1 : -1);
      }

      // If the velocity on the y-axis changed sign, apply friction.
      const withinBounds = positionWithinBounds(
        this.position.y,
        rect.top + this.particleOffset.y,
        rect.bottom - this.particleOffset.y
      );

      const newPositionWithinBounds = positionWithinBounds(
        newPosition.y,
        rect.top + this.particleOffset.y,
        rect.bottom - this.particleOffset.y
      );

      if (!newPositionWithinBounds && withinBounds && this.frictionOnBounce.y > 0) {
        Object.assign(newVelocity, {
            // x: Math.abs(newVelocity.x) < this.stickyOnBounceOnLowSpeed.x ? 0 : newVelocity.x * (1 - this.frictionOnBounce.y),
            // y: Math.abs(newVelocity.y) < this.stickyOnBounceOnLowSpeed.y ? 0 : newVelocity.y * (1 - this.frictionOnBounce.y),
            x: newVelocity.x * (1 - this.frictionOnBounce.y),
            y: newVelocity.y * (1 - this.frictionOnBounce.y),
        });
      }
      this.velocity = newVelocity;
    }

    // Update the velocity.
    this.velocity.x += this.acceleration.x * secondsPassed;
    this.velocity.y += this.acceleration.y * secondsPassed;

    // Update the position.
    this.position.x += this.velocity.x * secondsPassed;
    this.position.y += this.velocity.y * secondsPassed;

    if(this.keepWithinContextBounds) {
      Object.assign(this.position, {
        x: Math.max(
          rect.left + this.particleOffset.x,
          Math.min(
            rect.right - this.particleOffset.x,
            this.position.x
          )
        ),
        y: Math.max(
          rect.top + this.particleOffset.y,
          Math.min(
            rect.bottom - this.particleOffset.y,
            this.position.y
          )
        ),
      });
    }

    this.lastUpdate = newUpdateTime;
  }
}

export type CircleInitializer = {
  position?: Vec;
  velocity?: Vec;
  acceleration?: Vec;
  frictionOnBounce?: Vec;
  radius: number;
  strokeStyle?: string | CanvasGradient | CanvasPattern;
  fillStyle?: string | CanvasGradient | CanvasPattern;
  keepWithinContextBounds?: boolean;
};

export class Circle extends IDrawable {
  position: Vec;
  velocity: Vec;
  acceleration: Vec;
  frictionOnBounce: Vec;
  radius: number;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  fillStyle: string | CanvasGradient | CanvasPattern;

  constructor({
    position,
    velocity,
    acceleration,
    radius,
    strokeStyle,
    fillStyle,
    keepWithinContextBounds,
    frictionOnBounce,
  }: CircleInitializer) {
    super();
    this.frictionOnBounce = frictionOnBounce || { x: 0, y: 0 };
    this.position = position || { x: 0, y: 0 };
    this.velocity = velocity || { x: 0, y: 0 };
    this.acceleration = acceleration || { x: 0, y: 0 };
    this.radius = radius;
    this.strokeStyle = strokeStyle || "black";
    this.fillStyle = fillStyle || "white";
    this.keepWithinContextBounds = keepWithinContextBounds || false;
    this.particleOffset = { x: radius, y: radius };
  }

  protected _draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.fillStyle = this.fillStyle;
    ctx.strokeStyle = this.strokeStyle;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }
}
