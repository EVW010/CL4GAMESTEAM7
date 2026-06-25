import { Actor, Engine, Vector, DisplayMode, Keys, toDegrees, toRadians } from "excalibur"
import { Sheets } from '../resources.js'

export class PaintSplatter extends Actor {

    game;
    movementSpeed;
    playerProgress;
    timer;
    timerMax;

    constructor(pos, playerProgress) {
        super();
        this.pos = pos;
        this.pos.x += Math.floor(Math.random()*200) - 100;
        this.pos.y += Math.floor(Math.random()*100) - 50;
        this.sheet = Sheets.PaintSplatter
        this.anchor = new Vector(0, 0);
        this.scale = new Vector(9 + Math.floor(Math.random()*2), 9 + Math.floor(Math.random()*2))
        this.frame = Math.floor(Math.random()*5)
        this.graphics.use(this.sheet.getSprite(this.frame, 0))

        this.playerProgress = playerProgress;
        this.timerMax = 300 + 15*playerProgress;
        this.timer = 0;

        console.log(this.graphics.opacity)
    }

    onPreUpdate(engine, delta) {
        const dt = delta / 1000;
        // this.pos.x += Math.cos(this.rotation) * this.movementSpeed * dt;
        // this.pos.y += Math.sin(this.rotation) * this.movementSpeed * dt;

        this.timer++; 

        this.pos.y += 50 / this.timerMax;
        this.graphics.opacity = 1 - 1 / this.timerMax * this.timer;

        if (this.timer >= this.timerMax) {
            this.kill();
        }

    }
}