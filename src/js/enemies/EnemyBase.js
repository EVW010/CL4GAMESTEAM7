import { RenderObject } from "../renderBase/renderbase";
import { Vector, toDegrees, toRadians } from "excalibur";
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

        this.TGT = new Vector(spawnerPos.x, spawnerPos.y)

        this.vel = new Vector(0, 0)

        this.state = 1

    }

    takeDamage(amount) {
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
        
    }

    faceTGT() {
        let toPlayer = this.pos.sub(this.TGT)
        let tmp = toDegrees(Math.atan2(toPlayer.x, toPlayer.y))
        this.dir = addAngle(tmp, 180)
    }

    checkLOS() {
        let toPlayer = this.PLAYER.pos.sub(this.pos)
        const angleToPlayer = Math.atan2(toPlayer.y, toPlayer.x)

        function normalizeAngle(a) {
            return Math.atan2(Math.sin(a), Math.cos(a))
        }

        const enemyFacing = normalizeAngle(toRadians(this.dir))
        const diff = normalizeAngle(angleToPlayer - enemyFacing)

        const FOV = Math.PI / 1.5

        if (Math.abs(diff) < FOV / 1.5) {
            const px = this.PLAYER.pos.x
            const py = this.PLAYER.pos.y

            const ex = this.pos.x
            const ey = this.pos.y

            const dx = ex - px
            const dy = ey - py

            const distToEnemy = Math.hypot(dx, dy)

            const angle = Math.atan2(dy, dx)

            const wallDist = this.scene.castRay(angle)

            return wallDist.distance >= distToEnemy
        } else {
            return false
        }

        
    }
          

}