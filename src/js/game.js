import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { MapLevel1 } from './maps/level1/MapLevel1.js'

export class Game extends Engine {

    player;

    constructor() {
        super({
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
         })
        this.start(ResourceLoader).then(() => this.startGame())
    }

    startGame() {
        const level1 = new MapLevel1()
        this.addScene('level1', level1)
        this.goToScene('level1')
    }
}

new Game()
