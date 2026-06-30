import { Scene } from 'excalibur'
import {
    arcadeAxisY,
    arcadeButtonPressed,
    ARCADE_MENU_BUTTONS,
    ARCADE_SECONDARY_BUTTONS,
    ARCADE_BACK_BUTTONS
} from '../arcade-controls.js'

const JUMPSCARE_SOUND_PATH = '/sounds/Ominous Bells of Doom.mp3'

let audioUnlocked = false

function unlockAudio() {
    if (audioUnlocked) return

    const unlockSound = new Audio(JUMPSCARE_SOUND_PATH)
    unlockSound.volume = 0

    unlockSound.play()
        .then(() => {
            unlockSound.pause()
            unlockSound.currentTime = 0
            audioUnlocked = true

            window.removeEventListener('pointerdown', unlockAudio)
            window.removeEventListener('keydown', unlockAudio)
        })
        .catch(() => {
            // Browser heeft audio nog niet vrijgegeven.
            // Dit probeert opnieuw bij de volgende klik/toets.
        })
}

window.addEventListener('pointerdown', unlockAudio)
window.addEventListener('keydown', unlockAudio)

export class GameOverScene extends Scene {
    onActivate() {
        this.selectedIndex = 0
        this.moveCooldown = 0
        this.isJumpscareActive = true

        this.showGameOverScreen()
    }

    onDeactivate() {
        this.removeGameOverScreen()
    }

    onPreUpdate(engine, delta) {
        if (!this.gameOverScreen || !this.endButtons) return

        // Tijdens intro/fade nog geen input
        if (this.isJumpscareActive) return

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
            this.endButtons[this.selectedIndex].click()
        }

        if (arcadeButtonPressed(engine, ARCADE_SECONDARY_BUTTONS)) {
            this.restartGame()
        }

        if (arcadeButtonPressed(engine, ARCADE_BACK_BUTTONS)) {
            this.backToMenu()
        }
    }

    showGameOverScreen() {
        this.removeGameOverScreen()

        this.isJumpscareActive = true

        this.gameOverScreen = document.createElement('section')
        this.gameOverScreen.classList.add('end-screen', 'game-over-screen')

        this.gameOverScreen.innerHTML = `
            <div class="game-over-intro">
                <h1 class="game-over-intro-title">RECLAIMED BY NATURE</h1>
            </div>

            <div class="end-overlay"></div>

            <div class="end-menu">
                <h1 class="game-over-title reclaimed-menu-title">RECLAIMED BY NATURE</h1>

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
            if (this.isJumpscareActive) return

            this.selectedIndex = 0
            this.updateSelectedButton()
            this.restartGame()
        })

        this.gameOverScreen.querySelector('#menu-button').addEventListener('click', () => {
            if (this.isJumpscareActive) return

            this.selectedIndex = 1
            this.updateSelectedButton()
            this.backToMenu()
        })

        this.keyDownHandler = (event) => {
            const key = event.key.toLowerCase()

            if (this.isJumpscareActive) {
                event.preventDefault()
                return
            }

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
        this.playJumpscareSound()

        // Na 2.5 seconden begint de fade naar het normale menu
        this.jumpscareTimer = window.setTimeout(() => {
            this.finishJumpscare()
        }, 2500)

        // Na de fade mag de speler pas kiezen
        this.inputTimer = window.setTimeout(() => {
            this.isJumpscareActive = false
        }, 4500)
    }

    playJumpscareSound() {
        this.stopJumpscareSound()

        this.jumpscareSound = new Audio(JUMPSCARE_SOUND_PATH)
        this.jumpscareSound.volume = 0.9
        this.jumpscareSound.currentTime = 0

        this.jumpscareSound.play().catch(() => {
            console.log('Audio is nog geblokkeerd. Klik of druk één keer op een toets voordat je doodgaat.')
        })
    }

    stopJumpscareSound() {
        if (this.jumpscareSound) {
            this.jumpscareSound.pause()
            this.jumpscareSound.currentTime = 0
            this.jumpscareSound = null
        }
    }

    finishJumpscare() {
        if (this.gameOverScreen) {
            this.gameOverScreen.classList.add('show-normal-game-over')
        }

        this.stopJumpscareSound()
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

        this.engine.resetLevels?.()

        this.engine.goToScene('level1')
    }

    backToMenu() {
        this.removeGameOverScreen()

        if (this.engine.player) {
            this.engine.player.resetPlayer()
        }

        this.engine.resetLevels?.()

        this.engine.goToScene('startScreen')
    }

    removeGameOverScreen() {
        if (this.jumpscareTimer) {
            clearTimeout(this.jumpscareTimer)
            this.jumpscareTimer = null
        }

        if (this.inputTimer) {
            clearTimeout(this.inputTimer)
            this.inputTimer = null
        }

        this.stopJumpscareSound()

        if (this.keyDownHandler) {
            window.removeEventListener('keydown', this.keyDownHandler)
            this.keyDownHandler = null
        }

        if (this.gameOverScreen) {
            this.gameOverScreen.remove()
            this.gameOverScreen = null
        }

        this.endButtons = null
        this.isJumpscareActive = false
    }
}