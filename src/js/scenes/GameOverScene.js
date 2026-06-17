import { Scene } from 'excalibur'

export class GameOverScene extends Scene {
    onActivate() {
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
            <div class="end-card">
                <h1>Game Over</h1>

                <p>
                    Je bent verslagen door de magische bomen. Het bedrijf rekent op jou, dus probeer het opnieuw.
                </p>

                <button id="retry-button">Opnieuw proberen</button>
                <button id="menu-button" class="secondary-button">Terug naar menu</button>
            </div>
        `

        document.body.appendChild(this.gameOverScreen)

        const retryButton = this.gameOverScreen.querySelector('#retry-button')
        const menuButton = this.gameOverScreen.querySelector('#menu-button')

        retryButton.addEventListener('click', () => {
            this.restartGame()
        })

        menuButton.addEventListener('click', () => {
            this.backToMenu()
        })

        this.keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                this.restartGame()
            }

            if (event.key === 'Escape') {
                this.backToMenu()
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)
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