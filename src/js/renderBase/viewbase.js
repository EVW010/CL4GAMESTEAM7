import { Actor, Vector, SpriteSheet, Sprite, toRadians } from 'excalibur'
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
        this.FOV = Math.PI / 3 // SET TO CONFIG ONCE MERGED!! <!><!> IMPORTANT
    }

    onInitialize(engine) {
        console.log(this.linked.test)
    }

    onPreUpdate(engine) {
        this.animTime ++
        this.animate()
        this.project()
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

    project() {
        let toObj = this.linked.pos.sub(this.PLAYER.pos)
        let angleToObj = Math.atan2(toObj.y, toObj.x)

        let relative = this.normalizeAngle(angleToObj - this.PLAYER.dir)

        this.pos.x = (relative / this.FOV + 0.5) * 1280
        
        let dist = toObj.magnitude
        let scalar = 1 / (dist + 0.0001)
        this.scale.x = scalar
        this.scale.y = scalar

        this.pos.y = (720 / 2) - (this.linked.vertical / (dist + 0.0001))

        console.log(this.pos)
    }

    normalizeAngle(dir) {
       let  temp = toRadians(dir)
        return(Math.atan2(Math.sin(temp), Math.cos(temp)))
    }
}