import { EnemyBase } from "./EnemyBase";
import { Vector, toRadians } from "excalibur";
import { Sheets } from "../resources";

export class Bush extends EnemyBase {
    constructor(spawnerPos, dir, player) {
        super(spawnerPos, dir, player, 0.2, 10)

        this.attackTimer = 0

    }

    onPreUpdate() {
        switch(this.state) {
            case 1:
                this.state1()
                break
            case 2:
                this.state2()
                break
            case 3:
                this.state3()
                break
        }
    }


    state1() {
        let distvect = this.pos.sub(this.PLAYER.pos)
        let dist = (distvect.x * distvect.x) + (distvect.y * distvect.y)
        if(dist < 9) {
            this.state = 2
            console.log('AWOKEN')
            this.sheet = Sheets.Shrub
        }
    }
/*  */
    state2() {

        if(this.checkLOS()) {

            this.TGT.y = this.PLAYER.y
            this.TGT.x = this.PLAYER.x
            this.faceTGT()

        }

        
        this.vel.x = Math.sin(toRadians(this.dir))
        this.vel.y = Math.cos(toRadians(this.dir))
        let distvect = this.pos.sub(this.PLAYER.pos)
        let dist = (distvect.x * distvect.x) + (distvect.y * distvect.y)
        this.dir += 90
        if(dist < 2) {
            this.state = 3
            this.attackTimer = 0
            this.sheet = Sheets.ShrubAttack
        }

    }

    state3() {
        // first frame entering attack
        if (this.attackTimer === 0) {
            this.sheet = Sheets.ShrubAttack
            this.didDamage = false

            this.vel.x = 0
            this.vel.y = 0
        }
        
        console.log(this.attackTimer)

        this.attackTimer++


        let distvect = this.pos.sub(this.PLAYER.pos)
        let dist = distvect.x * distvect.x + distvect.y * distvect.y

        // apply damage once during attack
        if (this.attackTimer === 90 && !this.didDamage) {
            if (dist < 3) {
                this.PLAYER.hp -= 10
            }
            this.didDamage = true
        }

        // exit attack after duration
        if (this.attackTimer >= 180) {
            this.sheet = Sheets.Shrub
            this.state = 2
    }
}

}