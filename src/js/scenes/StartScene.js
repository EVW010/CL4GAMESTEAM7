import { Scene } from 'excalibur'
import {
    arcadeAxisY,
    arcadeButtonPressed,
    ARCADE_MENU_BUTTONS,
    ARCADE_SECONDARY_BUTTONS,
    ARCADE_BACK_BUTTONS
} from '../arcade-controls.js'

export class StartScene extends Scene {
    onActivate() {
        this.selectedIndex = 0
        this.moveCooldown = 0
        this.showStartScreen()
    }

    onDeactivate() {
        this.removeStartScreen()
    }

    onPreUpdate(engine, delta) {
        if (!this.startScreen || !this.menuButtons) return

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

        if (arcadeButtonPressed(engine, ARCADE_MENU_BUTTONS)) {
            this.menuButtons[this.selectedIndex].click()
        }

        if (arcadeButtonPressed(engine, ARCADE_SECONDARY_BUTTONS)) {
            this.selectedIndex = 1
            this.updateSelectedButton()
            this.showControls()
        }

        if (arcadeButtonPressed(engine, ARCADE_BACK_BUTTONS)) {
            this.infoText?.classList.add('hidden')
        }
    }

    showStartScreen() {
        this.removeStartScreen()

        this.startScreen = document.createElement('section')
        this.startScreen.classList.add('start-screen')

        this.startScreen.innerHTML = `
            <div class="retro-overlay"></div>

            <div class="retro-menu">
                <p class="game-label">Team 7</p>

                <h1 class="retro-title">By Nature</h1>

                <p class="game-synopsis">
                    Overleef het magische bos en vecht terug tegen het slechte bedrijf.
                </p>

                <div class="menu-options">
                    <button class="menu-option active" id="start-button">Start Game</button>
                    <button class="menu-option" id="controls-button">Controls</button>
                    <button class="menu-option" id="story-button">Story</button>
                    <button class="menu-option" id="weapons-button">Weapons</button>
                </div>

                <div id="info-text" class="info-text hidden">
                    <p>W = vooruit lopen</p>
                    <p>S = achteruit lopen</p>
                    <p>A / D = links en rechts bewegen</p>
                    <p>Pijltjes links/rechts = draaien</p>
                    <p>Spatie = schieten</p>
                    <p>Escape = terug</p>
                </div>

                <p class="enter-text">Enter / arcade knop = selecteren</p>
            </div>
        `

        document.body.appendChild(this.startScreen)

        this.infoText = this.startScreen.querySelector('#info-text')
        this.menuButtons = [...this.startScreen.querySelectorAll('.menu-option')]

        this.startScreen.querySelector('#start-button').addEventListener('click', () => {
            this.selectedIndex = 0
            this.updateSelectedButton()
            this.startGame()
        })

        this.startScreen.querySelector('#controls-button').addEventListener('click', () => {
            this.selectedIndex = 1
            this.updateSelectedButton()
            this.showControls()
        })

        this.startScreen.querySelector('#story-button').addEventListener('click', () => {
            this.selectedIndex = 2
            this.updateSelectedButton()
            this.showStory()
        })

        this.startScreen.querySelector('#weapons-button').addEventListener('click', () => {
            this.selectedIndex = 3
            this.updateSelectedButton()
            this.openWeaponsScreen()
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
                this.menuButtons[this.selectedIndex].click()
            }

            if (event.key === 'Escape') {
                this.infoText.classList.add('hidden')
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)

        this.updateSelectedButton()
    }

    moveDown() {
        this.selectedIndex++

        if (this.selectedIndex >= this.menuButtons.length) {
            this.selectedIndex = 0
        }

        this.updateSelectedButton()
    }

    moveUp() {
        this.selectedIndex--

        if (this.selectedIndex < 0) {
            this.selectedIndex = this.menuButtons.length - 1
        }

        this.updateSelectedButton()
    }

    updateSelectedButton() {
        if (!this.menuButtons) return

        this.menuButtons.forEach((button) => {
            button.classList.remove('active')
        })

        this.menuButtons[this.selectedIndex].classList.add('active')
    }

    showControls() {
        this.infoText.classList.remove('hidden')

        this.infoText.innerHTML = `
            <p><strong>Keyboard</strong></p>
            <p>W = vooruit lopen</p>
            <p>S = achteruit lopen</p>
            <p>A / D = links en rechts bewegen</p>
            <p>Pijltjes links/rechts = draaien</p>
            <p>Spatie = schieten</p>
            <p>Escape = terug</p>

            <br>

            <p><strong>Arcade controls</strong></p>
            <p>Joystick omhoog/omlaag = menu kiezen</p>
            <p>Arcade knop / Start = selecteren</p>
            <p>In game: joystick omhoog/omlaag = lopen</p>
            <p>In game: joystick links/rechts = draaien</p>
            <p>Arcade knop = schieten</p>
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

    openWeaponsScreen() {
        this.removeStartScreen()
        this.engine.goToScene('weapons')
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

        this.infoText = null
        this.menuButtons = null
    }
}