/* global game */

import { getBaseLabel } from './base-labels.js'

export const getWerewolfLabel = async function (data) {
  const difficultySet = data.difficulty > 0
  const labelData = {
    showTotalAndDifficulty: true,
    labelClass: '',
    labelText: ''
  }

  // Handle potential brutal outcomes (when no difficulty is set)
  if (!difficultySet && data.advancedDice.critFails > 1) {
    Object.assign(labelData, getBrutalOutcomeLabel())
  } else {
    // Default to just using the basic label generator if we don't have any splat-specific exceptions
    Object.assign(labelData, await getBaseLabel(data))
  }

  // Return the data we've obtained
  return labelData
}

// Handle brutal outcome conditions
function getBrutalOutcomeLabel () {
  const labelClass = 'rage-failure'
  const labelText = game.i18n.localize('WOD5E.WTA.PossibleRageFailure')

  return {
    labelClass,
    labelText
  }
}
