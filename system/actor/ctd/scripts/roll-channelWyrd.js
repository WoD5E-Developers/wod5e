/* global game */

import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'

export const _onChannelWyrd = async function (actor, item, rollMode) {
  // Secondary variables
  const cost = 1
  const willpowerCost = 0
  let selectors = []

  // Apply rollMode from chat if none is set
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  // If we're rolling no rage nightmare and
  if (cost < 1 && willpowerCost > 0) {
    _damageWillpower(null, null, actor, willpowerCost, rollMode)
  } else if (cost > 0 && willpowerCost > 0) {
    selectors = ['nightmare']

    // Handle getting any situational modifiers
    const activeModifiers = await getActiveModifiers({
      actor,
      selectors
    })

    // Send the roll to the system
    WOD5eDice.Roll({
      advancedDice: cost + activeModifiers.totalValue,
      title: `${game.i18n.localize('WOD5E.CTD.NightmareDice')} - ${item.name}`,
      actor,
      rollMode,
      disableBasicDice: true,
      increaseNightmare: true,
      selectors,
      quickRoll: true,
      willpowerDamage: willpowerCost
    })
  }
}
