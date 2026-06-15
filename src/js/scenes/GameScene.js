import { Actor, Scene, Vector, Color } from 'excalibur'

export class GameScene extends Scene {
    onInitialize() {
        this.createPlaceholderLevel()
    }

    createPlaceholderLevel() {
        const sky = new Actor({
            pos: new Vector(640, 360),
            width: 1280,
            height: 720,
            color: new Color(18, 28, 35)
        })

        const ground = new Actor({
            pos: new Vector(640, 660),
            width: 1280,
            height: 140,
            color: new Color(35, 52, 34)
        })

        const worker = new Actor({
            pos: new Vector(240, 545),
            width: 55,
            height: 95,
            color: new Color(42, 125, 255)
        })

        const helmet = new Actor({
            pos: new Vector(240, 485),
            width: 65,
            height: 25,
            color: new Color(255, 198, 40)
        })

        this.add(sky)
        this.add(ground)
        this.add(worker)
        this.add(helmet)

        this.createMagicTree(700, 545)
        this.createMagicTree(900, 545)
        this.createMagicTree(1090, 545)
    }

    createMagicTree(x, y) {
        const trunk = new Actor({
            pos: new Vector(x, y),
            width: 55,
            height: 120,
            color: new Color(93, 55, 28)
        })

        const leaves = new Actor({
            pos: new Vector(x, y - 90),
            width: 135,
            height: 120,
            color: new Color(30, 135, 65)
        })

        const magicCore = new Actor({
            pos: new Vector(x, y - 90),
            width: 35,
            height: 35,
            color: new Color(180, 60, 255)
        })

        this.add(trunk)
        this.add(leaves)
        this.add(magicCore)
    }
}
