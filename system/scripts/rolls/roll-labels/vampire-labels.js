import { getBaseLabel } from './base-labels.js'

export const getVampireLabel = async function (data) {
  const difficultySet = data.difficulty > 0
  const labelData = {
    showTotalAndDifficulty: true,
    labelClass: '',
    labelText: ''
  }

  // Handle messy criticals (when no difficulty is set)
  if (
    data.advancedDice?.criticals > 1 ||
    (data.basicDice?.criticals > 0 && data.advancedDice?.criticals > 0)
  ) {
    // Handle messy criticals
    Object.assign(labelData, getMessyCriticalLabel(data, difficultySet))
  } else if (
    data.advancedDice?.critFails > 0 &&
    (!difficultySet || data.totalResult < data.difficulty)
  ) {
    // Handle bestial failures
    Object.assign(labelData, getBestialFailureLabel(data, difficultySet))
  } else {
    // Default to just using the basic label generator if we don't have any splat-specific exceptions
    Object.assign(labelData, await getBaseLabel(data, difficultySet))
  }

  // Return the data we've obtained
  return labelData
}

// Handle messy critical conditions
function getMessyCriticalLabel(data, difficultySet) {
  let labelClass, labelText

  if (difficultySet) {
    // Messy critical
    labelClass = 'messy-critical'
    labelText = game.i18n.localize('WOD5E.VTM.MessyCritical')
  } else {
    // Possible messy critical
    labelClass = 'messy-critical'
    labelText = game.i18n.localize('WOD5E.VTM.PossibleMessyCritical')
  }

  return {
    labelClass,
    labelText
  }
}

// Handle bestial failure conditions
function getBestialFailureLabel(data, difficultySet) {
  let labelClass, labelText

  if (difficultySet) {
    // Bestial failure
    labelClass = 'bestial-failure'
    labelText = game.i18n.localize('WOD5E.VTM.BestialFailure')
  } else {
    // Possible bestial failure
    labelClass = 'bestial-failure'
    labelText = game.i18n.localize('WOD5E.VTM.PossibleBestialFailure')
  }

  return {
    labelClass,
    labelText
  }
}
