import { RenderObject } from "../renderBase/renderbase"
import { Sheets } from "../resources"

export class Fiend extends RenderObject {
    constructor(pos, dir, player) {
        super(pos, dir, player, 0.3)
        this.sheet = Sheets.Fiend
    }
}