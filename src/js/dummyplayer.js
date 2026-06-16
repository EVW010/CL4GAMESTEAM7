import { Actor, Vector } from "excalibur";
import { addAngle } from "./functions";

export class Dummy extends Actor {
    constructor() {
        super()
        this.dir = 180
        this.pos = new Vector (50, 50)
    }

    onPreUpdate(engine) {
        this.dir = addAngle(this.dir, 1)
    }
}