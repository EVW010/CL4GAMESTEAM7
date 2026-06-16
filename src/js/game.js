import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, SpriteSheet, ImageFiltering } from "excalibur"
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
            displayMode: DisplayMode.FitScreen,
            antialiasing: {
                filtering: ImageFiltering.Pixel
            }
         })

        this.PLAYER = new Dummy()


        this.start(ResourceLoader).then(() => {
            this.startGame()
        })
        
    }

    startGame() {

        this.add(this.PLAYER)
        console.log("start de game!")
        let v = new RenderObject(new Vector(50, 50.1), 0, this.PLAYER)
        this.add(v)
        
    }

}

new Game()
