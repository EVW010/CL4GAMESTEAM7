import { Scene } from 'excalibur'
import {
    arcadeAxisY,
    arcadeButtonPressed,
    ARCADE_MENU_BUTTONS,
    ARCADE_SECONDARY_BUTTONS,
    ARCADE_BACK_BUTTONS
} from '../arcade-controls.js'

export class GameOverScene extends Scene {
    onActivate() {
        this.selectedIndex = 0
        this.moveCooldown = 0
        this.showGameOverScreen()
    }

    onDeactivate() {
        this.removeGameOverScreen()
    }

    onPreUpdate(engine, delta) {
        if (!this.gameOverScreen || !this.endButtons) return

        this.moveCooldown -= delta

        const arcadeY = arcadeAxisY(engine)

        if (this.moveCooldown <= 0) {
            if (arcadeY > 0.5) {
                this.moveDown()
                this.moveCooldown = 220
            }

            if (arcadeY < -0.5) {
                this.moveUp()
                this.moveCooldown = 220
            }
        }

        // Arcade knop / Start knop = geselecteerde optie kiezen
        if (arcadeButtonPressed(engine, ARCADE_MENU_BUTTONS)) {
            this.endButtons[this.selectedIndex].click()
        }

        // Tweede arcade knop = Retry
        if (arcadeButtonPressed(engine, ARCADE_SECONDARY_BUTTONS)) {
            this.restartGame()
        }

        // Back knop = terug naar menu
        if (arcadeButtonPressed(engine, ARCADE_BACK_BUTTONS)) {
            this.backToMenu()
        }
    }

    showGameOverScreen() {
        this.removeGameOverScreen()

        this.gameOverScreen = document.createElement('section')
        this.gameOverScreen.classList.add('end-screen', 'game-over-screen')

        this.gameOverScreen.innerHTML = `
            <div class="end-overlay"></div>

            <div class="end-menu">
                <p class="end-label">Mission Failed</p>

                <h1 class="game-over-title">Game Over</h1>

                <p class="end-text">
                    Je bent verslagen door de magische bomen.
                    Sta op en probeer opnieuw te ontsnappen.
                </p>

                <div class="end-options">
                    <button class="end-option active" id="retry-button">Retry</button>
                    <button class="end-option" id="menu-button">Main Menu</button>
                </div>

                <p class="end-small-text">Enter / arcade knop = kiezen</p>
            </div>
        `

        document.body.appendChild(this.gameOverScreen)

        this.endButtons = [...this.gameOverScreen.querySelectorAll('.end-option')]

        this.gameOverScreen.querySelector('#retry-button').addEventListener('click', () => {
            this.selectedIndex = 0
            this.updateSelectedButton()
            this.restartGame()
        })

        this.gameOverScreen.querySelector('#menu-button').addEventListener('click', () => {
            this.selectedIndex = 1
            this.updateSelectedButton()
            this.backToMenu()
        })

        this.keyDownHandler = (event) => {
            const key = event.key.toLowerCase()

            if (event.key === 'ArrowDown' || key === 's') {
                event.preventDefault()
                this.moveDown()
            }

            if (event.key === 'ArrowUp' || key === 'w') {
                event.preventDefault()
                this.moveUp()
            }

            if (event.key === 'Enter') {
                event.preventDefault()
                this.endButtons[this.selectedIndex].click()
            }

            if (event.key === 'Escape') {
                event.preventDefault()
                this.backToMenu()
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)

        this.updateSelectedButton()
    }

    moveDown() {
        this.selectedIndex++

        if (this.selectedIndex >= this.endButtons.length) {
            this.selectedIndex = 0
        }

        this.updateSelectedButton()
    }

    moveUp() {
        this.selectedIndex--

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.endButtons.length - 1
        }

        this.updateSelectedButton()
    }

    updateSelectedButton() {
        if (!this.endButtons) return

        this.endButtons.forEach((button) => {
            button.classList.remove('active')
        })

        this.endButtons[this.selectedIndex].classList.add('active')
    }

    restartGame() {
        this.removeGameOverScreen()

        if (this.engine.player) {
            this.engine.player.resetPlayer()
        }

        this.engine.goToScene('level1')
    }

    backToMenu() {
        this.removeGameOverScreen()

        if (this.engine.player) {
            this.engine.player.resetPlayer()
        }

        this.engine.goToScene('startScreen')
    }

    removeGameOverScreen() {
        if (this.keyDownHandler) {
            window.removeEventListener('keydown', this.keyDownHandler)
            this.keyDownHandler = null
        }

        if (this.gameOverScreen) {
            this.gameOverScreen.remove()
            this.gameOverScreen = null
        }

        this.endButtons = null
    }
}