import { Scene, Canvas, Actor, CollisionType } from 'excalibur'
import wallTextureUrl from './assets/textures/oficewalltexture.png'
import glassTextureUrl from './assets/textures/officeglas.jpg'
import floorTextureUrl from './assets/textures/floortexture.png'
import ceilingTextureUrl from './assets/textures/officeceiling.png'
import { UI } from '../../ui.js'

// . = vloer, # = kantoor muur, G = glaswand, D = uitgang
export const MAP_LEVEL2 = [
    '####################',
    '#........#.........#',
    '#..GGG...#..GGG....#',
    '#........#.........#',
    '#..####..#..####...#',
    '#..................D',
    '#..####..#..####...#',
    '#........#.........#',
    '#..GGG......GGG....#',
    '#..................#',
    '####################',
]

export const isLevel2WallTile = (char) => char === '#' || char === 'G' || char === 'D'

const SCREEN_W = 1280
const SCREEN_H = 720
const RAYS = 200
const FOV = Math.PI / 3

export class MapLevel2 extends Scene {

    constructor(player) {
        super()
        this.player = player
    }

    onInitialize(engine) {
        this.add(this.player)

        for (let y = 0; y < MAP_LEVEL2.length; y++) {
            for (let x = 0; x < MAP_LEVEL2[y].length; x++) {
                if (isLevel2WallTile(MAP_LEVEL2[y][x])) {
                    const wall = new Actor({
                        collisionType: CollisionType.Fixed,
                    })

                    this.add(wall)
                }
            }
        }

        this.wallImg = this.loadImage(wallTextureUrl)
        this.glassImg = this.loadImage(glassTextureUrl)
        this.floorImg = this.loadImage(floorTextureUrl)
        this.ceilingImg = this.loadImage(ceilingTextureUrl)

        const raycastActor = new Actor({
            x: SCREEN_W / 2,
            y: SCREEN_H / 2
        })

        const canvasGraphic = new Canvas({
            width: SCREEN_W,
            height: SCREEN_H,
            cache: false,
            draw: (ctx) => this.drawScene(ctx),
        })

        raycastActor.graphics.use(canvasGraphic)
        this.add(raycastActor)

        this.add(new UI(this.player))
    }

    onActivate() {
        this.player.setCollisionMap(MAP_LEVEL2, isLevel2WallTile)
    }

    onPreUpdate(engine) {
        if (this.isPlayerNearTile('D')) {
            engine.goToScene('winScreen')
        }
    }

    loadImage(src) {
        const img = new Image()
        img.src = src
        img.isLoaded = false
        img.onload = () => {
            img.isLoaded = true
        }
        return img
    }

    isPlayerNearTile(tileType) {
        for (let y = 0; y < MAP_LEVEL2.length; y++) {
            for (let x = 0; x < MAP_LEVEL2[y].length; x++) {
                if (MAP_LEVEL2[y][x] !== tileType) continue

                const dx = this.player.pos.x - (x + 0.5)
                const dy = this.player.pos.y - (y + 0.5)
                const distance = Math.sqrt(dx * dx + dy * dy)

                if (distance < 1.1) {
                    return true
                }
            }
        }

        return false
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

        let stepX
        let stepY
        let sideDistX
        let sideDistY

        if (dx < 0) {
            stepX = -1
            sideDistX = (px - mapX) * deltaDistX
        } else {
            stepX = 1
            sideDistX = (mapX + 1 - px) * deltaDistX
        }

        if (dy < 0) {
            stepY = -1
            sideDistY = (py - mapY) * deltaDistY
        } else {
            stepY = 1
            sideDistY = (mapY + 1 - py) * deltaDistY
        }

        let side = 0

        for (let i = 0; i < 100; i++) {
            if (sideDistX < sideDistY) {
                sideDistX += deltaDistX
                mapX += stepX
                side = 0
            } else {
                sideDistY += deltaDistY
                mapY += stepY
                side = 1
            }

            if (isLevel2WallTile(MAP_LEVEL2[mapY]?.[mapX])) {
                break
            }
        }

        let perpDist
        let texX

        if (side === 0) {
            perpDist = sideDistX - deltaDistX
            texX = ((py + perpDist * dy) % 1 + 1) % 1
        } else {
            perpDist = sideDistY - deltaDistY
            texX = ((px + perpDist * dx) % 1 + 1) % 1
        }

        const tileType = MAP_LEVEL2[mapY]?.[mapX] ?? '#'

        return {
            distance: perpDist,
            wallHeight: 1000 / perpDist,
            texX,
            tileType
        }
    }

    drawWallSlice(ctx, col, distance, wallHeight, sliceWidth, texX, tileType) {
        const top = Math.floor(SCREEN_H / 2 - wallHeight / 2)

        const img = tileType === 'G' ? this.glassImg : this.wallImg

        if (!img.isLoaded) {
            const c = Math.floor(190 / (1 + distance / 4))
            ctx.fillStyle = tileType === 'G' ? `rgb(40, ${c}, ${c})` : `rgb(${c}, ${c}, ${c})`
            ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, wallHeight)
            return
        }

        const srcX = Math.floor(texX * img.width)

        ctx.drawImage(
            img,
            srcX,
            0,
            1,
            img.height,
            col * sliceWidth,
            top,
            sliceWidth + 1,
            wallHeight
        )

        const alpha = Math.min(0.82, distance / 8)

        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, wallHeight)
    }

    drawTexturedBackground(ctx) {
        if (this.ceilingImg.isLoaded) {
            const ceilingPattern = ctx.createPattern(this.ceilingImg, 'repeat')
            ctx.fillStyle = ceilingPattern
            ctx.fillRect(0, 0, SCREEN_W, SCREEN_H / 2)
        } else {
            ctx.fillStyle = 'rgb(160, 160, 160)'
            ctx.fillRect(0, 0, SCREEN_W, SCREEN_H / 2)
        }

        if (this.floorImg.isLoaded) {
            const floorPattern = ctx.createPattern(this.floorImg, 'repeat')
            ctx.fillStyle = floorPattern
            ctx.fillRect(0, SCREEN_H / 2, SCREEN_W, SCREEN_H / 2)
        } else {
            ctx.fillStyle = 'rgb(90, 90, 90)'
            ctx.fillRect(0, SCREEN_H / 2, SCREEN_W, SCREEN_H / 2)
        }
    }

    drawScene(ctx) {
        const sliceWidth = SCREEN_W / RAYS
        const angleStep = FOV / RAYS

        this.drawTexturedBackground(ctx)

        for (let i = 0; i < RAYS; i++) {
            const rayAngle = this.player.rotation - FOV / 2 + i * angleStep
            const { distance, wallHeight, texX, tileType } = this.castRay(rayAngle)

            this.drawWallSlice(
                ctx,
                i,
                distance,
                wallHeight,
                sliceWidth,
                texX,
                tileType
            )
        }

        this.drawMiniMap(ctx)
    }

    drawMiniMap(ctx) {
        const miniMapScaleX = 6
        const miniMapScaleY = 6

        const offsetX = SCREEN_W - MAP_LEVEL2[0].length * miniMapScaleX - 10
        const offsetY = 10

        for (let y = 0; y < MAP_LEVEL2.length; y++) {
            for (let x = 0; x < MAP_LEVEL2[y].length; x++) {
                const tile = MAP_LEVEL2[y][x]

                if (tile === 'G') {
                    ctx.fillStyle = 'rgb(0, 180, 220)'
                } else if (tile === '#') {
                    ctx.fillStyle = 'rgb(140, 140, 140)'
                } else if (tile === 'D') {
                    ctx.fillStyle = 'rgb(255, 220, 0)'
                } else {
                    ctx.fillStyle = 'rgb(25, 25, 25)'
                }

                ctx.fillRect(
                    x * miniMapScaleX + offsetX,
                    y * miniMapScaleY + offsetY,
                    miniMapScaleX,
                    miniMapScaleY
                )
            }
        }

        ctx.fillStyle = 'red'
        ctx.fillRect(
            this.player.pos.x * miniMapScaleX + offsetX - 2,
            this.player.pos.y * miniMapScaleY + offsetY - 2,
            4,
            4
        )
    }
}
