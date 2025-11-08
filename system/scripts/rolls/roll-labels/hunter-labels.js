/* global game */

import { getBaseLabel } from './base-labels.js'

export const getHunterLabel = async function (data) {
  const difficultySet = data.difficulty > 0
  const labelData = {
    showTotalAndDifficulty: true,
    labelClass: '',
    labelText: ''
  }

  // Handle desperation failures
  if (data.advancedDice?.critFails > 0) {
    Object.assign(labelData, getDesperationLabel(data, difficultySet))
  } else {
    // Default to just using the basic label generator if we don't have any splat-specific exceptions
    Object.assign(labelData, await getBaseLabel(data))
  }

  // Return the data we've obtained
  return labelData
}

// Handle desperation conditions
function getDesperationLabel(data, difficultySet) {
  let labelClass, labelText

  if (difficultySet && data.totalResult < data.difficulty) {
    // Despair on a failure
    labelClass = 'desperation-failure'
    labelText = game.i18n.localize('WOD5E.HTR.Despair')
  } else if (difficultySet && data.totalResult >= data.difficulty) {
    // Desperation success
    labelClass = 'desperation-success'
    labelText = game.i18n.localize('WOD5E.HTR.DesperationSuccess')
  } else {
    // Possible desperation failure
    labelClass = 'desperation-failure'
    labelText = game.i18n.localize('WOD5E.HTR.PossibleDesperationFailure')
  }

  return {
    labelClass,
    labelText
  }
}
