import { Actor, Vector, Keys } from "excalibur"
import { BurnerWeapon } from './burner-weapon.js'
import { Resources } from './resources.js'
import { MAP, isWallTile } from './maps/level1/MapLevel1.js'
import { arcadeAxisX, arcadeAxisY } from './arcade-controls.js'

export class Player extends Actor {

    game

    movementSpeed = 2
    rotationSpeed = 0.045

    selectedWeapon = 1
    burnerWeaponProgress = 0

    hp = 100
    maxHp = 100

    oxygenLeven = 100
    maxOxygenLeven = 100

    isDead = false

    stepSoundTimer = 0
    chokeSoundTimer = 0

    constructor() {
        super({
            width: 0.8,
            height: 0.8
        })
    }

    onInitialize(engine) {
        this.game = engine

        this.resetPlayer()

        this.addChild(new BurnerWeapon())
    }

    resetPlayer() {
        this.pos = new Vector(1.5, 1.5)
        this.rotation = 0

        this.hp = this.maxHp
        this.oxygenLeven = this.maxOxygenLeven

        this.burnerWeaponProgress = 0
        this.selectedWeapon = 1

        this.isDead = false
        this.vel = new Vector(0, 0)

        this.stepSoundTimer = 0
        this.chokeSoundTimer = 0
    }

    isWall(x, y) {
        return isWallTile(MAP[Math.floor(y)]?.[Math.floor(x)])
    }

    die(engine) {
        if (this.isDead) return

        this.isDead = true
        this.hp = 0
        this.vel = new Vector(0, 0)

        engine.goToScene('gameOverScreen')
    }

    playWalkingSound(delta, isMoving) {
        if (!isMoving) return

        this.stepSoundTimer -= delta

        if (this.stepSoundTimer <= 0) {
            Resources.WalkingGrass.play(0.25)
            this.stepSoundTimer = 380
        }
    }

    playChokingSound(delta) {
        this.chokeSoundTimer -= delta

        if (this.chokeSoundTimer <= 0) {
            Resources.Choking.play(0.45)
            this.chokeSoundTimer = 1200
        }
    }

    clampInput(value) {
        return Math.max(-1, Math.min(1, value))
    }

    onPreUpdate(engine, delta) {
        if (this.isDead) return

        const arcadeX = arcadeAxisX(engine)
        const arcadeY = arcadeAxisY(engine)

        // Rotatie met toetsenbord of arcade joystick
        if (engine.input.keyboard.isHeld(Keys.Left)) {
            this.rotation -= this.rotationSpeed
        }

        if (engine.input.keyboard.isHeld(Keys.Right)) {
            this.rotation += this.rotationSpeed
        }

        if (arcadeX !== 0) {
            this.rotation += arcadeX * this.rotationSpeed
        }

        const dt = delta / 1000

        let forwardInput = 0
        let strafeInput = 0

        // Toetsenbord controls blijven werken voor testen op laptop
        if (engine.input.keyboard.isHeld(Keys.W)) {
            forwardInput += 1
        }

        if (engine.input.keyboard.isHeld(Keys.S)) {
            forwardInput -= 1
        }

        if (engine.input.keyboard.isHeld(Keys.A)) {
            strafeInput += 1
        }

        if (engine.input.keyboard.isHeld(Keys.D)) {
            strafeInput -= 1
        }

        // Arcade joystick: omhoog/omlaag = vooruit/achteruit
        forwardInput += -arcadeY

        forwardInput = this.clampInput(forwardInput)
        strafeInput = this.clampInput(strafeInput)

        let moveX = 0
        let moveY = 0

        // Vooruit / achteruit in kijkrichting
        moveX += Math.cos(this.rotation) * this.movementSpeed * dt * forwardInput
        moveY += Math.sin(this.rotation) * this.movementSpeed * dt * forwardInput

        // Strafen met A en D op toetsenbord
        moveX += Math.sin(this.rotation) * this.movementSpeed * dt * strafeInput
        moveY -= Math.cos(this.rotation) * this.movementSpeed * dt * strafeInput

        // Oxygen gaat omlaag als je veel schiet
        let oxygenDrain = 0

        for (let i = 1; i <= 10; i++) {
            if (this.burnerWeaponProgress >= i * 10) {
                oxygenDrain += 0.02
            }
        }

        if (oxygenDrain > 0 && this.oxygenLeven > 0) {
            this.oxygenLeven = Math.max(0, this.oxygenLeven - oxygenDrain)
        }

        if (this.oxygenLeven <= 0) {
            this.hp = Math.max(0, this.hp - 0.1)
            this.playChokingSound(delta)
        }

        if (this.hp <= 0) {
            this.die(engine)
            return
        }

        // Botsing met muren
        const margin = 0.15

        const xEdge = this.pos.x + moveX + Math.sign(moveX) * margin

        if (
            this.isWall(xEdge, this.pos.y + margin) ||
            this.isWall(xEdge, this.pos.y - margin)
        ) {
            moveX = 0
        }

        const yEdge = this.pos.y + moveY + Math.sign(moveY) * margin

        if (
            this.isWall(this.pos.x + margin, yEdge) ||
            this.isWall(this.pos.x - margin, yEdge)
        ) {
            moveY = 0
        }

        const isMoving = moveX !== 0 || moveY !== 0

        this.playWalkingSound(delta, isMoving)

        this.pos.x += moveX
        this.pos.y += moveY

        this.vel = new Vector(0, 0)
    }
}