import { Axes, Buttons } from 'excalibur'

const DEADZONE = 0.25

export const ARCADE_ACTION_BUTTONS = [
    Buttons.Face1,
    Buttons.Face2,
    Buttons.Face3,
    Buttons.Face4
]

export const ARCADE_MENU_BUTTONS = [
    Buttons.Start,
    Buttons.Face1
]

export const ARCADE_SECONDARY_BUTTONS = [
    Buttons.Face2,
    Buttons.Face3
]

export const ARCADE_BACK_BUTTONS = [
    Buttons.Select,
    Buttons.Face4
]

export function getArcadeGamepad(engine) {
    return engine.mygamepad ?? null
}

function applyDeadzone(value) {
    return Math.abs(value) > DEADZONE ? value : 0
}

export function arcadeAxisX(engine) {
    const gamepad = getArcadeGamepad(engine)
    if (!gamepad) return 0

    let x = applyDeadzone(gamepad.getAxes(Axes.LeftStickX))

    // Sommige arcade sticks werken als D-pad in plaats van left stick.
    if (gamepad.isButtonHeld(Buttons.DpadLeft)) {
        x = -1
    }

    if (gamepad.isButtonHeld(Buttons.DpadRight)) {
        x = 1
    }

    return x
}

export function arcadeAxisY(engine) {
    const gamepad = getArcadeGamepad(engine)
    if (!gamepad) return 0

    let y = applyDeadzone(gamepad.getAxes(Axes.LeftStickY))

    // Up is bij gamepads meestal negatief, down positief.
    if (gamepad.isButtonHeld(Buttons.DpadUp)) {
        y = -1
    }

    if (gamepad.isButtonHeld(Buttons.DpadDown)) {
        y = 1
    }

    return y
}

export function arcadeButtonPressed(engine, buttons) {
    const gamepad = getArcadeGamepad(engine)
    if (!gamepad) return false

    return buttons.some((button) => gamepad.wasButtonPressed(button))
}