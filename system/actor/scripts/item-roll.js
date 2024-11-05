/* global fromUuidSync, WOD5E */

import { WOD5eDice } from '../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../scripts/rolls/situational-modifiers.js'
import { _onRouseCheck } from '../vtm/scripts/rouse.js'
import { _onGiftCost } from '../wta/scripts/gifts.js'

/**
 * Proxy for transforming data from a data action into data we can use to roll with
*/
export const _onRollItem = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const item = fromUuidSync(target.getAttribute('data-item-uuid'))

  _rollItem(actor, item)
}

/**
   * Handle rolling dicepools from items
*/
export const _rollItem = async function (actor, item) {
  // Secondary data
  const actorData = actor.system
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
  const flavor = itemData?.description || ''
  const flatMod = itemData?.modifier || 0
  const macro = itemData.macroid
  let selectors = []

  // Variables yet to be defined
  let basicDice, advancedDice

  // Iterate through the dicepool and add to valuePaths and selectors as needed
  for (const dice in dicepool) {
    const splitPath = dicepool[dice]?.path?.split('.')
    // Push each of the individual sub-selectors
    selectors = selectors.concat(splitPath)

    // Push the full selector
    selectors.push(dicepool[dice]?.path)

    // Push the value path
    valuePaths.push(`${dicepool[dice].path}.value`)
  }

  // Add despair to the selectors if the Hunter is in despair
  if (actor.type === 'hunter' && actor.system.despair.value === 1) {
    selectors.push('despair')
  }

  // Some checks for selectors we may need to apply based on the item type
  if (item.type === 'power') {
    selectors.push('disciplines')
    selectors.push(`disciplines.${itemData.discipline}`)
  }

  if (item.type === 'edgepool') {
    selectors.push('edges')
    selectors.push(`edges.${itemData.edge}`)
  }

  if (item.type === 'gift') {
    selectors.push('gifts')
    selectors.push(`gifts.${itemData.giftType}`)
  }

  // Handle getting any situational modifiers
  const activeModifiers = await getActiveModifiers({
    actor,
    selectors
  })
  const advancedCheckDice = activeModifiers.totalACDValue

  // Get the number of basicDice and advancedDice
  basicDice = await WOD5E.api.getBasicDice({ valuePaths, flatMod: flatMod + activeModifiers.totalValue, actor })
  advancedDice = disableAdvancedDice ? 0 : await WOD5E.api.getAdvancedDice({ actor })

  // Define the actor's gamesystem, defaulting to "mortal" if it's not in the systems list
  const system = actorData.gamesystem

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
    callback: async (err, roll) => {
      if (err) console.log(err)

      if (system === 'vampire' && itemData.cost > 0) {
        _onRouseCheck(actor, item, roll.rollMode)
      } else if (system === 'werewolf' && (itemData.cost > 0 || itemData.willpowercost > 0)) {
        _onGiftCost(actor, item, roll.rollMode)
      }
    }
  })
}
