import { Scene } from 'excalibur'

export class WinScene extends Scene {
    onActivate() {
        this.showWinScreen()
    }

    onDeactivate() {
        this.removeWinScreen()
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
            </div>
        `

        document.body.appendChild(this.winScreen)

        this.winScreen.querySelector('#menu-button').addEventListener('click', () => {
            this.removeWinScreen()
            this.engine.goToScene('start')
        })

        this.keyDownHandler = (event) => {
            if (event.key === 'Enter') {
                this.removeWinScreen()
                this.engine.goToScene('game')
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)
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