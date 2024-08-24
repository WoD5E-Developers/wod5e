/* global game */

import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveBonuses } from '../../../scripts/rolls/situational-modifiers.js'
import { potencyToRouse } from './blood-potency.js'

export const _onRouseCheck = async function (actor, item) {
  // Secondary variables
  const level = item.system.level
  const cost = item.system.cost > 0 ? item.system.cost : 1
  const selectors = ['rouse']

  // Vampires roll rouse checks
  if (actor.type === 'vampire') {
    const potency = actor.type === 'vampire' ? actor.system.blood.potency : 0
    const rouseRerolls = await potencyToRouse(potency, level)

    // Handle getting any situational modifiers
    const activeBonuses = await getActiveBonuses({
      actor,
      selectors
    })

    // Send the roll to the system
    WOD5eDice.Roll({
      advancedDice: cost + activeBonuses.totalValue,
      title: `${game.i18n.localize('WOD5E.VTM.RousingBlood')} - ${item.name}`,
      actor,
      disableBasicDice: true,
      rerollHunger: rouseRerolls,
      increaseHunger: true,
      selectors,
      quickRoll: true
    })
  } else if (actor.type === 'ghoul' && level > 1) {
    // Ghouls take aggravated damage for using powers above level 1 instead of rolling rouse checks
    const actorHealth = actor.system.health
    const actorHealthMax = actorHealth.max
    const currentAggr = actorHealth.aggravated
    let newAggr = parseInt(currentAggr) + 1

    // Make sure aggravated can't go over the max
    if (newAggr > actorHealthMax) {
      newAggr = actorHealthMax
    }

    // Update the actor with the new health
    actor.update({ 'system.health.aggravated': newAggr })
  }
}
