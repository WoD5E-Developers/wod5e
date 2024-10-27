/* global game, foundry */

import { WOD5eDice } from '../../../scripts/system-rolls.js'

/** Handle rolling for a frenzy check */
export const _onFrenzyRoll = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Check whether the player wants to skip the check and go straight into Frenzy
  const doFrenzyRoll = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize('WOD5E.VTM.ResistingFrenzy')
    },
    content: game.i18n.localize('WOD5E.VTM.FrenzyChoiceResistOrGiveIn'),
    modal: true,
    buttons: [
      {
        label: game.i18n.localize('WOD5E.ItemsList.Resist'),
        action: true
      },
      {
        label: game.i18n.localize('WOD5E.VTM.GiveIn'),
        action: false
      }
    ]
  })

  if (doFrenzyRoll) {
    const willpowerDicePool = getWillpowerDicePool(actor)
    const humanity = actor.system.humanity.value
    const dicePool = Math.max(willpowerDicePool + Math.floor(humanity / 3), 1)

    WOD5eDice.Roll({
      basicDice: dicePool,
      title: game.i18n.localize('WOD5E.VTM.ResistingFrenzy'),
      actor,
      data: actor.system,
      disableAdvancedDice: true,
      callback: async (err, result) => {
        if (err) console.log(err)

        if (!result.rollSuccessful) {
          actor.update({ 'system.frenzyActive': true })
        }
      }
    })
  } else {
    // Automatically enter frenzy
    actor.update({ 'system.frenzyActive': true })
  }
}

// Calculate the dice for a Willpower roll
function getWillpowerDicePool (actor) {
  const willpowerMax = actor.system.willpower.max
  const willpowerAgg = actor.system.willpower.aggravated
  const willpowerSup = actor.system.willpower.superficial

  return Math.max((willpowerMax - willpowerAgg - willpowerSup), 0)
}
