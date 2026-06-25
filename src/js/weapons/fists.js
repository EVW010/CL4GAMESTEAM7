import { Actor, Engine, Vector, DisplayMode, Keys, CircleCollider } from "excalibur"
import { Sheets } from '../resources.js'

export class BrushWeapon extends Actor {

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
        this.sheet = Sheets.PaintSplatter
        this.rotation = 0.1;
        this.pos = new Vector(1050, 575);
        this.scale = new Vector(1.7, 1.7);
    }

    onPreUpdate(engine) {
        if (this.player.selectedWeapon == this.inventoryPlacement) {
            this.rotation = 0.1;
            if (engine.input.keyboard.wasPressed(Keys.Space)) {
                this.attack();
            }
            this.pos = new Vector(1050 + Math.sin(this.player.pixelsWalked/8)*12, 575 + Math.sin(this.player.pixelsWalked/4)*6);
        } else {
            this.pos.y = 2000;
        }
        
    }

    attack() {
        // deal damage to nearby enemies
        this.parent.addChild(new PaintSplatter(this.parent.pos, this.player.paintProgress))
        this.player.paintProgress++;
        this.rotation = -0.4;
    }
}