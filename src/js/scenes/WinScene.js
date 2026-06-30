import { Scene } from 'excalibur'
import {
    arcadeButtonPressed,
    ARCADE_MENU_BUTTONS,
    ARCADE_SECONDARY_BUTTONS,
    ARCADE_BACK_BUTTONS
} from '../arcade-controls.js'

export class WinScene extends Scene {
    onActivate() {
        this.showWinScreen()
    }

    onDeactivate() {
        this.removeWinScreen()
    }

    onPreUpdate(engine) {
        if (!this.winScreen) return

        if (arcadeButtonPressed(engine, ARCADE_MENU_BUTTONS)) {
            this.playAgain()
        }

        if (
            arcadeButtonPressed(engine, ARCADE_SECONDARY_BUTTONS) ||
            arcadeButtonPressed(engine, ARCADE_BACK_BUTTONS)
        ) {
            this.backToMenu()
        }
    }

    showWinScreen() {
        this.removeWinScreen()

        this.winScreen = document.createElement('section')
        this.winScreen.classList.add('end-screen', 'win-screen')

        this.winScreen.innerHTML = `
            <div class="end-card">
                <h1>You Win!</h1>

                <p>
                    Je hebt het bos overleefd en de waarheid ontdekt.
                    Het bedrijf blijkt de echte slechterik te zijn.
                </p>

                <button id="play-again-button">Speel opnieuw</button>
                <button id="menu-button" class="secondary-button">Terug naar menu</button>

                <p class="enter-text">Start/arcade knop = speel opnieuw</p>
            </div>
        `

        document.body.appendChild(this.winScreen)

        this.winScreen.querySelector('#play-again-button').addEventListener('click', () => {
            this.playAgain()
        })

        this.winScreen.querySelector('#menu-button').addEventListener('click', () => {
            this.backToMenu()
        })

        this.keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                this.playAgain()
            }

            if (event.key === 'Escape') {
                this.backToMenu()
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)
    }

    playAgain() {
        this.removeWinScreen()

        if (this.engine.player) {
            this.engine.player.resetPlayer()
        }

        this.engine.resetLevels?.()

        this.engine.goToScene('level1')
    }

    backToMenu() {
        this.removeWinScreen()

        if (this.engine.player) {
            this.engine.player.resetPlayer()
        }

        this.engine.resetLevels?.()

        this.engine.goToScene('startScreen')
    }

    removeWinScreen() {
        if (this.keyDownHandler) {
            window.removeEventListener('keydown', this.keyDownHandler)
            this.keyDownHandler = null
        }

        if (this.winScreen) {
            this.winScreen.remove()
            this.winScreen = null
        }
    }
}