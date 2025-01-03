/* global game */

import { getBaseLabel } from './base-labels.js'

export const getChangelingLabel = async function (data) {
  const difficultySet = data.difficulty > 0
  const labelData = {
    showTotalAndDifficulty: true,
    labelClass: '',
    labelText: ''
  }

  // Handle wyrd criticals (when no difficulty is set)
  if (data.advancedDice?.criticals > 1 || (data.basicDice?.criticals > 0 && data.advancedDice?.criticals > 0)) {
    // Handle wyrd criticals
    Object.assign(labelData, getWyrdCriticalLabel(data, difficultySet))
  } else if (data.advancedDice?.critFails > 0 && (!difficultySet || data.totalResult < data.difficult)) {
    // Handle wyrd failures
    Object.assign(labelData, getWyrdFailureLabel(data, difficultySet))
  } else {
    // Default to just using the basic label generator if we don't have any splat-specific exceptions
    Object.assign(labelData, await getBaseLabel(data, difficultySet))
  }

  // Return the data we've obtained
  return labelData
}

// Handle wyrd critical conditions
function getWyrdCriticalLabel (data, difficultySet) {
  let labelClass, labelText

  if (difficultySet) { // Wyrd critical
    labelClass = 'wyrd-critical'
    labelText = game.i18n.localize('WOD5E.CTD.WyrdCritical')
  } else { // Possible wyrd critical
    labelClass = 'wyrd-critical'
    labelText = game.i18n.localize('WOD5E.CTD.PossibleWyrdCritical')
  }

  return {
    labelClass,
    labelText
  }
}

// Handle wyrd failure conditions
function getWyrdFailureLabel (data, difficultySet) {
  let labelClass, labelText

  if (difficultySet) { // Wyrd failure
    labelClass = 'wyrd-failure'
    labelText = game.i18n.localize('WOD5E.CTD.WyrdFailure')
  } else { // Possible wyrd failure
    labelClass = 'wyrd-failure'
    labelText = game.i18n.localize('WOD5E.VTM.PossibleWyrdFailure')
  }

  return {
    labelClass,
    labelText
  }
}
