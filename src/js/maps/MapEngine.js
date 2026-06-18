import { Scene, Canvas, Actor } from 'excalibur'

const SCREEN_W = 1280
const SCREEN_H = 720
const RAYS = 200
const FOV = Math.PI / 3

export class MapEngine extends Scene {
    constructor(player) {
        super()
        this.player = player
        this.map = []
    }

    isWallTile(char) {
        return false
    }

    getTexture(tileType) {
        return { img: null, loaded: false }
    }

    getMiniMapColor(tile) {
        return 'rgb(100, 100, 100)'
    }

    onMapSetup(engine) {}

    onInitialize(engine) {
        this.add(this.player)
        this.onMapSetup(engine)

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

            if (this.isWallTile(this.map[mapY]?.[mapX])) {
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

        const tileType = this.map[mapY]?.[mapX] ?? '#'

        return {
            distance: perpDist,
            wallHeight: 1000 / perpDist,
            texX,
            tileType
        }
    }

    drawWallSlice(ctx, col, distance, wallHeight, sliceWidth, texX, tileType) {
        const top = Math.floor(SCREEN_H / 2 - wallHeight / 2)
        const { img, loaded } = this.getTexture(tileType)

        if (!loaded) {
            const c = Math.floor(180 / (1 + distance / 4))
            ctx.fillStyle = `rgb(${c}, 0, 0)`
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

        const alpha = Math.min(0.85, distance / 8)
        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
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
            const { distance, wallHeight, texX, tileType } = this.castRay(rayAngle)

            this.drawWallSlice(ctx, i, distance, wallHeight, sliceWidth, texX, tileType)
        }

        this.drawMiniMap(ctx)
    }

    drawMiniMap(ctx) {
        const miniMapScaleX = 6
        const miniMapScaleY = 6

        const offsetX = SCREEN_W - this.map[0].length * miniMapScaleX - 10
        const offsetY = 10

        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                ctx.fillStyle = this.getMiniMapColor(this.map[y][x])
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
