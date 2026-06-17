import { Actor, Engine, Vector, DisplayMode, Keys, toDegrees, toRadians } from "excalibur"
import { Resources } from './resources.js'
import { RenderObject } from './renderBase/renderbase.js'
import { addAngle } from "./functions.js";

export class Bullet extends RenderObject {

    game;
    fromWeapon;
    damage;
    movementSpeed = 0.0005;

    constructor(pos, rotation, fromWeapon, damage, player) {
        super(pos, toDegrees(rotation), player);
        this.pos = pos;
        this.rotation = rotation;
        this.fromWeapon = fromWeapon;
        this.damage = damage;
        this.pos.x += Math.cos(this.rotation)*this.movementSpeed*50;
        this.pos.y += Math.sin(this.rotation)*this.movementSpeed*50;
        this.dir = -this.dir + 180;
    }

    onPreUpdate(engine) {
        this.vel.x += Math.cos(this.rotation)*this.movementSpeed;
        this.vel.y += Math.sin(this.rotation)*this.movementSpeed;
    }
}