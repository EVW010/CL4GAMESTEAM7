import { Actor, Vector, SpriteSheet, Sprite } from 'excalibur'
import { RenderObject } from './renderbase'
import { getQuadFacing, getOctFacing, addAngle} from '../functions'

export class ViewObject extends Actor {
    constructor(trackObj) {
        super()
        this.linked = trackObj
        this.test = 'THIS IS A TEST MESSAGE FOR THE RENDER -> VIEW'
        this.animTime = 0
        this.frameDuration = 100 // ms per frame
        this.totalFrames = 1
        this.pos = new Vector(300, 300)
        this.PLAYER = this.linked.PLAYER
        this.sheet = ''
    }

    onInitialize(engine) {
        console.log(this.linked.test)
    }

    onPreUpdate(engine) {
        this.animTime ++
        this.animate()
    }

    animate() {

        if(this.linked.sheet === this.sheet) {
            this.animTime = 0
            this.sheet = this.linked.sheet
        }
        
        this.totalFrames = this.linked.sheet.columns

        let frame = Math.floor(this.animTime / this.frameDuration) % this.totalFrames

        let playerDir = this.PLAYER.dir

        let rowdir = this.getRow(addAngle(playerDir, this.linked.dir))

        let sprite = this.linked.sheet.getSprite(frame, rowdir)

        this.graphics.use(this.linked.sheet.getSprite(frame, rowdir)
    )

    }

    getRow(dir) {
        switch(this.linked.sheet.rows) {
            case 8:
                return(getOctFacing(dir))
                break
            case 4:
                return(getQuadFacing(dir))
                break
            default:
                return(0)
                break
        }
    }
}