import { Actor, Engine, Vector, DisplayMode, Keys } from "excalibur"
import { Resources } from './resources.js'
import { BurnerWeapon } from './burner-weapon.js'

export class Player extends Actor {

    game;
    movementSpeed = 0.75;
    rotationSpeed = 0.045;
    selectedWeapon = 1;
    burnerWeaponProgress = 0;
    oxygenLeven = 100;
    hp;

    constructor() {
        super({width:0.8, height:0.8});
    }

    onInitialize(engine) {
        this.game = engine;
        this.pos = new Vector(1.5, 1.5);
        this.rotation = 0;
        this.addChild(new BurnerWeapon());
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

        //handicaps
        for (let i = 1; i <= 10; i++) {
            if (this.burnerWeaponProgress >= i*10 && this.oxygenLeven > 0) {
                this.oxygenLeven -= 0.02;
            }
        }
        if (this.oxygenLeven <= 0) {
            this.hp -= 0.1;
        }
        

        console.log(this.oxygenLeven);
    }
}