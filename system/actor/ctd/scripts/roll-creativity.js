/* global game, renderTemplate, ChatMessage */

import { WOD5eDice } from '../../../scripts/system-rolls.js'

/** Handle rolling a creativity check */
export const _onCreativityRoll = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const wyrd = actor.system.wyrd.value
  const banality = actor.system.wyrd.banality
  const dicePool = Math.max((10 - wyrd - banality), 1)

  WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.CTD.RollingCreativity'),
    selectors: ['wyrd'],
    actor,
    data: actor.system,
    quickRoll: true,
    disableAdvancedDice: true,
    callback: async (err, rollData) => {
      if (err) console.log(err)

      const hasSuccess = rollData.terms[0].results.some(result => result.success)

      // Reduce wyrd by 1 if the roll fails, otherwise reset banality to 0 in any other cases
      if (hasSuccess) {
        await actor.update({ 'system.wyrd.banality': 0 })
      } else {
        await actor.update({ 'system.wyrd.value': Math.max(wyrd - 1, 0) })
        await actor.update({ 'system.wyrd.banality': 0 })

        await renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
          name: game.i18n.localize('WOD5E.CTD.CreativityFailed'),
          img: 'systems/vtm5ec/assets/icons/dice/changeling/panic-failure.png',
          description: game.i18n.format('WOD5E.CTD.CreativityFailedDescription', {
            actor: actor.name
          })
        }).then(html => {
          const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
          ChatMessage.create(message)
        })
      }
    }
  })
}
