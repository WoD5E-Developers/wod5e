// Import dice classes for their denominations
import {
  MortalDie,
  VampireDie,
  VampireHungerDie,
  HunterDie,
  HunterDesperationDie,
  WerewolfDie,
  WerewolfRageDie
} from '../../dice/splat-dice.js'
import { MageDie, ParadoxDie } from '../../dice/mage-dice.js'

/**
 * Function to help construct the roll formula from given sets of dice
 *
 * @param basicDice                 (Optional, default 0) The number of 'basic' dice to roll, such as v, w, and h
 * @param advancedDice              (Optional, default 0) The number of 'advanced' dice to roll, such as g, r and s
 * @param system                    (Optional, default "mortal") The gamesystem the roll is coming from
 * @param rerollHunger              (Optional, default false) Whether to reroll failed hunger dice
 */
export async function generateRollFormula({
  basicDice = 0,
  advancedDice = 0,
  system = 'mortal',
  rerollHunger = false
}) {
  // The formula for counting a roll's success (anything over 5)
  const successFormula = 'cs>5'

  // Construct roll formulas based on the system the roll is from
  let rollFormula
  if (system === 'vampire') {
    // Compose the roll string.
    // First, rolling vampire dice (dv) and count successes (cs>5)
    // Then, roll hunger dice (dg) and count successes (cs>5) as well as
    // rerolling those hunger dice to keep the highest (kh)
    const rouseReroll = rerollHunger ? `kh${advancedDice}` : ''
    if (rerollHunger) advancedDice = advancedDice * 2

    // Construct the Vampire roll formula by merging Vampire Dice, Hunger Dice, and any possible rouse reroll modifiers
    rollFormula = `${basicDice}d${VampireDie.DENOMINATION}${successFormula} + ${advancedDice}d${VampireHungerDie.DENOMINATION}${successFormula}${rouseReroll}`
  } else if (system === 'werewolf') {
    // Construct the Werewolf roll formula by merging Werewolf Dice and Rage Dice
    rollFormula = `${basicDice}d${WerewolfDie.DENOMINATION}${successFormula} + ${advancedDice}d${WerewolfRageDie.DENOMINATION}${successFormula}`
  } else if (system === 'hunter') {
    // Construct the Hunter roll formula by merging Hunter Dice and Desperation Dice
    rollFormula = `${basicDice}d${HunterDie.DENOMINATION}${successFormula} + ${advancedDice}d${HunterDesperationDie.DENOMINATION}${successFormula}`
  } else if (system === 'mage') {
    // By the time we reach here, roll.js has already done the Paradox replacement:
    //   advancedDice = Math.min(totalPool, paradox.value)   — the Paradox dice
    //   basicDice    = totalPool - advancedDice              — the remaining normal dice
    // So we just use the values as-is, exactly like the vampire branch does with
    // basicDice (normal) and advancedDice (hunger). No re-splitting needed.
    if (advancedDice === 0) {
      rollFormula = `${Math.max(1, basicDice)}d${MageDie.DENOMINATION}${successFormula}`
    } else if (basicDice === 0) {
      rollFormula = `${advancedDice}d${ParadoxDie.DENOMINATION}${successFormula}`
    } else {
      rollFormula = `${basicDice}d${MageDie.DENOMINATION}${successFormula} + ${advancedDice}d${ParadoxDie.DENOMINATION}${successFormula}`
    }
  } else {
    // Construct the Mortal roll formula; it doesn't need any secondary rolls
    rollFormula = `${basicDice}d${MortalDie.DENOMINATION}${successFormula}`
  }

  return rollFormula
}
