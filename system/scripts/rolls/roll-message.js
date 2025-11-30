// Import dice face-related variables for icon paths
import { DiceRegistry } from '../../api/def/dice.js'
import { normalDiceFaces } from '../../dice/icons.js'
import { WOD5eRoll } from '../system-rolls.js'
import { getRollFooter } from './roll-labels/get-label.js'

/**
 * Function to help generate the chat message after a roll is made
 *
 * @param roll                      The roll after being handled by Foundry
 * @param system                    (Optional, default "mortal") The gamesystem the roll is coming from
 * @param title                     Title of the roll for the chat message
 * @param flavor                    (Optional, default "") Text that appears in the description of the roll
 * @param difficulty                (Optional, default 0) The number of successes needed to pass the check
 */
export async function generateRollMessageData({
  roll,
  system = 'mortal',
  title,
  flavor = '',
  difficulty = 0,
  activeModifiers,
  isContentVisible = true
}) {
  if (!(roll instanceof WOD5eRoll)) {
    roll = WOD5eRoll.fromJSON(roll)
  }

  // Variables to be defined later
  let basicDice = roll.basicDice
  let advancedDice = roll.advancedDice

  // Make super sure that difficulty is an int
  difficulty = parseInt(difficulty)

  if (basicDice) {
    basicDice = await generateBasicDiceDisplay(basicDice)
  }
  if (advancedDice) {
    advancedDice = await generateAdvancedDiceDisplay(advancedDice)
  }

  const { totalResult, resultLabel, resultText } = await generateResult(basicDice, advancedDice)

  const rollMessageData = {
    fullFormula: roll._formula,
    basicDice,
    advancedDice,
    system,
    title,
    enrichedFlavor: await foundry.applications.ux.TextEditor.implementation.enrichHTML(flavor),
    difficulty,
    totalResult,
    margin: totalResult > difficulty ? totalResult - difficulty : 0,
    enrichedResultLabel:
      await foundry.applications.ux.TextEditor.implementation.enrichHTML(resultLabel),
    activeModifiers,
    isContentVisible,
    resultText
  }

  return rollMessageData

  // Function to help with rendering of basic dice
  async function generateBasicDiceDisplay(rollData) {
    const basicDice = rollData.results
    let criticals = 0

    basicDice.forEach((die, index) => {
      // Variables
      let dieResult, dieImg, dieAltText, dieTitle
      const dieClasses = ['die', 'roll-img', 'rerollable']

      // Mark any die that were rerolled / not used
      if (die.discarded) {
        dieClasses.push(['rerolled'])
        dieTitle = game.i18n.localize('WOD5E.Chat.Rerolled')
      }

      // Basic die results
      if (die.result === 10)
        dieResult = 'critical' // Critical successes
      else if (die.result < 10 && die.result > 5)
        dieResult = 'success' // Successes
      else dieResult = 'failure' // Failures

      // Define the face of the die based on the above conditionals
      const dieFace = normalDiceFaces[dieResult]

      // Grab the die class from the DiceRegistry class
      const dieConfig = DiceRegistry.basic[system] ?? DiceRegistry.basic['mortal']
      dieImg = `${dieConfig.imgRoot}${dieFace}`
      dieClasses.push(dieConfig.css)

      // Add any necessary data to the dice object
      rollData.results[index].img = dieImg
      rollData.results[index].classes = dieClasses.join(' ')
      rollData.results[index].altText = dieAltText
      rollData.results[index].title = dieTitle

      // Increase the number of criticals collected across the dice
      if (dieResult === 'critical' && !die.discarded) criticals++

      die.index = index
    })

    // Add in critical data as its own property
    rollData.criticals = criticals

    return rollData
  }

  // Function to help the rendering of advanced dice
  async function generateAdvancedDiceDisplay(rollData) {
    const advancedDice = rollData.results
    let criticals = 0
    let critFails = 0

    advancedDice.forEach((die, index) => {
      // Variables
      let dieResult, dieImg, dieAltText, dieTitle
      const dieClasses = ['die', 'roll-img']

      // Mark any die that were rerolled / not used
      if (die.discarded) dieClasses.push(['rerolled'])

      // Use our DiceRegistry class to grab the advanced dice class
      const dieConfig = DiceRegistry.advanced[system]
      if (!dieConfig) {
        console.error(`No advanced dice registry for system: ${system}`)
        return rollData
      }

      dieResult = dieConfig.resultMap(die.result)
      const dieFace = dieConfig.faces[dieResult]
      dieImg = `${dieConfig.imgRoot}${dieFace}`
      dieClasses.push(dieConfig.css)

      // Add any necessary data to the dice object
      rollData.results[index].img = dieImg
      rollData.results[index].classes = dieClasses.join(' ')
      rollData.results[index].altText = dieAltText
      rollData.results[index].title = dieTitle

      // Increase the number of criticals collected across the dice
      if (dieResult === 'critical' && !die.discarded) criticals++
      if (
        (dieResult === 'criticalFailure' || dieResult === 'bestial' || dieResult === 'brutal') &&
        !die.discarded
      )
        critFails++

      die.index = index
    })

    // Add in critical data as its own properties
    rollData.criticals = criticals
    rollData.critFails = critFails

    return rollData
  }

  async function generateResult(basicDice, advancedDice) {
    // Calculate the totals across the basic and advanced dice
    const basicTotal = basicDice ? basicDice.total : 0
    const advancedTotal = advancedDice ? advancedDice.total : 0

    // Grab the totals of crits across basic and advanced dice
    const basicCrits = basicDice ? basicDice.criticals : 0
    const advancedCrits = advancedDice ? advancedDice.criticals : 0
    // Sum up the total criticals across both sets of dice
    const totalCriticals = basicCrits + advancedCrits
    // Define the total to add to the roll as a result of the criticals
    // (every 2 critical results adds an additional 2 successes)
    const critTotal = Math.floor(totalCriticals / 2) * 2

    // Calculate the total result when factoring in criticals
    const totalResult = basicTotal + advancedTotal + critTotal

    // Construct the markup for total and difficulty display
    let totalAndDifficulty = `<div class="total-and-difficulty">
      <div class="roll-total">
        <span class="total-title">
          ${game.i18n.localize('WOD5E.RollList.Total')}
        </span>
        <span class="total-contents">
          ${totalResult}
        </span>
      </div>`
    if (difficulty > 0) {
      totalAndDifficulty += `<div class="roll-difficulty">
        <span class="difficulty-title">
          ${game.i18n.localize('WOD5E.RollList.Difficulty')}
        </span>
        <span class="difficulty-contents">
          ${difficulty}
        </span>
      </div>`
    }
    totalAndDifficulty += '</div>'

    // Generate the result label depending on the splat and difficulty
    const { resultLabel, resultText } = await getRollFooter(system, {
      totalResult,
      difficulty,
      basicDice,
      advancedDice,
      totalAndDifficulty
    })

    return { totalResult, resultLabel, resultText }
  }
}
