import { Actor, Engine, Vector, DisplayMode, Keys, CircleCollider } from "excalibur"
import { Sheets, Resources } from '../resources.js'

export class Fists extends Actor {

    game;
    damage = 10;
    player;
    inventoryPlacement;
    range = 0.6;

    constructor(player, inventoryPlacement) {
        super();
        this.player = player;
        this.inventoryPlacement = inventoryPlacement;
    }

    onInitialize(engine) {
        this.game = engine;
        this.sheet = Sheets.Fists;
        this.pos = new Vector(0, 10);
        this.scale = new Vector(10, 10);
        this.frame = 0;
        this.anchor = new Vector(0, 0);
        this.graphics.use(this.sheet.getSprite(this.frame, 0))
    }

    onPreUpdate(engine) {
        this.frame = 0;
        if (this.player.selectedWeapon == this.inventoryPlacement) {
            if (engine.input.keyboard.wasPressed(Keys.Space)) {
                this.attack();
                console.log("attack!!");
            }
            this.pos = new Vector(Math.sin(this.player.pixelsWalked/8)*12, Math.sin(this.player.pixelsWalked/4)*6 + 10);
        } else {
            this.pos.y = 2000;
        }
        this.graphics.use(this.sheet.getSprite(this.frame, 0))
    }

    attack() {
        // deal damage to nearby enemies
        // if hit something
            this.player.hp -= 0.5;
        //
        this.frame = 1;
    }
}