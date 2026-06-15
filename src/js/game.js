import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { MapLevel1 } from './maps/level1/MapLevel1.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
         })
        this.add('maplevel1', new MapLevel1())
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        this.goToScene('maplevel1')
    }
}

new Game()
