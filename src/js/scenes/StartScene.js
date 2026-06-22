import { Scene } from 'excalibur'

export class StartScene extends Scene {
    onActivate() {
        this.selectedIndex = 0
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
            <div class="retro-overlay"></div>

            <div class="retro-menu">
                <p class="game-label">Team 7</p>

                <h1 class="retro-title">Blue Collar Hero</h1>

                <p class="game-synopsis">
                    Overleef het magische bos en vecht terug tegen het slechte bedrijf.
                </p>

                <div class="menu-options">
                    <button class="menu-option active" id="start-button">Start Game</button>
                    <button class="menu-option" id="controls-button">Controls</button>
                    <button class="menu-option" id="story-button">Story</button>
                </div>

                <div id="info-text" class="info-text hidden">
                    <p>W = vooruit lopen</p>
                    <p>S = achteruit lopen</p>
                    <p>A / D = links en rechts bewegen</p>
                    <p>Pijltjes links/rechts = draaien</p>
                    <p>Spatie = schieten</p>
                    <p>Escape = terug</p>
                </div>

                <p class="enter-text">Druk op Enter om te starten</p>
            </div>
        `

        document.body.appendChild(this.startScreen)

        this.infoText = this.startScreen.querySelector('#info-text')
        this.menuButtons = [...this.startScreen.querySelectorAll('.menu-option')]

        this.startScreen.querySelector('#start-button').addEventListener('click', () => {
            this.startGame()
        })

        this.startScreen.querySelector('#controls-button').addEventListener('click', () => {
            this.showControls()
        })

        this.startScreen.querySelector('#story-button').addEventListener('click', () => {
            this.showStory()
        })

        this.keyDownHandler = (event) => {
            const key = event.key.toLowerCase()

            if (event.key === 'ArrowDown' || key === 's') {
                this.selectedIndex++

                if (this.selectedIndex >= this.menuButtons.length) {
                    this.selectedIndex = 0
                }

                this.updateSelectedButton()
            }

            if (event.key === 'ArrowUp' || key === 'w') {
                this.selectedIndex--

                if (this.selectedIndex < 0) {
                    this.selectedIndex = this.menuButtons.length - 1
                }

                this.updateSelectedButton()
            }

            if (event.key === 'Enter') {
                this.menuButtons[this.selectedIndex].click()
            }

            if (event.key === 'Escape') {
                this.infoText.classList.add('hidden')
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)
    }

    updateSelectedButton() {
        this.menuButtons.forEach((button) => {
            button.classList.remove('active')
        })

        this.menuButtons[this.selectedIndex].classList.add('active')
    }

    showControls() {
        this.infoText.classList.remove('hidden')

        this.infoText.innerHTML = `
            <p>W = vooruit lopen</p>
            <p>S = achteruit lopen</p>
            <p>A / D = links en rechts bewegen</p>
            <p>Pijltjes links/rechts = draaien</p>
            <p>Spatie = schieten</p>
            <p>Escape = terug</p>
        `
    }

    showStory() {
        this.infoText.classList.remove('hidden')

        this.infoText.innerHTML = `
            <p>Jij bent een gewone werknemer.</p>
            <p>Je werkt voor een slecht bedrijf.</p>
            <p>Tijdens je werk kom je terecht in een magisch bos.</p>
            <p>Overleef, vecht terug en probeer te ontsnappen.</p>
        `
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