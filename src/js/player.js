import { Actor, Engine, Vector, DisplayMode, Keys, CollisionType, Shape } from "excalibur"
import { Resources } from './resources.js'
import { MAP } from './maps/level1/MapLevel1.js'


export class Player extends Actor {

    game;
    movementSpeed = 0.75;
    rotationSpeed = 0.045;
    hp;

    constructor() {
        super({width:Resources.PlayerTopDown.width * 0.85, height:Resources.PlayerTopDown.height * 0.85});
    }

    onInitialize(engine) {
        this.game = engine;
        this.pos = new Vector(1.5, 1.5);
        this.rotation = 0;
        this.graphics.use(Resources.PlayerTopDown.toSprite());
        this.scale = new Vector(0.035, 0.035);
    }

    isWall(x, y) {
        return MAP[Math.floor(y)]?.[Math.floor(x)] === '#'
    }

    onPreUpdate(engine, delta) {
        //rotation
        if (engine.input.keyboard.isHeld(Keys.Left)) {
            this.rotation -= this.rotationSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.Right)) {
            this.rotation += this.rotationSpeed;
        }

        //movement
        const dt = delta / 1000;
        let moveX = 0;
        let moveY = 0;

        if (engine.input.keyboard.isHeld(Keys.A)) {
            moveX += Math.sin(this.rotation) * this.movementSpeed * dt;
            moveY -= Math.cos(this.rotation) * this.movementSpeed * dt;
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            moveX -= Math.sin(this.rotation) * this.movementSpeed * dt;
            moveY += Math.cos(this.rotation) * this.movementSpeed * dt;
        }
        if (engine.input.keyboard.isHeld(Keys.W)) {
            moveX += Math.cos(this.rotation) * this.movementSpeed * dt;
            moveY += Math.sin(this.rotation) * this.movementSpeed * dt;
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            moveX -= Math.cos(this.rotation) * this.movementSpeed * dt;
            moveY -= Math.sin(this.rotation) * this.movementSpeed * dt;
        }

        const margin = 0.15;

        // Prevent player from moving into walls
        const xEdge = this.pos.x + moveX + Math.sign(moveX) * margin;
        if (this.isWall(xEdge, this.pos.y + margin) || this.isWall(xEdge, this.pos.y - margin)) moveX = 0;

        const yEdge = this.pos.y + moveY + Math.sign(moveY) * margin;
        if (this.isWall(this.pos.x + margin, yEdge) || this.isWall(this.pos.x - margin, yEdge)) moveY = 0;

        this.pos.x += moveX;
        this.pos.y += moveY;
        this.vel = new Vector(0, 0);
    }
}