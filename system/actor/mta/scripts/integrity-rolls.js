import { WOD5eDice } from '../../../scripts/system-rolls.js'

/**
 * Hubris roll. Dice pool = current Hubris value (minimum 1 if 0).
 * Plain pool roll — no Paradox-die replacement.
 */
export const _onHubrisRoll = async function (event) {
  event.preventDefault()

  const actor     = this.actor
  const actorData = actor.system
  const pool = Math.max(1, actorData.hubris.value ?? 0)

  await WOD5eDice.Roll({
    basicDice: pool,
    actor,
    data: actorData,
    title: game.i18n.localize('WOD5E.MTA.HubrisRollTitle'),
    selectors: ['hubris'],
    system: 'mortal',
    disableAdvancedDice: true,
    quickRoll: true
  })
}

/**
 * Quiet roll. Dice pool = current Quiet value (minimum 1 if 0).
 * Plain pool roll — no Paradox-die replacement.
 */
export const _onQuietRoll = async function (event) {
  event.preventDefault()

  const actor     = this.actor
  const actorData = actor.system
  const pool = Math.max(1, actorData.quiet.value ?? 0)

  await WOD5eDice.Roll({
    basicDice: pool,
    actor,
    data: actorData,
    title: game.i18n.localize('WOD5E.MTA.QuietRollTitle'),
    selectors: ['quiet'],
    system: 'mortal',
    disableAdvancedDice: true,
    quickRoll: true
  })
}
