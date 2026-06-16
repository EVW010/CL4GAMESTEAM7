import '../css/style.css'
import { Actor, Engine, Vector, DisplayMode, SpriteSheet, ImageFiltering } from "excalibur"
import { Resources, ResourceLoader } from './resources.js'
import { RenderObject } from './renderBase/renderbase.js'
import { Dummy } from './dummyplayer.js'
import { MapLevel1 } from './maps/level1/MapLevel1.js'

export class Game extends Engine {
  
    Sheets;
    player;

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

        this.player = new Player()

        this.start(ResourceLoader).then(() => {
            this.startGame()
        })
        
    }

    startGame() {
        this.add(this.player)
        console.log("start de game!")
        let v = new RenderObject(new Vector(50, 50.1), 0, this.PLAYER)
        this.add(v)
      
        const level1 = new MapLevel1(this.player)
        this.addScene('level1', level1)
        this.goToScene('level1')
    }

}

new Game()
