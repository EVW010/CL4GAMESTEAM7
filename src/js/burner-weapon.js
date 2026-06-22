import { Actor, Keys } from "excalibur"
import { Resources } from './resources.js'
import { Bullet } from './bullet.js'
import { arcadeButtonPressed, ARCADE_ACTION_BUTTONS } from './arcade-controls.js'

export class BurnerWeapon extends Actor {

    game
    damage = 10

    onInitialize(engine) {
        this.game = engine
    }

    onPreUpdate(engine) {
        if (this.parent.selectedWeapon === 1) {
            this.rotation = this.parent.rotation

            const keyboardShoot = engine.input.keyboard.wasPressed(Keys.Space)
            const arcadeShoot = arcadeButtonPressed(engine, ARCADE_ACTION_BUTTONS)

            if (keyboardShoot || arcadeShoot) {
                this.attack()
                this.parent.burnerWeaponProgress++
            }
        }
    }

    attack() {
        Resources.PistolShot.play(0.45)

        this.scene.add(
            new Bullet(this.rotation, "burner", this.damage)
        )
    }
}