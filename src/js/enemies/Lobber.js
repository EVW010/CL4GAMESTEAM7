import { EnemyBase } from "./EnemyBase";
import { Vector, toRadians } from "excalibur";
import { Sheets } from "../resources";
import { LobberProj } from "./EnemyProj/LobberProj";
import { addAngle } from "../functions";

export class Lobber extends EnemyBase {
    constructor(spawnerPos, dir, player) {
        super(spawnerPos, dir, player, 0.3, 15)

        this.attackTimer = 0
        this.searchTimer = 0

        this.sheet = Sheets.Lobber

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
            case 4:
                this.state4()
                break
        }
    }


    state1() { // SLEEP
        let distvect = this.pos.sub(this.PLAYER.pos)
        let dist = (distvect.x * distvect.x) + (distvect.y * distvect.y)
        if(dist < 9) {
            this.state = 2
            console.log('AWOKEN')
            this.sheet = Sheets.LobberWalk
            this.searchTimer = 0
        }
    }
/*  */
    state2() { // SEARCH

        if (this.searchTimer === 0) {
            this.TGT.y = this.PLAYER.pos.y
            this.TGT.x = this.PLAYER.pos.x
            this.RandomPoint(this.TGT, 2.5, 3.5)
            this.faceTGT()
        }
        this.searchTimer++
        this.faceTGT()
        this.dir += 90
        this.vel.x = Math.sin(toRadians(this.dir - 90))
        this.vel.y = Math.cos(toRadians(this.dir - 90))
        let distvect = this.pos.sub(this.TGT)
        let dist = (distvect.x * distvect.x) + (distvect.y * distvect.y)
        if(dist < 0.2 || this.searchTimer > 300) {
            this.TGT.y = this.PLAYER.pos.y
            this.TGT.x = this.PLAYER.pos.x
            this.faceTGT()
            this.searchTimer = 0
            console.log('CHECKING LOSs')
            if(this.checkLOS(0.5)) {
                console.log('DESTROY')
                this.attackTimer = 0
                this.state = 3
                this.vel.x = 0
                this.vel.y = 0

            }
        }

    }

    state3() { // DESTROY
        // first frame entering attack
        if (this.attackTimer === 0) {
            this.sheet = Sheets.Lobber
            this.didDamage = false

            this.vel.x = 0
            this.vel.y = 0
        }
        
        if(this.checkLOS(0.5)) {
            this.TGT.x = this.PLAYER.pos.x
            this.TGT.y = this.PLAYER.pos.y
            this.faceTGT()
            this.dir = addAngle(this.dir, 90)
        }
        this.attackTimer++


        let distvect = this.pos.sub(this.PLAYER.pos)
        let dist = distvect.x * distvect.x + distvect.y * distvect.y
        
        let bulletDir = this.faceTGTproper()

        // apply damage once during attack
        if (this.attackTimer === 90) {
            let bullet = new LobberProj(this.pos, bulletDir, this.PLAYER)
            this.scene.add(bullet)
        }

        if (this.attackTimer >= 180) {
            this.sheet = Sheets.LobberWalk
            this.state = 2
            this.searchTimer = 0
    }
}

}