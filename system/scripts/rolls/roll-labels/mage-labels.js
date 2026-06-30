import { getBaseLabel } from './base-labels.js'

/**
 * Roll result labels for Mage: the Ascension.
 *
 * All sphere rolls are spellcasting rolls, so the labels are always:
 *   Paradox Failure  (1 on a Paradox die + roll fails)      — like Bestial Failure
 *   Paradox Critical (10 on a Paradox die + critical win)   — like Messy Critical
 *
 * For skill-only rolls (no Paradox dice), falls through to the base label.
 */
export const getMageLabel = async function (data) {
  const difficultySet = data.difficulty > 0
  const labelData = {
    showTotalAndDifficulty: true,
    labelClass: '',
    labelText: ''
  }

  // ── Paradox Critical ─────────────────────────────────────────────────────
  // Paradox die shows a 10 AND it's part of a critical win
  // (same threshold as V5 Messy Critical)
  const isCriticalWin =
    data.advancedDice?.criticals > 1 ||
    (data.basicDice?.criticals > 0 && data.advancedDice?.criticals > 0)

  if (isCriticalWin) {
    labelData.labelClass = 'messy-critical'
    labelData.labelText  = game.i18n.localize(
      difficultySet ? 'WOD5E.MTA.ParadoxCritical' : 'WOD5E.MTA.PossibleParadoxCritical'
    )
    return labelData
  }

  // ── Paradox Failure ──────────────────────────────────────────────────────
  // Paradox die shows a 1 AND the roll fails
  const isParadoxFail =
    data.advancedDice?.critFails > 0 &&
    (!difficultySet || data.totalResult < data.difficulty)

  if (isParadoxFail) {
    labelData.labelClass = 'bestial-failure'
    labelData.labelText  = game.i18n.localize(
      difficultySet ? 'WOD5E.MTA.ParadoxFailure' : 'WOD5E.MTA.PossibleParadoxFailure'
    )
    return labelData
  }

  // ── Default ──────────────────────────────────────────────────────────────
  Object.assign(labelData, await getBaseLabel(data, difficultySet))
  return labelData
}
