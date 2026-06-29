import { RenderObject } from "../renderBase/renderbase"
import { Sheets } from "../resources"

export class Fiend extends RenderObject {
    constructor(pos, dir, player) {
        super(pos, dir, player, 0.3)
        this.sheet = Sheets.Fiend
    }
}

export class Rock extends RenderObject {
    constructor(pos, dir, player) {
        super(pos, dir, player, 0.2)
        this.sheet = Sheets.Rock
    }
}

export class Pillar extends RenderObject {
    constructor(pos, dir, player) {
        super(pos, dir, player, 0.4)
        this.sheet = Sheets.Pillar
    }
}

export class CorpoJoe extends RenderObject {
    constructor(pos, dir, player) {
        super(pos, dir, player, 0.3)
        this.sheet = Sheets.Corpo
    }
}

export class BigTreeTop extends RenderObject {
    constructor(pos, dir, player) {
        super(pos, dir, player, 0.3)
        this.sheet = Sheets.TreeTop
        console.log(pos, dir, player)
    }
}

export class BigTreeBottom extends RenderObject {
    constructor(pos, dir, player) {
        super(pos, dir, player, 0.3)
        this.sheet = Sheets.TreeBottom
    }
}