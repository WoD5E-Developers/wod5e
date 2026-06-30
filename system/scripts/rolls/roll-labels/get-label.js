import { getHunterLabel } from './hunter-labels.js'
import { getBaseLabel } from './base-labels.js'
import { getVampireLabel } from './vampire-labels.js'
import { getWerewolfLabel } from './werewolf-labels.js'
import { getMageLabel } from './mage-labels.js'

export const getRollFooter = async function (system, data) {
  const labelData = await getLabel(system, data)
  const resultText = labelData.labelText

  return { labelData, resultText }
}

export const getLabel = async function (system, data) {
  // Return label depending on the system
  switch (system) {
    // Vampire results
    case 'vampire':
      return await getVampireLabel(data)

    // Hunter results
    case 'hunter':
      return await getHunterLabel(data)

    // Werewolf results
    case 'werewolf':
      return await getWerewolfLabel(data)

    // Mage results
    case 'mage':
      return await getMageLabel(data)

    // Default to a "base"
    default:
      return await getBaseLabel(data)
  }
}
