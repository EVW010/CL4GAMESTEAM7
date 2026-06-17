import { Actor, Engine, Vector, DisplayMode, Keys, toDegrees, toRadians } from "excalibur"
import { Resources } from './resources.js'
import { RenderObject } from './renderBase/renderbase.js'
import { addAngle } from "./functions.js";

export class Bullet extends RenderObject {

    game;
    fromWeapon;
    damage;
    movementSpeed = 6;

    constructor(pos, rotation, fromWeapon, damage, player) {
        super(pos, toDegrees(rotation), player);
        this.pos = pos;
        this.rotation = rotation;
        this.fromWeapon = fromWeapon;
        this.damage = damage;
        this.pos.x += Math.cos(this.rotation)/2;
        this.pos.y += Math.sin(this.rotation)/2;
        this.dir = -this.dir + 180;

        this.timer = 0;
    }

    onPreUpdate(engine, delta) {
        const dt = delta / 1000;
        this.pos.x += Math.cos(this.rotation) * this.movementSpeed * dt;
        this.pos.y += Math.sin(this.rotation) * this.movementSpeed * dt;

        this.timer += 0.1 ;
        this.vertical = Math.sin(this.timer)/2;
        console.log(this.vertical);
    }
}