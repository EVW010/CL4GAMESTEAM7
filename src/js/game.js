import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { MapLevel1 } from './scenes/MapLevel1.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
         })
        this.add('MapLevel1', new MapLevel1())
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        this.goToScene('MapLevel1')
    }
}

new Game()
