import { Scene, Canvas, Actor, CollisionType } from 'excalibur'
import wallTextureUrl from './assets/walls/wall1.png'
import { Player } from '../../player.js'

// . = floor, # = wall
export const MAP = [
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

export class MapLevel1 extends Scene {

    player;

    onInitialize(engine) {

        this.player = new Player();
        this.add(this.player);

        for (let y = 0; y < MAP.length; y++) {
            for (let x = 0; x < MAP[y].length; x++) {
                if (MAP[y][x] === '#') {
                    const wall = new Actor({
                        x: x + 0.5,
                        y: y + 0.2,
                        width: 1,
                        height: 1,
                        collisionType: CollisionType.Fixed,
                    })
                    this.add(wall)
                }
            }
        }

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
        const px = this.player.pos.x
        const py = this.player.pos.y
        const dx = Math.cos(angle)
        const dy = Math.sin(angle)

        let mapX = Math.floor(px)
        let mapY = Math.floor(py)

        const deltaDistX = Math.abs(dx) < 1e-10 ? 1e10 : Math.abs(1 / dx)
        const deltaDistY = Math.abs(dy) < 1e-10 ? 1e10 : Math.abs(1 / dy)

        let stepX, stepY, sideDistX, sideDistY
        if (dx < 0) { stepX = -1; sideDistX = (px - mapX) * deltaDistX }
        else         { stepX =  1; sideDistX = (mapX + 1 - px) * deltaDistX }
        if (dy < 0) { stepY = -1; sideDistY = (py - mapY) * deltaDistY }
        else         { stepY =  1; sideDistY = (mapY + 1 - py) * deltaDistY }

        let side = 0
        for (let i = 0; i < 100; i++) {
            if (sideDistX < sideDistY) { sideDistX += deltaDistX; mapX += stepX; side = 0 }
            else                        { sideDistY += deltaDistY; mapY += stepY; side = 1 }
            if (MAP[mapY]?.[mapX] === '#') break
        }

        let perpDist, texX
        if (side === 0) {
            perpDist = sideDistX - deltaDistX
            texX = ((py + perpDist * dy) % 1 + 1) % 1
        } else {
            perpDist = sideDistY - deltaDistY
            texX = ((px + perpDist * dx) % 1 + 1) % 1
        }

        return { distance: perpDist, wallHeight: 300 / perpDist, texX }
    }

    drawWallSlice(ctx, col, distance, wallHeight, sliceWidth, texX) {
        const top = Math.floor(SCREEN_H / 2 - wallHeight / 2)

        if (!this.wallImgLoaded) {
            const c = Math.floor(180 / (1 + distance / 4))
            ctx.fillStyle = `rgb(${c},0,0)`
            ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, wallHeight)
            return
        }

        const srcX = Math.floor(texX * this.wallImg.width)
        ctx.drawImage(
            this.wallImg,
            srcX, 0, 1, this.wallImg.height,
            col * sliceWidth, top, sliceWidth + 1, wallHeight
        )

        const alpha = Math.min(0.85, distance / 8)
        ctx.fillStyle = `rgba(0,0,0,${alpha})`
        ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, wallHeight)
    }

    drawScene(ctx) {
        const sliceWidth = SCREEN_W / RAYS
        const angleStep = FOV / RAYS

        ctx.fillStyle = 'rgb(0, 204, 255)'
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H / 2)

        ctx.fillStyle = 'rgb(0, 152, 28)'
        ctx.fillRect(0, SCREEN_H / 2, SCREEN_W, SCREEN_H / 2)

        for (let i = 0; i < RAYS; i++) {
            const rayAngle = this.player.rotation - FOV / 2 + i * angleStep
            const { distance, wallHeight, texX } = this.castRay(rayAngle)
            this.drawWallSlice(ctx, i, distance, wallHeight, sliceWidth, texX)
        }

        this.drawMiniMap(ctx)
    }

    drawMiniMap(ctx) {
        const miniMapScaleX = 6
        const miniMapScaleY = 6
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
