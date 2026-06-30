/**
 * Mage: the Ascension dice
 *
 * Basic die  (p) — MageDie        — normal WoD10 faces, purple theme
 * Advanced die (x) — ParadoxDie   — replaces basic dice up to the pool max
 *                                   like Hunger in V5, but with MtA outcomes:
 *
 * Spellcasting roll:
 *   1   → Paradox Failure   (like Bestial Failure)
 *   2–5 → Failure
 *   6–9 → Success
 *   10  → Paradox Critical  (like Messy Critical — part of a critical win)
 *
 * Skill-test roll (non-spellcasting):
 *   1   → Weird Failure     (like Bestial Failure)
 *   2–5 → Failure
 *   6–9 → Success
 *   10  → Weird Critical    (like Messy Critical)
 *
 * Paradox Dice can NEVER be rerolled with Willpower.
 * The face images reuse the vampire dice assets as a placeholder until
 * custom MtA assets are added. Swap the paths in mageDiceLocation below.
 */

import { WOD5eDie } from './splat-dice.js'
import { DiceRegistry } from '../api/def/dice.js'

// ── Asset paths ──────────────────────────────────────────────────────────────
// Point these at your own MtA art when you have it.
// For now they reuse the mortal (basic) and hunger (advanced) vampire icons
// so the dice show up correctly out of the box.
export const mageDiceLocation    = 'systems/wod5e/assets/icons/dice/mortal/'
export const paradoxDiceLocation = 'systems/wod5e/assets/icons/dice/vampire/'

export const mageDiceFaces = {
  success: 'success.png',
  failure: 'failure.png',
  critical: 'critical.png'
}

export const paradoxDiceFaces = {
  // Spellcasting labels (used in roll results)
  paradoxFailure:   'bestial-failure.png',   // 1 on spellcasting
  failure:          'hunger-failure.png',     // 2–5
  success:          'hunger-success.png',     // 6–9
  paradoxCritical:  'hunger-critical.png',    // 10 on spellcasting
  // Weird (skill-test) labels share the same images for now
  weirdFailure:     'bestial-failure.png',    // 1 on skill test
  weirdCritical:    'hunger-critical.png'     // 10 on skill test
}

// ── Basic Mage die (p) ───────────────────────────────────────────────────────
export class MageDie extends WOD5eDie {
  static GAME_SYSTEM = 'mage'
  static DIE_TYPE    = 'basic'
  static DENOMINATION = 'p'

  /** @override */
  static getResultLabel(result) {
    return {
      1:  `<img src="${mageDiceLocation}${mageDiceFaces.failure}" />`,
      2:  `<img src="${mageDiceLocation}${mageDiceFaces.failure}" />`,
      3:  `<img src="${mageDiceLocation}${mageDiceFaces.failure}" />`,
      4:  `<img src="${mageDiceLocation}${mageDiceFaces.failure}" />`,
      5:  `<img src="${mageDiceLocation}${mageDiceFaces.failure}" />`,
      6:  `<img src="${mageDiceLocation}${mageDiceFaces.success}" />`,
      7:  `<img src="${mageDiceLocation}${mageDiceFaces.success}" />`,
      8:  `<img src="${mageDiceLocation}${mageDiceFaces.success}" />`,
      9:  `<img src="${mageDiceLocation}${mageDiceFaces.success}" />`,
      10: `<img src="${mageDiceLocation}${mageDiceFaces.critical}" />`
    }[result]
  }
}

// ── Advanced Paradox die (x) ─────────────────────────────────────────────────
// isSpellcasting is stamped onto results via the roll formula context;
// both outcomes use the same images for now — only the CSS class and
// the chat-message flavour text differ.
export class ParadoxDie extends WOD5eDie {
  static GAME_SYSTEM  = 'mage'
  static DIE_TYPE     = 'advanced'
  static DENOMINATION = 'x'

  // Paradox dice cannot be re-rolled by Willpower — flag read by the reroll handler
  static NO_WILLPOWER_REROLL = true

  /** @override */
  static getResultLabel(result) {
    return {
      1:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.paradoxFailure}" />`,
      2:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.failure}" />`,
      3:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.failure}" />`,
      4:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.failure}" />`,
      5:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.failure}" />`,
      6:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.success}" />`,
      7:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.success}" />`,
      8:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.success}" />`,
      9:  `<img src="${paradoxDiceLocation}${paradoxDiceFaces.success}" />`,
      10: `<img src="${paradoxDiceLocation}${paradoxDiceFaces.paradoxCritical}" />`
    }[result]
  }
}

// ── Register with DiceRegistry (same pattern as icons.js) ───────────────────

DiceRegistry.registerBasic('mage', {
  imgRoot: mageDiceLocation,
  faces: mageDiceFaces,
  css: 'mage-dice'
})

DiceRegistry.registerAdvanced('mage', {
  imgRoot: paradoxDiceLocation,
  faces: paradoxDiceFaces,
  css: 'paradox-dice',
  noWillpowerReroll: true,   // read by reroll handler
  resultMap: (num) => {
    if (num === 10) return 'paradoxCritical'   // or 'weirdCritical' — determined at chat render
    if (num > 5)   return 'success'
    if (num > 1)   return 'failure'
    return 'paradoxFailure'                    // or 'weirdFailure'
  }
})
