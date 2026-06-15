import { Actor, Engine, Vector, DisplayMode, Keys } from "excalibur"
import { Resources } from './resources.js'


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

    onPreUpdate(engine) {
        //rotation
        if (engine.input.keyboard.isHeld(Keys.Left)) {
            this.rotation -= this.rotationSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.Right)) {
            this.rotation += this.rotationSpeed;
        }

        //movement
        this.vel = new Vector(0, 0);

        if (engine.input.keyboard.isHeld(Keys.A)) {
            this.vel.x += Math.sin(this.rotation)*this.movementSpeed;
            this.vel.y -= Math.cos(this.rotation)*this.movementSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.D)) {
            this.vel.x -= Math.sin(this.rotation)*this.movementSpeed;
            this.vel.y += Math.cos(this.rotation)*this.movementSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.W)) {
            this.vel.x += Math.cos(this.rotation)*this.movementSpeed;
            this.vel.y += Math.sin(this.rotation)*this.movementSpeed;
        }
        if (engine.input.keyboard.isHeld(Keys.S)) {
            this.vel.x -= Math.cos(this.rotation)*this.movementSpeed;
            this.vel.y -= Math.sin(this.rotation)*this.movementSpeed;
        }
    }
}