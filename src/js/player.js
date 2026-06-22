import { Actor, Vector, Keys, CollisionType, CircleCollider } from "excalibur"
import { BurnerWeapon } from './weapons/burner-weapon.js'
import { MAP, isWallTile } from './maps/level1/MapLevel1.js'

export class Player extends Actor {

    game

    movementSpeed = 2
    rotationSpeed = 0.045

    selectedWeapon = 1
    burnerWeaponProgress = 0

    hp = 100
    maxHp = 100

    oxygenLevel = 100
    maxoxygenLevel = 100

    isDead = false

    constructor() {
        super({
            width: 0.8,
            height: 0.8
        })

        this.collider.set(new CircleCollider({
            radius: 0.2
        }))

        this.body.collisionType = CollisionType.Active

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
        this.oxygenLevel = this.maxoxygenLevel

        this.burnerWeaponProgress = 0
        this.selectedWeapon = 1

        this.isDead = false
        this.vel = new Vector(0, 0)
    }

    die(engine) {
        if (this.isDead) return

        this.isDead = true
        this.hp = 0
        this.vel = new Vector(0, 0)

        engine.goToScene('gameOverScreen')
    }

    onPreUpdate(engine, delta) {

        if (this.isDead) return

        // Rotatie
        if (engine.input.keyboard.isHeld(Keys.Left)) {
            this.rotation -= this.rotationSpeed
        }

        if (engine.input.keyboard.isHeld(Keys.Right)) {
            this.rotation += this.rotationSpeed
        }

        // Beweging
        const dt = delta / 1000

        let moveX = 0
        let moveY = 0

        if (engine.input.keyboard.isHeld(Keys.A)) {
            moveX += Math.sin(this.rotation) * this.movementSpeed * dt
            moveY -= Math.cos(this.rotation) * this.movementSpeed * dt
        }

        if (engine.input.keyboard.isHeld(Keys.D)) {
            moveX -= Math.sin(this.rotation) * this.movementSpeed * dt
            moveY += Math.cos(this.rotation) * this.movementSpeed * dt
        }

        if (engine.input.keyboard.isHeld(Keys.W)) {
            moveX += Math.cos(this.rotation) * this.movementSpeed * dt
            moveY += Math.sin(this.rotation) * this.movementSpeed * dt
        }

        if (engine.input.keyboard.isHeld(Keys.S)) {
            moveX -= Math.cos(this.rotation) * this.movementSpeed * dt
            moveY -= Math.sin(this.rotation) * this.movementSpeed * dt
        }

        // Oxygen gaat omlaag als burnerWeaponProgress hoger wordt
        let oxygenDrain = 0

        for (let i = 1; i <= 10; i++) {
            if (this.burnerWeaponProgress >= i * 10) {
                oxygenDrain += 0.02
            }
        }

        if (oxygenDrain > 0 && this.oxygenLevel > 0) {
            this.oxygenLevel = Math.max(0, this.oxygenLevel - oxygenDrain)
        }

        // Als oxygen op is, gaat HP omlaag
        if (this.oxygenLevel <= 0) {
            this.hp = Math.max(0, this.hp - 0.1)
        }

        // Als HP leeg is, naar Game Over
        if (this.hp <= 0) {
            this.die(engine)
            return
        }

        // Botsing met muren
        const scene = this.game?.currentScene

        const isWall = (x, y) => {
            if (!scene) return false
            return scene.isWallTile(scene.map[Math.floor(y)]?.[Math.floor(x)])
        }

        const getDoorTransition = (x, y) => {
            if (!scene) return null
            const tile = scene.map[Math.floor(y)]?.[Math.floor(x)]
            return scene.getSceneTransition?.(tile) ?? null
        }

        // Physics keeps player ~0.2 away from wall tiles, so check with 0.35 reach
        // to reliably detect door tiles even when physically stopped against them
        const doorReach = 0.35
        const transition =
            getDoorTransition(this.pos.x + doorReach, this.pos.y) ||
            getDoorTransition(this.pos.x - doorReach, this.pos.y) ||
            getDoorTransition(this.pos.x, this.pos.y + doorReach) ||
            getDoorTransition(this.pos.x, this.pos.y - doorReach)

        if (transition) {
            this.resetPlayer()
            engine.goToScene(transition)
            return
        }

        const margin = 0.15

        const xEdge = this.pos.x + moveX + Math.sign(moveX) * margin

        if (
            isWall(xEdge, this.pos.y + margin) ||
            isWall(xEdge, this.pos.y - margin)
        ) {
            moveX = 0
        }

        const yEdge = this.pos.y + moveY + Math.sign(moveY) * margin

        if (
            isWall(this.pos.x + margin, yEdge) ||
            isWall(this.pos.x - margin, yEdge)
        ) {
            moveY = 0
        }

        this.pos.x += moveX
        this.pos.y += moveY

        this.vel = new Vector(0, 0)
    }
}