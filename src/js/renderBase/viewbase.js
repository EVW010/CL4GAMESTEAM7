import { Actor, Vector, SpriteSheet, Sprite, toRadians, toDegrees } from 'excalibur'
import { RenderObject } from './renderbase'
import { getQuadFacing, getOctFacing, addAngle} from '../functions'

export class ViewObject extends Actor {
    constructor(trackObj) {
        super()
        this.linked = trackObj
        this.animTime = 0
        this.frameDuration = 10 // ms per frame
        this.totalFrames = 1
        this.pos = new Vector(300, 300)
        this.PLAYER = this.linked.PLAYER
        this.sheet = ''
        this.FOV = Math.PI / 3 // SET TO CONFIG ONCE MERGED!! <!><!> IMPORTANT

        this.rowDir

        this.tebst
    }

    onInitialize(engine) {
    }

    onPreUpdate(engine) {
        this.animTime ++
        this.animate()
        this.project()
    }

    animate() {

        let toObj = this.linked.pos.sub(this.PLAYER.pos)

        if(this.linked.sheet !== this.sheet) {
            this.animTime = 0
            this.sheet = this.linked.sheet
        }

        // console.log(this.animTime)
        
        this.totalFrames = this.linked.sheet.columns

        let frame = Math.floor(this.animTime / this.frameDuration) % this.totalFrames

        let playerDir = this.PLAYER.rotation
        
        this.rowDir = this.getRow(addAngle(toDegrees(Math.atan2(toObj.y, toObj.x)), this.linked.dir))

        let sprite = this.linked.sheet.getSprite(frame, this.rowDir)

        this.graphics.use(this.linked.sheet.getSprite(frame, this.rowDir))
        

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

        let relative = this.normalizeAngle(angleToObj - this.PLAYER.rotation)

        this.pos.x = (relative / this.FOV + 0.5) * 1280

        let dist = toObj.magnitude
        let scalar = 1 / (dist) // prevent division by 0 in rare cases
        let sprite = this.linked.sheet.getSprite(0, 0)
        scalar = scalar / ( sprite.height / 64) // Scale sprite based on size so that the bottom aways aligns with the ground.
        scalar = scalar * 16.5
        this.scale.x = scalar
        this.scale.y = scalar
        this.transform.z = scalar

        this.pos.y = ((364) - (this.linked.vertical * 100.6 / (dist))) - 14.5

        const RAYS = 200
        const zBuffer = this.PLAYER.game?.currentScene?.zBuffer
        if (zBuffer) {
            const col = Math.max(0, Math.min(RAYS - 1, Math.floor((this.pos.x / 1280) * RAYS)))
            this.graphics.visible = dist <= zBuffer[col]
        }
    }

    normalizeAngle(dir) {
        let  temp = toRadians(dir)
        return(Math.atan2(Math.sin(dir), Math.cos(dir)))
    }
}