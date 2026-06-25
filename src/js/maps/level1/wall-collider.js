import { Actor, Engine, Vector, DisplayMode, Keys, toDegrees, toRadians, CollisionType } from "excalibur"

export class WallCollider extends Actor {

    isWallCollider = true;

    constructor(pos) {
        super({
            width: 1,
            height: 1,
            collisionType: CollisionType.Fixed
        })
        this.pos = new Vector(pos.x + 0.5, pos.y + 0.5);
        this.addTag("Wall")
    }
}