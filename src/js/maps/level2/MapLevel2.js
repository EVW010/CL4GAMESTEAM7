import { Scene, Canvas, Actor, Vector } from 'excalibur'
import officeWallTextureUrl from './assets/textures/office-wall-upload.png'
import officeFloorTextureUrl from './assets/textures/office-floor-upload.png'
import officeDoorTextureUrl from './assets/textures/office-exit-door.png'
import officeGlassTextureUrl from './assets/textures/office-glass.jpg'
import { UI } from '../../ui.js'

// Office prologue map
// . = vloer
// # = buitenmuur / kantoor muur
// P = kantoorwand
// G = glaswand
// D = exit deur naar het bos-level
export const MAP_LEVEL2 = [
    '########################',
    '#..........G...........#',
    '#..PPPP....G....PPPP...#',
    '#..P..P.........P..P...#',
    '#..P..P..GGGGG..P..P...#',
    '#......................D',
    '#..P..P..GGGGG..P..P...#',
    '#..P..P.........P..P...#',
    '#..PPPP....G....PPPP...#',
    '#..........G...........#',
    '########################',
]

export const isLevel2WallTile = (char) => {
    return char === '#' || char === 'P' || char === 'G' || char === 'D'
}

const SCREEN_W = 1280
const SCREEN_H = 720
const RAYS = 260
const FOV = Math.PI / 3

const OFFICE_START_POS = new Vector(2.5, 5.5)
const OFFICE_START_ROTATION = 0

export class MapLevel2 extends Scene {
    constructor(player) {
        super()
        this.player = player
        this.depthBuffer = []
        this.prologueStartTime = 0
        this.hasExitedOffice = false
    }

    onInitialize() {
        this.add(this.player)

        this.wallImg = this.loadImage(officeWallTextureUrl)
        this.floorImg = this.loadImage(officeFloorTextureUrl)
        this.doorImg = this.loadImage(officeDoorTextureUrl)
        this.glassImg = this.loadImage(officeGlassTextureUrl)

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
        this.hasExitedOffice = false
        this.prologueStartTime = performance.now()

        this.player.setCollisionMap(MAP_LEVEL2, isLevel2WallTile)
        this.player.pos = OFFICE_START_POS.clone()
        this.player.rotation = OFFICE_START_ROTATION
    }

    onPreUpdate(engine) {
        if (this.hasExitedOffice) return

        if (this.isPlayerNearTile('D')) {
            this.hasExitedOffice = true

            // Office is de prologue.
            // De EXIT deur stuurt de speler naar het bos level.
            this.player.resetPlayer()
            engine.goToScene('level2')
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

                if (distance < 1.15) {
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

        perpDist = Math.max(perpDist, 0.0001)

        return {
            distance: perpDist,
            wallHeight: Math.min(2400, 1000 / perpDist),
            texX,
            tileType: MAP_LEVEL2[mapY]?.[mapX] ?? '#',
            mapX,
            mapY,
            side
        }
    }

    getWallImage(tileType) {
        if (tileType === 'D') return this.doorImg
        if (tileType === 'G') return this.glassImg

        return this.wallImg
    }

    getTextureOffset(tileType, mapX, mapY) {
        if (tileType === 'D') return 0
        if (tileType === 'G') return 0

        return ((mapX * 11 + mapY * 5) % 64) / 64
    }

    getFallbackColor(tileType, distance) {
        const shade = Math.floor(210 / (1 + distance / 4))

        if (tileType === 'D') return `rgb(${shade}, ${Math.floor(shade * 0.62)}, 28)`
        if (tileType === 'G') return `rgb(30, ${Math.floor(shade * 0.9)}, ${shade})`
        if (tileType === 'P') return `rgb(${Math.floor(shade * 0.75)}, ${Math.floor(shade * 0.78)}, ${shade})`

        return `rgb(${shade}, ${shade}, ${shade})`
    }

    drawWallTexture(ctx, img, col, top, wallHeight, sliceWidth, ray) {
        const offset = this.getTextureOffset(ray.tileType, ray.mapX, ray.mapY)
        const sourceX = Math.floor((((ray.texX + offset) % 1) + 1) % 1 * img.width)

        ctx.drawImage(
            img,
            sourceX,
            0,
            1,
            img.height,
            col * sliceWidth,
            top,
            sliceWidth + 1,
            wallHeight
        )
    }

    drawWallSlice(ctx, col, ray, sliceWidth) {
        const top = Math.floor(SCREEN_H / 2 - ray.wallHeight / 2)
        const img = this.getWallImage(ray.tileType)

        if (!img.isLoaded) {
            ctx.fillStyle = this.getFallbackColor(ray.tileType, ray.distance)
            ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, ray.wallHeight)
            return
        }

        this.drawWallTexture(ctx, img, col, top, ray.wallHeight, sliceWidth, ray)

        if (ray.tileType === 'P') {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.22)'
            ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, ray.wallHeight)
        }

        if (ray.tileType === 'G') {
            ctx.fillStyle = 'rgba(120, 220, 255, 0.10)'
            ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, ray.wallHeight)
        }

        if (ray.tileType === 'D') {
            ctx.fillStyle = 'rgba(40, 255, 90, 0.08)'
            ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, ray.wallHeight)
        }

        const sideShadow = ray.side === 1 ? 0.14 : 0
        const distanceShadow = Math.min(0.72, ray.distance / 9)
        const alpha = Math.min(0.84, distanceShadow + sideShadow)

        ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
        ctx.fillRect(col * sliceWidth, top, sliceWidth + 1, ray.wallHeight)
    }

    drawRepeatedImage(ctx, img, x, y, width, height, tileSize) {
        if (!img.isLoaded) return false

        ctx.save()
        ctx.beginPath()
        ctx.rect(x, y, width, height)
        ctx.clip()

        for (let tileY = y; tileY < y + height; tileY += tileSize) {
            for (let tileX = x; tileX < x + width; tileX += tileSize) {
                ctx.drawImage(img, tileX, tileY, tileSize, tileSize)
            }
        }

        ctx.restore()
        return true
    }

    drawTexturedBackground(ctx) {
        ctx.imageSmoothingEnabled = false

        // Plafond - lichter kantoor plafond
        ctx.fillStyle = 'rgb(82, 90, 100)'
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H / 2)

        ctx.globalAlpha = 0.20
        this.drawRepeatedImage(ctx, this.floorImg, 0, 0, SCREEN_W, SCREEN_H / 2, 180)
        ctx.globalAlpha = 1

        // Plafond lijnen
        for (let x = 0; x < SCREEN_W; x += 160) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'
            ctx.fillRect(x, 0, 4, SCREEN_H / 2)
        }

        for (let y = 0; y < SCREEN_H / 2; y += 90) {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.10)'
            ctx.fillRect(0, y, SCREEN_W, 4)
        }

        // Vloer
        if (!this.drawRepeatedImage(ctx, this.floorImg, 0, SCREEN_H / 2, SCREEN_W, SCREEN_H / 2, 260)) {
            ctx.fillStyle = 'rgb(57, 65, 74)'
            ctx.fillRect(0, SCREEN_H / 2, SCREEN_W, SCREEN_H / 2)
        }

        // Lichte plafond schaduw
        const ceilingGradient = ctx.createLinearGradient(0, 0, 0, SCREEN_H / 2)
        ceilingGradient.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
        ceilingGradient.addColorStop(1, 'rgba(0, 0, 0, 0.18)')
        ctx.fillStyle = ceilingGradient
        ctx.fillRect(0, 0, SCREEN_W, SCREEN_H / 2)

        // Vloer schaduw
        const floorGradient = ctx.createLinearGradient(0, SCREEN_H / 2, 0, SCREEN_H)
        floorGradient.addColorStop(0, 'rgba(255, 255, 255, 0.08)')
        floorGradient.addColorStop(1, 'rgba(0, 0, 0, 0.58)')
        ctx.fillStyle = floorGradient
        ctx.fillRect(0, SCREEN_H / 2, SCREEN_W, SCREEN_H / 2)
    }

    drawScene(ctx) {
        const sliceWidth = SCREEN_W / RAYS
        const angleStep = FOV / RAYS

        this.drawTexturedBackground(ctx)
        this.depthBuffer = []

        for (let i = 0; i < RAYS; i++) {
            const rayAngle = this.player.rotation - FOV / 2 + i * angleStep
            const ray = this.castRay(rayAngle)

            this.depthBuffer[i] = ray.distance
            this.drawWallSlice(ctx, i, ray, sliceWidth)
        }

        this.drawMiniMap(ctx)
        this.drawMissionText(ctx)
    }

    drawMissionText(ctx) {
        const elapsed = performance.now() - this.prologueStartTime

        ctx.save()
        ctx.imageSmoothingEnabled = false
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = '20px "Press Start 2P", monospace'

        if (elapsed < 6500) {
            const boxX = 190
            const boxY = 460
            const boxW = 900
            const boxH = 145

            ctx.fillStyle = 'rgba(0, 0, 0, 0.78)'
            ctx.fillRect(boxX, boxY, boxW, boxH)

            ctx.strokeStyle = 'rgba(125, 255, 155, 0.9)'
            ctx.lineWidth = 4
            ctx.strokeRect(boxX, boxY, boxW, boxH)

            ctx.fillStyle = '#7dff9b'
            ctx.fillText('PROLOOG: KANTOOR', SCREEN_W / 2, boxY + 32)

            ctx.font = '15px "Press Start 2P", monospace'
            ctx.fillStyle = 'white'
            ctx.fillText('Je wordt wakker in een verlaten kantoor.', SCREEN_W / 2, boxY + 70)
            ctx.fillText('Vind de EXIT deur om naar buiten te komen.', SCREEN_W / 2, boxY + 103)
        }

        ctx.textAlign = 'left'
        ctx.font = '14px "Press Start 2P", monospace'
        ctx.fillStyle = 'rgba(0, 0, 0, 0.62)'
        ctx.fillRect(28, SCREEN_H - 68, 560, 42)
        ctx.fillStyle = '#7dff9b'
        ctx.fillText('DOEL: zoek de groene EXIT deur', 48, SCREEN_H - 43)

        ctx.restore()
    }

    drawMiniMap(ctx) {
        const miniMapScaleX = 6
        const miniMapScaleY = 6

        const offsetX = SCREEN_W - MAP_LEVEL2[0].length * miniMapScaleX - 10

        // Minimap iets lager gezet zodat hij goed zichtbaar is met fullscreen
        const offsetY = 70

        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)'
        ctx.fillRect(
            offsetX - 4,
            offsetY - 4,
            MAP_LEVEL2[0].length * miniMapScaleX + 8,
            MAP_LEVEL2.length * miniMapScaleY + 8
        )

        for (let y = 0; y < MAP_LEVEL2.length; y++) {
            for (let x = 0; x < MAP_LEVEL2[y].length; x++) {
                const tile = MAP_LEVEL2[y][x]

                if (tile === 'D') {
                    ctx.fillStyle = 'rgb(80, 255, 110)'
                } else if (tile === 'G') {
                    ctx.fillStyle = 'rgb(0, 170, 230)'
                } else if (tile === 'P') {
                    ctx.fillStyle = 'rgb(85, 90, 100)'
                } else if (tile === '#') {
                    ctx.fillStyle = 'rgb(145, 150, 160)'
                } else {
                    ctx.fillStyle = 'rgb(24, 26, 30)'
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