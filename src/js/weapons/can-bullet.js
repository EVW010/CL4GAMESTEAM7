import { Actor, Engine, Vector, DisplayMode, Keys, toDegrees, toRadians, CircleCollider, CollisionType } from "excalibur"
import { Sheets, Resources } from '../resources.js'
import { RenderObject } from '../renderBase/renderbase.js'
import { addAngle } from "../functions.js";
import { WallCollider } from "../maps/level1/wall-collider.js";
import { Player } from "../player.js";

export class CanBullet extends RenderObject {

    game;
    fromWeapon;
    damage;
    movementSpeed = 4;
    archSpeed = 0.475;
    canMove = true;
    groundCollider;
    player;
    hp = 20;

    constructor(pos, rotation, damage, player) {
        super(pos, toDegrees(rotation), player, 0.15);
        this.pos = pos;
        this.rotation = rotation;
        this.damage = damage;
        this.player = player;
        this.pos.x += Math.cos(this.rotation)/2;
        this.pos.y += Math.sin(this.rotation)/2;
        this.dir = -this.dir + 180;
        this.events.on("collisionstart", (event) => this.collide(event));
        this.linked.frameDuration = 4;
        this.sheet = Sheets.Can
        this.scale = new Vector(0.1, 0.1);

        this.timer = 1;
    }

    onPreUpdate(engine, delta) {
        const dt = delta / 1000;
        if (this.vertical > -5.3 && this.canMove) {
            this.pos.x += Math.cos(this.rotation) * this.movementSpeed * dt;
            this.pos.y += Math.sin(this.rotation) * this.movementSpeed * dt;
            this.timer += 0.1 ;
            this.vertical = -3 + Math.sin(this.timer*this.archSpeed)*5.5;
        } else if (this.canMove){
            this.body.collisionType = CollisionType.Fixed;
            this.canMove = false;
            
            this.collider.set(new CircleCollider({
                radius: 1.5,
            }))
            console.log(this.vertical);
        } else {
            if (Math.sqrt((Math.pow(this.player.pos.x - this.pos.x, 2)) + (Math.pow(this.player.pos.y - this.pos.y, 2))) < 1) {
                this.sheet = Sheets.CanAllert
                this.vertical = -0.6;
            } else {
                this.sheet = Sheets.Can;
                this.vertical = -5.483061636887803
            }
        }
        if (this.groundCollider != undefined) {
            // this.groundCollider.rotation = Math.atan2(this.player.pos.y - this.pos.y, this.player.pos.x - this.pos.x);
            console.log(this.pos, this.groundCollider.pos)
        }

        
        

        
    }

    collide(event) {
        const otherObject = event.other.owner;
        if (otherObject instanceof WallCollider) {
            if (this.pos.x >= otherObject.pos.x-0.5 && this.pos.x <= otherObject.pos.x+0.5) {
                this.rotation = -this.rotation;
            } else {
                this.rotation = -this.rotation + Math.PI;
            }
            console.log(this.pos.x, otherObject.pos.x)
        }
        if (otherObject instanceof Player) {
            this.hp--;
            if (this.hp <= 0) {
                this.linked.kill();
                this.kill();
            }
        }
        // console.log(otherObject);
    }
}