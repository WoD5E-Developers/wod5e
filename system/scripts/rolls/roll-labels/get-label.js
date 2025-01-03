import { getHunterLabel } from './hunter-labels.js'
import { getBaseLabel } from './base-labels.js'
import { getVampireLabel } from './vampire-labels.js'
import { getWerewolfLabel } from './werewolf-labels.js'
import { getChangelingLabel } from './changeling-labels.js'

export const getRollFooter = async function (system, data) {
  const labelData = await getLabel(system, data)

  // Construct the resultLabel from labelClass and labelText
  const resultLabel = `<div class="roll-result-label ${labelData.labelClass}">${labelData.labelText}</div>`

  // Combine the totalAndDifficulty element with the resultLabel element
  if (labelData.showTotalAndDifficulty) return data.totalAndDifficulty + resultLabel

  // Otherwise, just return the resultLabel
  return resultLabel
}

export const getLabel = async function (system, data) {
  // Return label depending on the system
  switch (system) {
    // Vampire results
    case 'vampire':
      return await getVampireLabel(data)

    case 'changeling':
      return await getChangelingLabel(data)

    // Hunter results
    case 'hunter':
      return await getHunterLabel(data)

    // Werewolf results
    case 'werewolf':
      return await getWerewolfLabel(data)

    // Default to a "base"
    default:
      return await getBaseLabel(data)
  }
}
