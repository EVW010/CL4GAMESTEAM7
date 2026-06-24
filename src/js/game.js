import '../css/style.css'

import { Engine, DisplayMode, ImageFiltering } from "excalibur"

import { ResourceLoader } from './resources.js'
import { Player } from './player.js'

import { MapLevel1 } from './maps/level1/MapLevel1.js'
import { MapLevel2 } from './maps/level2/MapLevel2.js'
import { StartScene } from './scenes/StartScene.js'
import { GameOverScene } from './scenes/GameOverScene.js'
import { WinScene } from './scenes/WinScene.js'

export class Game extends Engine {

    constructor() {
        super({
            width: 1280,
            height: 720,
            maxFps: 60,
            displayMode: DisplayMode.FitScreen,
            suppressPlayButton: true,
            antialiasing: {
                filtering: ImageFiltering.Pixel
            }
        })

        this.player = new Player()
        this.mygamepad = null

        this.input.gamepads.enabled = true

        this.input.gamepads.on('connect', (connectEvent) => {
            console.log('arcade controls gevonden')
            this.mygamepad = connectEvent.gamepad
        })

        this.input.gamepads.on('disconnect', () => {
            console.log('arcade controls losgekoppeld')
            this.mygamepad = null
        })

        this.start(ResourceLoader).then(() => {
            this.startGame()
        })
    }

    startGame() {
        console.log("start de game!")

        const startScreen = new StartScene()
        this.addScene('startScreen', startScreen)

        const gameOverScreen = new GameOverScene()
        this.addScene('gameOverScreen', gameOverScreen)

        const winScreen = new WinScene()
        this.addScene('winScreen', winScreen)

        const level1 = new MapLevel2(this.player)
        this.addScene('level1', level1)

        const level2 = new MapLevel1(this.player)
        this.addScene('level2', level2)

        this.goToScene('startScreen')
    }
}

new Game()