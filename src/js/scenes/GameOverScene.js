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
                    Je bent verslagen door de magische bomen.
                    Het bedrijf rekent op jou, dus probeer het opnieuw.
                </p>

                <button id="retry-button">Opnieuw proberen</button>
                <button id="menu-button" class="secondary-button">Terug naar menu</button>
            </div>
        `

        document.body.appendChild(this.gameOverScreen)

        this.gameOverScreen.querySelector('#retry-button').addEventListener('click', () => {
            this.removeGameOverScreen()
            this.engine.goToScene('game')
        })

        this.gameOverScreen.querySelector('#menu-button').addEventListener('click', () => {
            this.removeGameOverScreen()
            this.engine.goToScene('start')
        })

        this.keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                this.removeGameOverScreen()
                this.engine.goToScene('game')
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)
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