import { WOD5eDice } from '../../scripts/system-rolls.js'

export const _onWillpowerRoll = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const dicePool = Math.max(getWillpowerDicePool(actor), 1)

  WOD5eDice.Roll({
    basicDice: dicePool,
    title: game.i18n.localize('WOD5E.Chat.RollingWillpower'),
    selectors: ['willpower'],
    actor,
    data: actor.system,
    quickRoll: false,
    disableAdvancedDice: true
  })
}

// Calculate the dice for a Willpower roll
function getWillpowerDicePool(actor) {
  const willpowerMax = actor.system.willpower.max
  const willpowerAgg = actor.system.willpower.aggravated
  const willpowerSup = actor.system.willpower.superficial

  return Math.max(willpowerMax - willpowerAgg - willpowerSup, 0)
}
