/* global game */

import { WOD5eDice } from '../../../scripts/system-rolls.js'

export const _onHaranoRoll = async function (actor, event) {
  event.preventDefault()

  const harano = actor.system.balance.harano.value
  const hauglosk = actor.system.balance.hauglosk.value

  const dicePool = Math.max((harano + hauglosk), 1)

  WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.WTA.HaranoTest'),
    actor,
    data: actor.system,
    quickRoll: false,
    disableAdvancedDice: true
  })
}

export const _onHaugloskRoll = async function (actor, event) {
  event.preventDefault()

  const harano = actor.system.balance.harano.value
  const hauglosk = actor.system.balance.hauglosk.value

  const dicePool = Math.max((harano + hauglosk), 1)

  WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.WTA.HaugloskTest'),
    actor,
    data: actor.system,
    quickRoll: false,
    disableAdvancedDice: true
  })
}
