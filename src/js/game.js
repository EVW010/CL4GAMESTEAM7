import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, SpriteSheet } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { RenderObject } from './renderBase/renderbase.js'
import { Dummy } from './dummyplayer.js'

export class Game extends Engine {
    Sheets
    constructor() {
        super({ 
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen
         })

        this.PLAYER = new Dummy()


        this.start(ResourceLoader).then(() => {
            this.startGame()
        })
        
    }

    startGame() {

        this.add(this.PLAYER)
        console.log("start de game!")
        let v = new RenderObject(new Vector(0, 0), 0, this.PLAYER)
        this.add(v)
        
    }

}

new Game()
