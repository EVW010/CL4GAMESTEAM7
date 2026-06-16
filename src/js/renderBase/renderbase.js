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
        this.pos = spawnerPos

        this.speed = 0

        this.linked = new ViewObject(this)

// this.linked.linked.linked.linked.linked.linked.myVariable is a completely valid object
// goofy ahh coding 

        console.log('flip flap flobedobledab')

        this.test = 'THIS IS A TEST MESSAGE FOR VIEW -> RENDER'

        this.on('collisionstart')

    }

    onInitialize(engine) {
        this.scene.add(this.linked)
        console.log(this.linked.test)
    }

    onPreUpdate() {
        this.vel = toXY(this.speed, this.dir)
    }
}