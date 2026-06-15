import { Scene, Canvas, Actor } from 'excalibur'
import wallTextureUrl from './assets/walls/wall1.png'

// . = floor, # = wall
const MAP = [
    '####################',
    '#..................#',
    '#.##..#.###.#.#.##.#',
    '#.#.........#..#.#.#',
    '#.#.####..#.####.#.#',
    '#..................#',
    '#.#.####.#.#.####..#',
    '#.#.........#.#..#.#',
    '#.##..#.###.#.#.##.#',
    '#..................#',
    '####################',
]

const SCREEN_W = 1280
const SCREEN_H = 720
const RAYS = 200
const FOV = Math.PI / 3

const player = {
    x: 1.5,
    y: 1.5,
    angle: 0,
}

export class MapLevel1 extends Scene {
    onInitialize(engine) {
        this.wallImg = new Image()
        this.wallImg.src = wallTextureUrl
        this.wallImgLoaded = false
        this.wallImg.onload = () => { this.wallImgLoaded = true }

        const raycastActor = new Actor({ x: SCREEN_W / 2, y: SCREEN_H / 2 })

        const canvasGraphic = new Canvas({
            width: SCREEN_W,
            height: SCREEN_H,
            cache: false,
            draw: (ctx) => this.drawScene(ctx),
        })

        raycastActor.graphics.use(canvasGraphic)
        this.add(raycastActor)
    }

    castRay(angle) {
        let x = player.x
        let y = player.y
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)

        let i = 0
        while (MAP[Math.floor(y)]?.[Math.floor(x)] !== '#') {
            x += dx * 0.05
            y += dy * 0.05
            if (++i > 800) break
        }

        const distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2)
        // pick the axis-aligned wall face to get a stable texture coordinate
        const raw = Math.abs(dx) > Math.abs(dy) ? y : x
        const texX = ((raw % 1) + 1) % 1
        return { distance, wallHeight: 300 / distance, texX }
    }

    drawWallSlice(ctx, col, distance, wallHeight, sliceWidth, texX) {
        const top = Math.floor(SCREEN_H / 2 - wallHeight / 2)

        if (!this.wallImgLoaded) {
            const c = Math.floor(180 / (1 + distance / 4))
            ctx.fillStyle = `rgb(${c},0,0)`
            ctx.fillRect(col * sliceWidth, top, sliceWidth, wallHeight)
            return
        }

        const srcX = Math.floor(texX * this.wallImg.width)
        ctx.drawImage(
            this.wallImg,
            srcX, 0, 1, this.wallImg.height,
            col * sliceWidth, top, sliceWidth, wallHeight
        )

        // darken slices that are farther away
        const alpha = Math.min(0.85, distance / 8)
        ctx.fillStyle = `rgba(0,0,0,${alpha})`
        ctx.fillRect(col * sliceWidth, top, sliceWidth, wallHeight)
    }

    drawScene(ctx) {
        const sliceWidth = SCREEN_W / RAYS
        const angleStep = FOV / RAYS

        ctx.fillStyle = 'rgb(0, 204, 255)'
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H / 2)

        ctx.fillStyle = 'rgb(0, 152, 28)'
        ctx.fillRect(0, SCREEN_H / 2, SCREEN_W, SCREEN_H / 2)

        for (let i = 0; i < RAYS; i++) {
            const rayAngle = player.angle - FOV / 2 + i * angleStep
            const { distance, wallHeight, texX } = this.castRay(rayAngle)
            this.drawWallSlice(ctx, i, distance, wallHeight, sliceWidth, texX)
        }

        this.drawMiniMap(ctx)
    }

    drawMiniMap(ctx) {
        const miniMapScaleX = 8
        const miniMapScaleY = 8
        const offsetX = SCREEN_W - MAP[0].length * miniMapScaleX - 10
        const offsetY = 10
        const xStart = 0
        const xEnd = MAP[0].length
        const yStart = 0
        const yEnd = MAP.length

        for (let y = yStart; y < yEnd; y++) {
            for (let x = xStart; x < xEnd; x++) {
                const wall = MAP[y][x] === '#'
                ctx.fillStyle = wall ? 'rgb(150, 0, 150)' : 'rgb(0, 0, 0)'
                ctx.fillRect((x - xStart) * miniMapScaleX + offsetX, (y - yStart) * miniMapScaleY + offsetY, miniMapScaleX, miniMapScaleY)
            }
        }
    }
}
