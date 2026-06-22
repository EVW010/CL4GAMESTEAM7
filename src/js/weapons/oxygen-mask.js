import { Actor, Engine, Vector, DisplayMode, Keys, CircleCollider } from "excalibur"
import { Resources } from '../resources.js'

export class OxygenMask extends Actor {

    game;
    oxygenPerSecond = 40;
    player;
    inventoryPlacement;

    constructor(player, inventoryPlacement) {
        super();
        this.player = player;
        this.inventoryPlacement = inventoryPlacement;
    }

    onInitialize(engine) {
        this.game = engine;
        this.graphics.use(Resources.OxygenMask.toSprite());
        this.pos = new Vector(640, 600);
        this.anchor = new Vector(0.5, 0.5);
        this.scale =  new Vector(1.8, 1.8);
    }

    onPreUpdate(engine, delta) {
        if (this.player.selectedWeapon == this.inventoryPlacement) {
            if (engine.input.keyboard.isHeld(Keys.Space)) {
                this.player.oxygenLevel += this.oxygenPerSecond/60 + this.player.oxygenDrain;
                this.pos.y = 550;
                if (this.player.oxygenLevel > 100) {
                    this.player.oxygenLevel = 100;
                }
            } else {
                this.pos.y = 700;
            }
        } else {
            this.pos.y = 2000;
        }
    }
}