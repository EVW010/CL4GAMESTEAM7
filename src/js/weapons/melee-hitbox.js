import { Actor, Engine, Vector, DisplayMode, Keys, toDegrees, toRadians, CollisionType, CircleCollider } from "excalibur";
import { RenderObject } from "../renderBase/renderbase";


export class MeleeHitbox extends Actor {

    dmg;
    player;
    timer = 0;

    constructor(spawnerPos, player, radius, dmg) {
        super()
        this.pos = spawnerPos;
        this.player = player;
        this.dmg = dmg;
        console.log("melee-hitbox added")

        this.collider.set(new CircleCollider({
            radius: radius, // this.collider.CircleCollider.radius
        }))
    }

    onPreUpdate() {
        this.timer++;
        if (this.timer > 1) {
            this.kill();
            console.log("melee-hitbox deleted");
        }
        
    }
}