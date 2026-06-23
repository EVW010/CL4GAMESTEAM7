import { RenderObject } from "../renderBase/renderbase";
import { Vector, toDegrees } from "excalibur";
import { Sheets } from "../resources";
import { addAngle } from "../functions";

export class EnemyBase extends RenderObject {
    constructor(spawnerPos, dir, player, radius, health) {
        super(spawnerPos, dir, player, radius)
        this.maxHealth = health
        this.health = health
        this.flinchmod = 1
        this.flinchsheet = Sheets.None
        this.flinchtimer
        this.dmgmod = 1

        this.TGT = new Vector(0, 0)

        this.vel = new Vector(0, 0)

        this.state = 1

    }

    /* takeDamage(amount) {
        this.health -= amount * this.dmgmod
        console.log(this.health)

        if(this.health >= 0) {

            if(typeof this.deathEffect()  === 'function') {
                this.deathEffect()
            }
            this.linked.kill()
            this.kill()

        } else {
            if(typeof this.damageEffect() === 'function') {
                this.damageEffect()
            }
        }
        
    } */

    faceTGT() {
        let toPlayer = this.pos.sub(this.TGT.pos)

        let tmp = toDegrees(Math.atan2(toPlayer.x, toPlayer.y))
        this.dir = addAngle(tmp, 180)
    }

}