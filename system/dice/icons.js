import { DiceRegistry } from '../api/def/dice.js'

export const mortalDiceLocation = 'systems/wod5e/assets/icons/dice/mortal/'
export const vampireDiceLocation = 'systems/wod5e/assets/icons/dice/vampire/'
export const werewolfDiceLocation = 'systems/wod5e/assets/icons/dice/werewolf/'
export const hunterDiceLocation = 'systems/wod5e/assets/icons/dice/hunter/'

// Baseline dice variables and icon filenames
export const normalDiceFaces = {
  success: 'success.png',
  failure: 'failure.png',
  critical: 'critical.png'
}

// Splat-specific dice variables
export const hungerDiceFaces = {
  success: 'hunger-success.png',
  failure: 'hunger-failure.png',
  critical: 'hunger-critical.png',
  bestial: 'bestial-failure.png'
}
export const rageDiceFaces = {
  success: 'rage-success.png',
  failure: 'rage-failure.png',
  critical: 'rage-critical.png',
  brutal: 'brutal-failure.png'
}
export const desperationDiceFaces = {
  success: 'desperation-success.png',
  failure: 'desperation-failure.png',
  critical: 'desperation-critical.png',
  criticalFailure: 'desperation-critical-failure.png'
}

/**
 * Basic dice
 */
DiceRegistry.registerBasic('mortal', {
  imgRoot: mortalDiceLocation,
  faces: normalDiceFaces,
  css: 'mortal-dice'
})

DiceRegistry.registerBasic('vampire', {
  imgRoot: vampireDiceLocation,
  faces: normalDiceFaces,
  css: 'vampire-dice'
})

DiceRegistry.registerBasic('werewolf', {
  imgRoot: werewolfDiceLocation,
  faces: normalDiceFaces,
  css: 'werewolf-dice'
})

DiceRegistry.registerBasic('hunter', {
  imgRoot: hunterDiceLocation,
  faces: normalDiceFaces,
  css: 'hunter-dice'
})

/**
 * Advanced dice
 */
DiceRegistry.registerAdvanced('vampire', {
  imgRoot: vampireDiceLocation,
  faces: hungerDiceFaces,
  css: 'hunger-dice',
  resultMap: (num) => {
    if (num === 10) return 'critical'
    if (num > 5) return 'success'
    if (num > 1) return 'failure'
    return 'bestial'
  }
})

DiceRegistry.registerAdvanced('werewolf', {
  imgRoot: werewolfDiceLocation,
  faces: rageDiceFaces,
  css: 'rage-dice',
  resultMap: (num) => {
    if (num === 10) return 'critical'
    if (num > 5) return 'success'
    if (num > 2) return 'failure'
    return 'brutal'
  }
})

DiceRegistry.registerAdvanced('hunter', {
  imgRoot: hunterDiceLocation,
  faces: desperationDiceFaces,
  css: 'desperation-dice',
  resultMap: (num) => {
    if (num === 10) return 'critical'
    if (num > 5) return 'success'
    if (num > 1) return 'failure'
    return 'criticalFailure'
  }
})
