/* global game, renderTemplate, TextEditor */

// Import dice face-related variables for icon paths
import { mortalDiceLocation, vampireDiceLocation, werewolfDiceLocation, hunterDiceLocation, normalDiceFaces, hungerDiceFaces, rageDiceFaces, desperationDiceFaces, changelingDiceLocation, nightmareDiceFaces } from '../../dice/icons.js'
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
export async function generateRollMessage ({
  roll,
  system = 'mortal',
  title,
  flavor = '',
  difficulty = 0,
  activeModifiers,
  isContentVisible = true
}) {
  // Variables to be defined later
  let basicDice, advancedDice

  // Make super sure that difficulty is an int
  difficulty = parseInt(difficulty)

  if (roll.terms[0]) {
    basicDice = await generateBasicDiceDisplay(roll.terms[0])
  }
  if (roll.terms[2]) {
    advancedDice = await generateAdvancedDiceDisplay(roll.terms[2])
  }

  const { totalResult, resultLabel } = await generateResult(basicDice, advancedDice)

  const chatTemplate = 'systems/vtm5ec/display/ui/chat/roll-message.hbs'
  const chatData = {
    fullFormula: roll._formula,
    basicDice,
    advancedDice,
    system,
    title,
    enrichedFlavor: await TextEditor.enrichHTML(flavor),
    difficulty,
    totalResult,
    margin: totalResult > difficulty ? totalResult - difficulty : 0,
    enrichedResultLabel: await TextEditor.enrichHTML(resultLabel),
    activeModifiers,
    isContentVisible
  }

  const chatMessage = await renderTemplate(chatTemplate, chatData)

  return chatMessage

  // Function to help with rendering of basic dice
  async function generateBasicDiceDisplay (rollData) {
    const basicDice = rollData.results
    let criticals = 0

    basicDice.forEach((die, index) => {
      // Variables
      let dieResult, dieImg, dieAltText
      const dieClasses = ['roll-img', 'rerollable']

      // Mark any die that were rerolled / not used
      if (die.discarded) dieClasses.push(['rerolled'])

      // Basic die results
      if (die.result === 10) dieResult = 'critical' // Critical successes
      else if (die.result < 10 && die.result > 5) dieResult = 'success' // Successes
      else dieResult = 'failure' // Failures

      // Define the face of the die based on the above conditionals
      const dieFace = normalDiceFaces[dieResult]

      // Use switch-cases to adjust splat-specific dice locations/faces
      switch (system) {
        case 'werewolf':
          // Werewolf data
          dieImg = `${werewolfDiceLocation}${dieFace}`
          dieClasses.push(['werewolf-dice'])
          break
        case 'vampire':
          // Vampire data
          dieImg = `${vampireDiceLocation}${dieFace}`
          dieClasses.push(['vampire-dice'])
          break
        case 'hunter':
          // Hunter data
          dieImg = `${hunterDiceLocation}${dieFace}`
          dieClasses.push(['hunter-dice'])
          break
        case 'changeling':
          // Changeling data
          dieImg = `${changelingDiceLocation}${dieFace}`
          dieClasses.push(['changeling-dice'])
          break
        default:
          // Mortal data
          dieImg = `${mortalDiceLocation}${dieFace}`
          dieClasses.push(['mortal-dice'])
          break
      }

      // Add any necessary data to the dice object
      rollData.results[index].img = dieImg
      rollData.results[index].classes = dieClasses.join(' ')
      rollData.results[index].altText = dieAltText

      // Increase the number of criticals collected across the dice
      if (dieResult === 'critical' && !die.discarded) criticals++

      die.index = index
    })

    // Add in critical data as its own property
    rollData.criticals = criticals

    return rollData
  }

  // Function to help the rendering of advanced dice
  async function generateAdvancedDiceDisplay (rollData) {
    const advancedDice = rollData.results
    let criticals = 0
    let critFails = 0

    advancedDice.forEach((die, index) => {
      // Variables
      let dieResult, dieImg, dieAltText, dieFace
      const dieClasses = ['roll-img']

      // Mark any die that were rerolled / not used
      if (die.discarded) dieClasses.push(['rerolled'])

      // Use switch-cases to adjust splat-specific dice locations/faces
      switch (system) {
        case 'werewolf':
          // Werewolf die results
          if (die.result === 10) { // Handle critical successes
            dieResult = 'critical'
            dieClasses.push(['rerollable'])
          } else if (die.result < 10 && die.result > 5) { // Successes
            dieResult = 'success'
            dieClasses.push(['rerollable'])
          } else if (die.result < 6 && die.result > 2) { // Failures
            dieResult = 'failure'
            dieClasses.push(['rerollable'])
          } else dieResult = 'brutal' // Brutal failures

          // Werewolf data
          dieFace = rageDiceFaces[dieResult]
          dieImg = `${werewolfDiceLocation}${dieFace}`
          dieClasses.push(['rage-dice'])
          break
        case 'vampire':
          // Vampire die results
          if (die.result === 10) dieResult = 'critical' // Critical successes
          else if (die.result < 10 && die.result > 5) dieResult = 'success' // Successes
          else if (die.result < 6 && die.result > 1) dieResult = 'failure' // Failures
          else dieResult = 'bestial' // Bestial failures

          // Vampire data
          dieFace = hungerDiceFaces[dieResult]
          dieImg = `${vampireDiceLocation}${dieFace}`
          dieClasses.push(['hunger-dice'])
          break
        case 'changeling':
          // Changeling die results
          if (die.result === 10) dieResult = 'critical' // Critical successes
          else if (die.result < 10 && die.result > 5) dieResult = 'success' // Successes
          else if (die.result < 6 && die.result > 1) dieResult = 'failure' // Failures
          else dieResult = 'nightmare' // Bestial failures

          // Changeling data
          dieFace = nightmareDiceFaces[dieResult]
          dieImg = `${changelingDiceLocation}${dieFace}`
          dieClasses.push(['nightmare-dice'])
          break
        case 'hunter':
          // Hunter die results
          if (die.result === 10) dieResult = 'critical' // Critical successes
          else if (die.result < 10 && die.result > 5) dieResult = 'success' // Successes
          else if (die.result < 6 && die.result > 1) dieResult = 'failure' // Failures
          else dieResult = 'criticalFailure' // Critical failures

          // Hunter data
          dieFace = desperationDiceFaces[dieResult]
          dieImg = `${hunterDiceLocation}${dieFace}`
          dieClasses.push(['desperation-dice'])
          break
      }

      // Add any necessary data to the dice object
      rollData.results[index].img = dieImg
      rollData.results[index].classes = dieClasses.join(' ')
      rollData.results[index].altText = dieAltText

      // Increase the number of criticals collected across the dice
      if (dieResult === 'critical' && !die.discarded) criticals++
      if ((dieResult === 'criticalFailure' || dieResult === 'bestial' || dieResult === 'brutal') && !die.discarded) critFails++

      die.index = index
    })

    // Add in critical data as its own properties
    rollData.criticals = criticals
    rollData.critFails = critFails

    return rollData
  }

  async function generateResult (basicDice, advancedDice) {
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
    const resultLabel = await getRollFooter(system, {
      totalResult,
      difficulty,
      basicDice,
      advancedDice,
      totalAndDifficulty
    })

    return { totalResult, resultLabel }
  }
}
