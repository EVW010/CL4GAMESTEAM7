import '../css/style.css'

import { Engine, DisplayMode, ImageFiltering } from "excalibur"

import { ResourceLoader } from './resources.js'
import { Player } from './player.js'

import { MapLevel1 } from './maps/level1/MapLevel1.js'
import { MapLevel2 } from './maps/level2/MapLevel2.js'
import { MapLevel3 } from './maps/Level3/MapLevel3.js'
import { MapLevel4 } from './maps/Level4/MapLevel4.js'

import { StartScene } from './scenes/StartScene.js'
import { WeaponsScene } from './scenes/WeaponsScene.js'
import { GameOverScene } from './scenes/GameOverScene.js'
import { WinScene } from './scenes/WinScene.js'

// is voor dev, 'level1'/'level2'/'level3'/'level4' om te skippen, null voor normaal
const DEV_START = null

export class Game extends Engine {

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
        console.log("start de game!")

        const startScreen = new StartScene()
        this.addScene('startScreen', startScreen)

        const weaponsScreen = new WeaponsScene()
        this.addScene('weapons', weaponsScreen)

        const gameOverScreen = new GameOverScene()
        this.addScene('gameOverScreen', gameOverScreen)

        const winScreen = new WinScene()
        this.addScene('winScreen', winScreen)

        const level1 = new MapLevel1(this.player)
        this.addScene('level1', level1)

        const level2 = new MapLevel2(this.player)
        this.addScene('level2', level2)

        const level3 = new MapLevel3(this.player)
        this.addScene('level3', level3)

        const level4 = new MapLevel4(this.player)
        this.addScene('level4', level4)

        this.goToScene(DEV_START ?? 'startScreen')
    }
}

new Game()