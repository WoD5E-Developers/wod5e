/* global fromUuidSync, WOD5E */

import { WOD5eDice } from '../../scripts/system-rolls.js'
import { getActiveBonuses } from '../../scripts/rolls/situational-modifiers.js'
import { _onRouseCheck } from '../vtm/scripts/rouse.js'
import { _onGiftCost } from '../wta/scripts/gifts.js'

/**
   * Handle rolling dicepools from items
*/
export const _onRollItem = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const item = fromUuidSync(target.getAttribute('data-item-uuid'))

  // Secondary data
  const actorData = this.actor.system
  const itemData = item.system
  const dicepool = itemData.dicepool

  // Define these variables to help construct the roll
  const willpowerDamage = 0
  const difficulty = 0
  const disableBasicDice = false
  const disableAdvancedDice = false
  const quickRoll = false
  const rerollHunger = false
  const valuePaths = []
  const increaseHunger = false
  const decreaseRage = false
  const title = item.name
  const flavor = itemData.description
  const flatMod = 0
  const macro = itemData.macroid
  const selectors = []

  // Variables yet to be defined
  let basicDice, advancedDice

  // Iterate through the dicepool and add to valuePaths
  for (const dice in dicepool) {
    valuePaths.push(`${dicepool[dice].path}.value`)
  }

  // Handle getting any situational modifiers
  const activeBonuses = await getActiveBonuses({
    actor,
    selectors
  })
  const advancedCheckDice = activeBonuses.totalACDValue

  // Get the number of basicDice and advancedDice
  basicDice = await WOD5E.api.getBasicDice({ valuePaths, flatMod: flatMod + activeBonuses.totalValue, actor })
  advancedDice = disableAdvancedDice ? 0 : await WOD5E.api.getAdvancedDice({ actor })

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actorData.gamesystem in WOD5E.Systems.getList({}) ? actorData.gamesystem : 'mortal'

  // Some quick modifications to vampire and werewolf rolls
  // in order to properly display the dice in the dialog window
  if (!disableBasicDice) {
    if (system === 'vampire') {
      // Ensure that the number of hunger dice doesn't exceed the
      // total number of dice, unless it's a rouse check that needs
      // rerolls, which requires twice the number of normal hunger
      // dice and only the highest will be kept
      advancedDice = rerollHunger ? advancedDice * 2 : Math.min(basicDice, advancedDice)

      // Calculate the number of normal dice to roll by subtracting
      // the number of hunger dice from them, minimum zero
      basicDice = Math.max(basicDice - advancedDice, 0)
    } else if (system === 'werewolf') {
      // Ensure that the number of rage dice doesn't exceed the
      // total number of dice
      advancedDice = Math.min(basicDice, advancedDice)

      // Calculate the number of normal dice to roll by subtracting
      // the number of rage dice from them, minimum zero
      basicDice = Math.max(basicDice - advancedDice, 0)
    }
  }

  // Send the roll to the system
  WOD5eDice.Roll({
    basicDice,
    advancedDice,
    actor,
    data: actorData,
    title,
    disableBasicDice,
    disableAdvancedDice,
    willpowerDamage,
    difficulty,
    flavor,
    quickRoll,
    rerollHunger,
    increaseHunger,
    decreaseRage,
    selectors,
    macro,
    advancedCheckDice,
    callback: async () => {
      if (system === 'vampire' && itemData.cost > 0) {
        _onRouseCheck(actor, item)
      } else if (system === 'werewolf' && (itemData.cost > 0 || itemData.willpowercost > 0)) {
        _onGiftCost(actor, item)
      }
    }
  })
}
