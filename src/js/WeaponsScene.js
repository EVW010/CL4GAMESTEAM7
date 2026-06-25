import { Scene } from 'excalibur'
import {
    arcadeAxisY,
    arcadeButtonPressed,
    ARCADE_MENU_BUTTONS,
    ARCADE_BACK_BUTTONS
} from '../arcade-controls.js'

export class WeaponsScene extends Scene {
    onActivate() {
        this.selectedWeaponIndex = 0
        this.moveCooldown = 0
        this.showWeaponsScreen()
    }

    onDeactivate() {
        this.removeWeaponsScreen()
    }

    onPreUpdate(engine, delta) {
        if (!this.weaponsScreen || !this.weaponButtons) return

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

        // Arcade knop / start knop = geselecteerde wapen openen
        if (arcadeButtonPressed(engine, ARCADE_MENU_BUTTONS)) {
            this.weaponButtons[this.selectedWeaponIndex].click()
        }

        // Back knop = terug naar startscherm
        if (arcadeButtonPressed(engine, ARCADE_BACK_BUTTONS)) {
            this.goBackToStart()
        }
    }

    showWeaponsScreen() {
        this.removeWeaponsScreen()

        this.weapons = [
            {
                name: 'Placeholder Weapon 01',
                icon: 'W1',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dit is placeholder tekst voor hoe dit wapen werkt.',
                usage: 'Lorem ipsum: gebruik dit wapen door te richten, te schieten en afstand te houden van vijanden.'
            },
            {
                name: 'Placeholder Weapon 02',
                icon: 'W2',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dit wapen heeft nu nog geen echte gameplay functie.',
                usage: 'Lorem ipsum: dit wapen wordt later gebruikt als sneller of sterker wapen in de game.'
            },
            {
                name: 'Placeholder Weapon 03',
                icon: 'W3',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Hier komt later informatie over bereik en schade.',
                usage: 'Lorem ipsum: dit wapen gebruik je later mogelijk voor vijanden op langere afstand.'
            },
            {
                name: 'Placeholder Weapon 04',
                icon: 'W4',
                text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dit is placeholder tekst voor een speciaal wapen.',
                usage: 'Lorem ipsum: dit wapen krijgt later misschien een speciale aanval of effect.'
            }
        ]

        this.weaponsScreen = document.createElement('section')
        this.weaponsScreen.classList.add('weapons-screen')

        this.weaponsScreen.innerHTML = `
            <div class="retro-overlay"></div>

            <div class="weapons-menu">
                <p class="game-label">Team 7</p>

                <h1 class="weapons-title">Weapon Encyclopedia</h1>

                <p class="weapons-text">
                    Klik op een wapen icoon om te lezen hoe het wapen werkt.
                </p>

                <div class="weapon-grid">
                    ${this.weapons.map((weapon, index) => `
                        <button class="weapon-card ${index === 0 ? 'selected' : ''}" data-index="${index}">
                            <span class="weapon-icon">${weapon.icon}</span>
                            <span class="weapon-name">${weapon.name}</span>
                        </button>
                    `).join('')}
                </div>

                <div id="weapon-info-box" class="weapon-info-box">
                    <p><strong>Weapon Encyclopedia</strong></p>
                    <p>Klik op een van de 4 placeholder wapens om informatie te bekijken.</p>
                    <p>Alle namen en teksten zijn nu nog placeholder.</p>
                </div>

                <button id="back-button" class="back-button">
                    Back To Start
                </button>

                <p class="enter-text">
                    Enter / arcade knop = selecteren | Escape = terug
                </p>
            </div>
        `

        document.body.appendChild(this.weaponsScreen)

        this.weaponButtons = [...this.weaponsScreen.querySelectorAll('.weapon-card')]
        this.weaponInfoBox = this.weaponsScreen.querySelector('#weapon-info-box')
        this.backButton = this.weaponsScreen.querySelector('#back-button')

        this.weaponButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const weaponIndex = Number(button.dataset.index)

                this.selectedWeaponIndex = weaponIndex
                this.updateSelectedWeapon()
                this.showWeaponInfo(this.weapons[weaponIndex])
            })
        })

        this.backButton.addEventListener('click', () => {
            this.goBackToStart()
        })

        this.keyDownHandler = (event) => {
            const key = event.key.toLowerCase()

            if (
                event.key === 'ArrowDown' ||
                event.key === 'ArrowRight' ||
                key === 's' ||
                key === 'd'
            ) {
                event.preventDefault()
                this.moveDown()
            }

            if (
                event.key === 'ArrowUp' ||
                event.key === 'ArrowLeft' ||
                key === 'w' ||
                key === 'a'
            ) {
                event.preventDefault()
                this.moveUp()
            }

            if (event.key === 'Enter') {
                event.preventDefault()
                this.weaponButtons[this.selectedWeaponIndex].click()
            }

            if (event.key === 'Escape') {
                event.preventDefault()
                this.goBackToStart()
            }
        }

        window.addEventListener('keydown', this.keyDownHandler)

        this.updateSelectedWeapon()
    }

    moveDown() {
        this.selectedWeaponIndex++

        if (this.selectedWeaponIndex >= this.weaponButtons.length) {
            this.selectedWeaponIndex = 0
        }

        this.updateSelectedWeapon()
    }

    moveUp() {
        this.selectedWeaponIndex--

        if (this.selectedWeaponIndex < 0) {
            this.selectedWeaponIndex = this.weaponButtons.length - 1
        }

        this.updateSelectedWeapon()
    }

    updateSelectedWeapon() {
        if (!this.weaponButtons) return

        this.weaponButtons.forEach((button) => {
            button.classList.remove('selected')
        })

        this.weaponButtons[this.selectedWeaponIndex].classList.add('selected')
    }

    showWeaponInfo(weapon) {
        this.weaponInfoBox.innerHTML = `
            <p><strong>${weapon.name}</strong></p>

            <p><strong>Weapon text:</strong></p>
            <p>${weapon.text}</p>

            <p><strong>How to use:</strong></p>
            <p>${weapon.usage}</p>

            <p><strong>Status:</strong> Placeholder</p>
        `
    }

    goBackToStart() {
        this.removeWeaponsScreen()
        this.engine.goToScene('startScreen')
    }

    removeWeaponsScreen() {
        if (this.keyDownHandler) {
            window.removeEventListener('keydown', this.keyDownHandler)
            this.keyDownHandler = null
        }

        if (this.weaponsScreen) {
            this.weaponsScreen.remove()
            this.weaponsScreen = null
        }

        this.weapons = null
        this.weaponButtons = null
        this.weaponInfoBox = null
        this.backButton = null
    }
}