import { Vector } from "excalibur";
import { RenderObject } from "../../renderBase/renderbase";
import { Sheets } from "../../resources";
import { Player } from "../../player";
import { WallCollider } from "../../maps/level1/wall-collider";

export class LobberProj extends RenderObject {
    movementSpeed = 1;

    constructor(pos, dir, player) {
        super(pos, dir, player, 0.15);
        console.log('BULLET CREATED')
        this.pos = new Vector(pos.x, pos.y);

        this.dir = dir;

        this.pos.x += Math.cos(this.dir); 
        this.pos.y += Math.sin(this.dir);

        this.sheet = Sheets.flame_bullet;
        this.linked.frameDuration = 4;

        this.events.on("collisionstart", (e) => this.collide(e));
    }

    onPreUpdate(engine, delta) {
        const dt = delta / 1000;

        this.pos.x += Math.cos(this.dir) * this.movementSpeed * dt;
        this.pos.y += Math.sin(this.dir) * this.movementSpeed * dt;
    }

    collide(event) {
        const other = event.other.owner;
        if (other instanceof Player) {
            other.hp -= 20;
            this.linked.kill();
            this.kill();
            console.log('HIT PLAYER')
        }

        if (other instanceof WallCollider) {
            this.linked.kill();
            this.kill();
            console.log('HIT WALL')
        }

        
    }
}