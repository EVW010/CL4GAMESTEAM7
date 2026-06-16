import { Actor, Engine, Vector, DisplayMode, Keys, CircleCollider } from "excalibur"
import { Resources } from './resources.js'
import {Bullet } from './bullet.js'

export class BurnerWeapon extends Actor {

    game;
    damage = 10;

    onInitialize(engine) {
        this.game = engine;
    }

    onPreUpdate(engine) {
        if (this.parent.selectedWeapon == 1) {
            this.rotation = this.parent.rotation;

            if (engine.input.keyboard.wasPressed(Keys.Space)) {
                this.attack();
                this.parent.burnerWeaponProcess++;
            }
        }
        
    }

    attack() {
        this.scene.add(new Bullet(this.rotation, "burner", this.damage));
    }
}