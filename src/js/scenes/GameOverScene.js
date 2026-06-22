import { Scene } from 'excalibur'

export class GameOverScene extends Scene {
    onActivate() {
        this.selectedIndex = 0
        this.showGameOverScreen()
    }

    onDeactivate() {
        this.removeGameOverScreen()
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

                <p class="end-small-text">Enter = kiezen / Escape = menu</p>
            </div>
        `

        document.body.appendChild(this.gameOverScreen)

        this.endButtons = [...this.gameOverScreen.querySelectorAll('.end-option')]

        this.gameOverScreen.querySelector('#retry-button').addEventListener('click', () => {
            this.restartGame()
        })

        this.gameOverScreen.querySelector('#menu-button').addEventListener('click', () => {
            this.backToMenu()
        })

        this.keyDownHandler = (event) => {
            const key = event.key.toLowerCase()

            if (event.key === 'ArrowDown' || key === 's') {
                this.selectedIndex++

                if (this.selectedIndex >= this.endButtons.length) {
                    this.selectedIndex = 0
                }

                this.updateSelectedButton()
            }

            if (event.key === 'ArrowUp' || key === 'w') {
                this.selectedIndex--

                if (this.selectedIndex < 0) {
                    this.selectedIndex = this.endButtons.length - 1
                }

                this.updateSelectedButton()
            }

            if (event.key === 'Enter') {
                this.endButtons[this.selectedIndex].click()
            }

            if (event.key === 'Escape') {
                this.backToMenu()
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)
    }

    updateSelectedButton() {
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
    }
}