import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'
import { WOD5eDice } from '../../../scripts/system-rolls.js'

/** Handle rolling a remorse check */
export const _onRemorseRoll = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const humanity = actor.system.humanity.value
  const stains = actor.system.humanity.stains
  const selectors = ['humanity']

  // Handle getting any situational modifiers
  const activeModifiers = await getActiveModifiers({
    actor,
    selectors
  })
  // Dicepool is 10, minus humanity, minus any stains the actor has, and then apply active modifiers.
  // Minimum of 1 dice on a Remorse roll
  const dicePool = Math.max(10 - humanity - stains + activeModifiers.totalValue, 1)

  WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.VTM.RollingRemorse'),
    selectors,
    actor,
    data: actor.system,
    disableAdvancedDice: true,
    callback: async (err, rollData) => {
      if (err) console.log('World of Darkness 5e | ' + err)

      const hasSuccess = rollData.terms[0].results.some((result) => result.success)

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
            wod5e: {
              name: game.i18n.localize('WOD5E.VTM.RemorseFailed'),
              img: 'systems/wod5e/assets/icons/dice/vampire/bestial-failure.png',
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
