import { Scene } from 'excalibur'

export class StartScene extends Scene {
    onActivate() {
        this.showStartScreen()
    }

    onDeactivate() {
        this.removeStartScreen()
    }

    showStartScreen() {
        this.removeStartScreen()

        this.startScreen = document.createElement('section')
        this.startScreen.classList.add('start-screen')

        this.startScreen.innerHTML = `
            <div class="start-card">
                <p class="game-label">Team 7</p>
                <h1>Blue Collar Hero</h1>

                <p class="game-synopsis">
                    Jij bent een gewone werknemer die werkt voor een slecht bedrijf.
                    Tijdens je werk kom je terecht in een bos vol magische bomen die jou proberen tegen te houden.
                </p>

                <div class="button-group">
                    <button id="start-button">Start game</button>
                    <button id="controls-button" class="secondary-button">Controls</button>
                </div>

                <div id="controls-text" class="controls-text hidden">
                    <p><strong>WASD / pijltjes</strong> = bewegen</p>
                    <p><strong>Spatie</strong> = springen / actie</p>
                    <p><strong>Escape</strong> = terug</p>
                </div>

                <p class="enter-text">Druk op Enter om te starten</p>
            </div>
        `

        document.body.appendChild(this.startScreen)

        this.controlsText = this.startScreen.querySelector('#controls-text')

        this.startScreen.querySelector('#start-button').addEventListener('click', () => {
            this.startGame()
        })

        this.startScreen.querySelector('#controls-button').addEventListener('click', () => {
            this.toggleControls()
        })

        this.keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                this.startGame()
            }

            if (event.key === 'Escape') {
                this.controlsText.classList.add('hidden')
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)
    }

    toggleControls() {
        this.controlsText.classList.toggle('hidden')
    }

    startGame() {
        this.removeStartScreen()
        this.engine.goToScene('level1')
    }

    removeStartScreen() {
        if (this.keyDownHandler) {
            window.removeEventListener('keydown', this.keyDownHandler)
            this.keyDownHandler = null
        }

        if (this.startScreen) {
            this.startScreen.remove()
            this.startScreen = null
        }
    }
}
