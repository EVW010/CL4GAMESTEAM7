import { Actor, Vector, Engine } from 'excalibur'
import { ViewObject } from './viewbase.js'
import { toXY, } from '../functions.js'
import { Sheets } from '../resources.js'

export class RenderObject extends Actor {
    constructor(spawnerPos, dir, player) {
        super()

        this.PLAYER = player

        this.vertical = 0

        this.sheet = Sheets.None

        this.dir = dir
        this.pos.x = spawnerPos.x
        this.pos.y = spawnerPos.y

        this.speed = 0

        this.linked = new ViewObject(this)

// this.linked.linked.linked.linked.linked.linked.myVariable is a completely valid object
// goofy ahh coding 

        this.on('collisionstart')

    }

    onInitialize(engine) {
        this.scene.add(this.linked)
    }

    onPreUpdate() {
        this.vel = toXY(this.speed, this.dir)
    }
}