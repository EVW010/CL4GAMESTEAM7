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
                this.parent.burnerWeaponProgress++;
            }
        }
        
    }

    attack() {
        console.log("player rotation: " + this.parent.rotation)
        this.scene.add(new Bullet(this.parent.pos, this.parent.rotation, "burner", this.damage, this.parent));
    }
}