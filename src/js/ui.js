import { ScreenElement, Vector, Canvas } from 'excalibur'
import { Resources } from './resources.js'

const SCREEN_W = 1280
const SCREEN_H = 720

export class UI extends ScreenElement {

    constructor(player) {
        super({
            x: 0,
            y: 0,
            width: SCREEN_W,
            height: SCREEN_H
        })

        this.player = player
        this.anchor = Vector.Zero
        this.z = 9999
    }

    onInitialize(engine) {
        const hudCanvas = new Canvas({
            width: SCREEN_W,
            height: SCREEN_H,
            cache: false,
            draw: (ctx) => this.drawHud(ctx)
        })

        this.graphics.use(hudCanvas)
    }

    drawHud(ctx) {
        ctx.clearRect(0, 0, SCREEN_W, SCREEN_H)
        ctx.imageSmoothingEnabled = false

        // Health bar rood
        this.drawBar(
            ctx,
            80,
            30,
            360,
            30,
            this.player.hp,
            this.player.maxHp,
            Resources.BarFillHealth.image,
            'HP'
        )

        // Oxygen bar blauw
        this.drawBar(
            ctx,
            80,
            75,
            360,
            30,
            this.player.oxygenLeven,
            this.player.maxOxygenLeven,
            Resources.BarFillOxygen.image,
            'O2'
        )
    }

    drawBar(ctx, x, y, width, height, value, maxValue, fillImage, label) {
        const borderSize = 5

        const safeValue = Math.max(0, Math.min(value, maxValue))
        const percentage = safeValue / maxValue

        const innerX = x + borderSize
        const innerY = y + borderSize
        const innerW = width - borderSize * 2
        const innerH = height - borderSize * 2

        const fillWidth = Math.floor(innerW * percentage)

        // Label links van de bar
        ctx.fillStyle = 'white'
        ctx.font = '20px monospace'
        ctx.textBaseline = 'middle'
        ctx.fillText(label, x - 45, y + height / 2)

        // Lege binnenkant
        ctx.fillStyle = 'white'
        ctx.fillRect(innerX, innerY, innerW, innerH)

        // Gevulde deel
        if (fillWidth > 0) {
            ctx.drawImage(
                fillImage,
                innerX,
                innerY,
                fillWidth,
                innerH
            )
        }

        // Bovenste zwarte rand
        ctx.drawImage(
            Resources.BarBorderHorizontal.image,
            x,
            y,
            width,
            borderSize
        )

        // Onderste zwarte rand
        ctx.drawImage(
            Resources.BarBorderHorizontal.image,
            x,
            y + height - borderSize,
            width,
            borderSize
        )

        // Linker zwarte rand
        ctx.drawImage(
            Resources.BarBorderVertical.image,
            x,
            y,
            borderSize,
            height
        )

        // Rechter zwarte rand
        ctx.drawImage(
            Resources.BarBorderVertical.image,
            x + width - borderSize,
            y,
            borderSize,
            height
        )
    }
}