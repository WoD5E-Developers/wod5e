/* global game, foundry */

import { WOD5eDice } from '../../../scripts/system-rolls.js'

/** Handle rolling a remorse check */
export const _onRemorseRoll = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const humanity = actor.system.humanity.value
  const stain = actor.system.humanity.stains
  const dicePool = Math.max((10 - humanity - stain), 1)

  WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.VTM.RollingRemorse'),
    selectors: ['humanity'],
    actor,
    data: actor.system,
    quickRoll: true,
    disableAdvancedDice: true,
    callback: async (err, rollData) => {
      if (err) console.log('World of Darkness 5e | ' + err)

      const hasSuccess = rollData.terms[0].results.some(result => result.success)

      // Reduce humanity by 1 if the roll fails, otherwise reset stain to 0 in any other cases
      if (hasSuccess) {
        await actor.update({ 'system.humanity.stains': 0 })
      } else {
        await actor.update({
          'system.humanity.value': Math.max(humanity - 1, 0),
          'system.humanity.stains': 0
        })

        foundry.documents.ChatMessage.implementation.create({
          flags: {
            vtm5e: {
              name: game.i18n.localize('WOD5E.VTM.RemorseFailed'),
              img: 'systems/vtm5e/assets/icons/dice/vampire/bestial-failure.png',
              description: game.i18n.format('WOD5E.VTM.RemorseFailedDescription', {
                actor: actor.name
              })
            }
          }
        })
      }
    }
  })
}
