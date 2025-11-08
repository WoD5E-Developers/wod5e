// Import modules
import { WOD5eDice } from './system-rolls.js'

/**
 * Initalise willpower rerolls and its functions
 **/

export const willpowerReroll = async (roll) => {
  // Variables
  const dice = roll.querySelectorAll('.rerollable')
  const diceRolls = []
  const messageId = roll.getAttribute('data-message-id')
  const message = game.messages.get(messageId)
  const system = message.flags.system || 'mortal'

  // Go through the message's dice and add them to the diceRolls array
  Object.keys(dice).forEach((i) => {
    // Filter out non-numeric keys like "prevObject" and "length"
    if (!isNaN(Number(i))) {
      diceRolls.push(`<div class="die-select">${dice[i].outerHTML}</div>`)
    }
  })

  // Create dialog for rerolling dice
  const content = `
    <form>
      <div class="window-content">
        <label><b>Select dice to reroll (Max 3)</b></label>
        <hr>
        <span class="dice-tooltip">
          <div class="dice-rolls flexrow willpower-reroll">
            ${diceRolls.join('')}
          </div>
        </span>
      </div>
    </form>`

  // Prompt dialog
  await foundry.applications.api.DialogV2.prompt({
    window: {
      title: game.i18n.localize('WOD5E.Chat.WillpowerReroll')
    },
    classes: ['wod5e', system, 'dialog'],
    content,
    ok: {
      label: 'Reroll',
      callback: () => rerollDie(roll)
    },
    cancel: {
      label: 'Cancel'
    },
    modal: true,
    render: (event, dialog) => {
      const rerollableDie = dialog.element.querySelectorAll('.willpower-reroll .die-select')

      rerollableDie.forEach((die) => {
        die.addEventListener('click', toggleDieSelect)
      })
    }
  })

  // Handles selecting and de-selecting the die
  function toggleDieSelect() {
    const selectedDice = document.querySelectorAll('.willpower-reroll .selected')

    if (!this.classList.contains('selected') && selectedDice.length < 3) {
      this.classList.add('selected')
    } else {
      this.classList.remove('selected')
    }
  }

  // Handles rerolling the number of dice selected
  async function rerollDie(roll) {
    // Variables
    const diceSelected = document.querySelectorAll('.willpower-reroll .selected')
    const rageDiceSelected = document.querySelectorAll('.willpower-reroll .selected .rage-dice')
    const selectors = ['willpower-reroll']

    // Get the actor associated with the message
    // Theoretically I should error-check this, but there shouldn't be any
    // messages that call for a WillpowerReroll without an associated actor
    const messageId = roll.getAttribute('data-message-id')
    const message = game.messages.get(messageId)
    const actor = game.actors.get(message.speaker.actor)
    // Get the rollMode associated with the message
    const rollMode = message?.flags?.rollMode || game.settings.get('core', 'rollMode')

    // If there is at least 1 die selected and aren't any more than 3 die selected, reroll the total number of die and generate a new message.
    if (diceSelected.length > 0 && diceSelected.length < 4) {
      WOD5eDice.Roll({
        basicDice: diceSelected.length - rageDiceSelected.length,
        advancedDice: rageDiceSelected.length,
        title: game.i18n.localize('WOD5E.Chat.WillpowerReroll'),
        actor,
        willpowerDamage: actor ? 1 : 0, // If no actor is set, we don't need to damage any willpower
        quickRoll: true,
        rollMode,
        selectors,
        disableMessageOutput: true,
        system: message.flags.gamesystem,
        callback: async (err, reroll) => {
          if (err) console.log('World of Darkness 5e | ' + err)

          const messageRolls = message.rolls

          diceSelected.forEach((dieHTML) => {
            const imgElement = dieHTML.querySelector('img')

            if (!imgElement) {
              console.error('World of Darkness 5e | Image element not found in dieHTML:', dieHTML)
              return // Skip this iteration if image element is not found
            }

            const dieIndex = parseInt(imgElement.getAttribute('data-index'))

            if (imgElement.classList.contains('rage-dice')) {
              const die = messageRolls[0].terms[2].results.find((die) => die.index === dieIndex)

              if (die) {
                die.discarded = true
                die.active = false
              } else {
                console.error('World of Darkness 5e | Die not found in rage diceset:', dieIndex)
              }
            } else {
              const die = messageRolls[0].terms[0].results.find((die) => die.index === dieIndex)

              if (die) {
                die.discarded = true
                die.active = false
              } else {
                console.error('World of Darkness 5e | Die not found in base diceset:', dieIndex)
              }
            }
          })

          // Merge "results" arrays
          messageRolls[0].terms[0].results = messageRolls[0].terms[0].results.concat(
            reroll.terms[0].results
          )

          // Only merge the 2nd dicepool if one even exists
          if (messageRolls[0].terms[2])
            messageRolls[0].terms[2].results = messageRolls[0].terms[2].results.concat(
              reroll.terms[2].results
            )

          message.update({
            rolls: messageRolls
          })
        }
      })
    }
  }
}
