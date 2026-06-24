import { Actor, Engine, Vector, DisplayMode, Keys, CircleCollider } from "excalibur"
import { Resources } from '../resources.js'
import { CanBullet } from './can-bullet.js'

export class CanWeapon extends Actor {

    game;
    damage = 10;
    player;
    inventoryPlacement;

    constructor(player, inventoryPlacement) {
        super();
        this.player = player;
        this.inventoryPlacement = inventoryPlacement;
    }

    onInitialize(engine) {
        this.game = engine;
        this.graphics.use(Resources.CanWeapon.toSprite());
        this.rotation = -6;
        this.pos = new Vector(1150, 600);
        // this.scale = new Vector(1.3, 1.3);
    }

    onPreUpdate(engine) {
        if (this.player.selectedWeapon == this.inventoryPlacement) {

            if (engine.input.keyboard.wasPressed(Keys.Space)) {
                this.attack();
                this.player.canWeaponProgress++;
            }
            
            this.pos = new Vector(1150 + Math.sin(this.player.pixelsWalked/8)*12, 600 + Math.sin(this.player.pixelsWalked/4)*6);
        } else {
            this.pos.y = 2000;
        }
    }

    attack() {
        this.scene.add(new CanBullet(this.player.pos, this.player.rotation, this.damage, this.player));
    }
}