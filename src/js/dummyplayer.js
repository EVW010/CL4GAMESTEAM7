import { Actor, Vector } from "excalibur";

export class Dummy extends Actor {
    constructor() {
        super()
        this.dir = 180
    }

    onPreUpdate(engine) {
        this.dir += 0.02
    }
}