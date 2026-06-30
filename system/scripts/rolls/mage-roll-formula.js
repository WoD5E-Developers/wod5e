/**
 * Generate the roll formula for Mage: the Ascension.
 *
 * Paradox dice (x) replace basic dice up to the actor's current Paradox value,
 * exactly mirroring how Hunger dice replace normal vampire dice in V5.
 *
 * Formula structure:
 *   {basicDice}dp{cs>5} + {paradoxDice}dx{cs>5}
 *
 * where paradoxDice = Math.min(actor.system.paradox.value, totalPool)
 * and   basicDice   = totalPool - paradoxDice
 *
 * For non-spellcasting rolls (skill tests) the formula is identical;
 * the only difference is which CSS classes the chat template applies
 * to the 1 and 10 results (weirdFailure / weirdCritical vs paradoxFailure / paradoxCritical).
 * That distinction is carried via the `isSpellcasting` flag in roll options,
 * not by separate dice classes.
 *
 * @param {number}  basicDice       Total dice before paradox replacement
 * @param {number}  paradoxValue    Current paradox track value (0–5)
 * @returns {string}                Foundry dice formula string
 */
export function generateMageRollFormula({ basicDice = 0, paradoxValue = 0 }) {
  const successFormula = 'cs>5'

  // Clamp paradox dice to the pool size — can't replace more dice than exist
  const paradoxDice = Math.min(paradoxValue, basicDice)
  const normalDice  = basicDice - paradoxDice

  // Always roll at least 1 die total
  if (normalDice === 0 && paradoxDice === 0) {
    return `1dp${successFormula}`
  }

  if (paradoxDice === 0) {
    return `${normalDice}dp${successFormula}`
  }

  if (normalDice === 0) {
    return `${paradoxDice}dx${successFormula}`
  }

  return `${normalDice}dp${successFormula} + ${paradoxDice}dx${successFormula}`
}
