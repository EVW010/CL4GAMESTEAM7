import { Actor, Engine, Vector, DisplayMode, Keys } from "excalibur"
import { Resources } from './resources.js'

export class Bullet extends Actor {

    game;
    fromWeapon;
    damage;
    movementSpeed = 0.85;

    constructor(rotation, fromWeapon, damage) {
        super();
        this.rotation = rotation;
        this.fromWeapon = fromWeapon;
        this.damage = damage;
    }

    onInitialize(engine) {
        this.game = engine;
        if (this.fromWeapon == "burner") {
            //set sprites
        } else if (this.fromWeapon == "cans") {
            //set sprites
        }
    }

    onPreUpdate(engine) {
        this.vel.x += Math.cos(this.rotation)*this.movementSpeed;
        this.vel.y += Math.sin(this.rotation)*this.movementSpeed;
    }
}