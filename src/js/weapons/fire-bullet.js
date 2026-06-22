import { Actor, Engine, Vector, DisplayMode, Keys, toDegrees, toRadians } from "excalibur"
import { Sheets } from '../resources.js'
import { RenderObject } from '../renderBase/renderbase.js'
import { addAngle } from "../functions.js";
import { WallCollider } from "../maps/level1/wall-collider.js";

export class Bullet extends RenderObject {

    game;
    fromWeapon;
    damage;
    movementSpeed = 6;

    constructor(pos, rotation, damage, player) {
        super(pos, toDegrees(rotation), player, 0.15, 0.15);
        this.pos = pos;
        this.rotation = rotation;
        this.damage = damage;
        this.pos.x += Math.cos(this.rotation)/2;
        this.pos.y += Math.sin(this.rotation)/2;
        this.dir = -this.dir + 180;
        this.events.on("collisionstart", (event) => this.collide(event));
        this.sheet = Sheets.flame_bullet
        this.linked.frameDuration = 4;

        this.timer = 0;
    }

    onPreUpdate(engine, delta) {
        const dt = delta / 1000;
        this.pos.x += Math.cos(this.rotation) * this.movementSpeed * dt;
        this.pos.y += Math.sin(this.rotation) * this.movementSpeed * dt;

        this.timer += 0.1 ;
        this.vertical = Math.sin(this.timer)/2;
    }

    collide(event) {
        const otherObject = event.other.owner;
        if (otherObject instanceof WallCollider) {
            this.linked.kill();
            this.kill();
        }
        console.log(otherObject);
    }
}