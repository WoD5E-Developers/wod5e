/* global ChatMessage, game, foundry, CONFIG */

// Import various helper functions
import { generateRollFormula } from './rolls/roll-formula.js'
import { getSituationalModifiers } from './rolls/situational-modifiers.js'
import { _damageWillpower } from './rolls/willpower-damage.js'
import { _increaseHunger } from './rolls/increase-hunger.js'
import { _decreaseRage } from './rolls/decrease-rage.js'
import { _applyOblivionStains } from './rolls/apply-oblivion-stains.js'
import { updateRollPrompt } from '../sockets/roll-prompt.js'

class WOD5eRoll extends foundry.dice.Roll {
  constructor (formula = '', data = {}, options = {}) {
    super(formula, data, options)
    this.system = options.system ?? this._tryCalculateSystem()
    if (!this.dice.every(d => foundry.utils.getProperty(d, 'gameSystem') === this.system)) {
      throw new Error('Dice are not compatible with this roll')
    }
  }

  get basicDice () {
    return this.#getDiceByType('basic')
  }

  get advancedDice () {
    return this.#getDiceByType('advanced')
  }

  /** @override */

  async _evaluate (options = {}) {
    await super._evaluate(options)

    if (this.system !== undefined) {
      const crits = this.dice.filter(d => d.gameSystem === this.system).flatMap(d => d.results.filter(r => r.result === 10 && r.active)).length

      this._total += Math.floor(crits / 2) * 2
    }

    return this
  }

  /** @override */

  _evaluateTotal () {
    const total = super._evaluateTotal()

    if (this.system !== undefined) {
      const crits = this.dice.filter(d => d.gameSystem === this.system).flatMap(d => d.results.filter(r => r.result === 10 && r.active)).length
      return total + Math.floor(crits / 2) * 2
    }

    return total
  }

  _tryCalculateSystem () {
    const systems = new Set(this.dice.map(d => foundry.utils.getProperty(d, 'gameSystem')))

    if (systems.size > 1) {
      throw new Error('Multiple systems detected in dice')
    }

    return systems.values()?.next()?.value
  }

  #getDiceByType (type) {
    return this.terms.find(term => foundry.utils.getProperty(term, 'dieType') === type)
  }

  static fromJSON (data) {
    if (data.class !== 'WOD5eRoll') throw new Error('Invalid class')

    const roll = foundry.dice.Roll.fromData(data)
    Object.setPrototypeOf(roll, WOD5eRoll.prototype)
    roll.system = data.system

    return roll
  }
}

class WOD5eDice {
  /**
   * Class that handles all WOD5e rolls.
   *
   * @param basicDice                 (Optional, default 0) The number of 'basic' dice to roll, such as v, w, and h
   * @param advancedDice              (Optional, default 0) The number of 'advanced' dice to roll, such as g, r and s
   * @param actor                     The actor that the roll is coming from
   * @param data                      Actor or item data to pass along with the roll
   * @param title                     Title of the roll for the dialog/chat message
   * @param disableBasicDice          (Optional, default false) Whether to disable basic dice on this roll
   * @param disableAdvancedDice       (Optional, default false) Whether to disable advanced dice on this roll
   * @param willpowerDamage           (Optional, default 0) How much to damage willpower after the roll is complete
   * @param increaseHunger            (Optional, default false) Whether to increase hunger on failures
   * @param decreaseRage              (Optional, default false) Whether to reduce rage on failures
   * @param difficulty                (Optional, default 0) The number that the roll must succeed to count as a success
   * @param flavor                    (Optional, default '') Text that appears in the description of the roll
   * @param callback                  (Optional) A callable function for determining the chat message flavor given parts and data
   * @param quickRoll                 (Optional, default false) Whether the roll was called to bypass the roll dialog or not
   * @param rollMode                  (Optional, default FVTT's current roll mode) Which roll mode the message should default as
   * @param rerollHunger              (Optional, default false) Whether to reroll failed hunger dice
   * @param selectors                 (Optional, default []) Any selectors to use when compiling situational modifiers
   * @param macro                     (Optional, default '') A macro to run after the roll has been made
   * @param disableMessageOutput      (optional, default false) Whether to display the message output of a roll
   * @param advancedCheckDice         (optional, default 0) Any dice that, part of an 'advanced' diceset, is rolled separately but at the same time
   *
   */
  static async Roll ({
    basicDice = 0,
    advancedDice = 0,
    actor,
    data,
    title,
    disableBasicDice,
    disableAdvancedDice,
    willpowerDamage = 0,
    increaseHunger = false,
    decreaseRage = false,
    difficulty = 0,
    flavor = '',
    callback,
    quickRoll = false,
    rollMode = game.settings.get('core', 'rollMode'),
    rerollHunger = false,
    selectors = [],
    macro = '',
    disableMessageOutput = false,
    advancedCheckDice = 0,
    system = actor?.system?.gamesystem || 'mortal',
    originMessage = ''
  }) {
    // Inner roll function
    const _roll = async (inputBasicDice, inputAdvancedDice, formData) => {
      // Get the difficulty and store it
      difficulty = formData ? formData.querySelector('#inputDifficulty')?.value ?? difficulty : difficulty
      // Get the rollMode and store it
      rollMode = formData ? formData.querySelector('[name="rollMode"]')?.value ?? rollMode : rollMode

      // Prevent trying to roll 0 dice; all dice pools should roll at least 1 die
      if (parseInt(inputBasicDice) === 0 && parseInt(inputAdvancedDice) === 0) {
        if (system === 'vampire' && actor.system.hunger.value > 0) {
          // Vampires with hunger above 0 should be rolling 1 hunger die
          inputAdvancedDice = 1
        } else if (system === 'werewolf' && actor.system.rage.value > 0) {
          // Werewolves with rage above 0 should be rolling 1 rage die
          inputAdvancedDice = 1
        } else {
          // In all other cases, we just roll one basic die
          inputBasicDice = 1
        }
      }

      // Construct the proper roll formula by sending it to the generateRollFormula function
      const rollFormula = await generateRollFormula({
        basicDice: inputBasicDice,
        advancedDice: inputAdvancedDice,
        system,
        actor,
        data,
        rerollHunger
      })

      // Determine any active modifiers
      const activeModifiers = []
      if (formData) {
        const modifiersList = formData.querySelectorAll('.mod-checkbox')
        if (modifiersList.length > 0) {
          modifiersList.forEach(el => {
            const isChecked = el.checked

            if (isChecked) {
              // Get the dataset values
              const label = el.dataset.label
              const value = Number(el.dataset.value || 0)

              // Add a plus sign if the value is positive
              const valueWithSign = (value > 0 ? '+' : '') + value

              // Push the object to the activeModifiers array
              activeModifiers.push({
                label,
                value: valueWithSign
              })
            }
          })
        }

        const customModifiersList = formData.querySelectorAll('.custom-modifier')
        if (customModifiersList.length > 0) {
          // Go through each custom modifier and add it to the array
          customModifiersList.forEach(el => {
            // Get the label and value from the current .custom-modifier element
            const label = el.querySelector('.mod-name')?.value || ''
            const value = Number(el.querySelector('.mod-value')?.value || 0)

            // Add a plus sign if the value is positive
            const valueWithSign = (value > 0 ? '+' : '') + value

            // Create an object with label and value fields
            const modifierObject = {
              label,
              value: valueWithSign
            }

            // Add the object to the activeModifiers array
            activeModifiers.push(modifierObject)
          })
        }
      }

      const options = {
        difficulty,
        system,
        title,
        flavor,
        activeModifiers,
        rollMode
      }

      // Send the roll to chat
      const roll = await new WOD5eRoll(rollFormula, data, options).roll()

      // Handle failures for werewolves and vampires
      if (roll.advancedDice) await handleFailure(system, roll.advancedDice.results)

      // Handle willpower damage
      if (willpowerDamage > 0 && game.settings.get('vtm5e', 'automatedWillpower')) _damageWillpower(null, null, actor, willpowerDamage, rollMode)

      // Roll any advanced check dice that need to be rolled in a separate rollmessage
      if (advancedCheckDice > 0) {
        await this.Roll({
          actor,
          data,
          title: `${game.i18n.localize('WOD5E.VTM.RousingBlood')} - ${title}`,
          system,
          disableBasicDice: true,
          advancedDice: advancedCheckDice,
          rollMode,
          quickRoll: true,
          increaseHunger: system === 'vampire',
          decreaseRage: system === 'werewolf'
        })
      }

      // Send the results of the roll back to any functions that need it
      if (callback) {
        callback(
          null,
          {
            ...roll,
            system,
            difficulty,
            rollSuccessful: roll.total > 0 && ((roll.total >= difficulty) || (difficulty === 0)),
            rollMode
          }
        )
      }

      // Run any macros that need to be ran
      if (macro && game.macros.get(macro)) {
        game.macros.get(macro).execute({
          actor,
          token: actor.token ?? actor.getActiveTokens[0],
          roll
        })
      }

      // Handle updating any 'parent' chat messages that need the roll
      if (originMessage) {
        const chatMessage = game.messages.get(originMessage)

        if (chatMessage && chatMessage.getFlag('vtm5e', 'isRollPrompt')) {
          disableMessageOutput = true

          const socketData = {
            action: 'updateRollPrompt',
            actorID: actor.id,
            roll: roll.toJSON(),
            messageID: chatMessage.id
          }

          if (chatMessage.isOwner) {
            updateRollPrompt(socketData)
          } else {
            game.socket.emit('system.vtm5e', socketData)
          }
        }
      }

      // The below isn't needed if disableMessageOutput is set to true
      if (disableMessageOutput && game.dice3d) {
        // Send notice to DiceSoNice because we're not making a new chat message
        game.dice3d.showForRoll(roll, game.user, true)

        // End function here
        return roll
      }

      // Post the message to the chat
      if (!disableMessageOutput) {
        await roll.toMessage({
          speaker: ChatMessage.getSpeaker({ actor })
        },
        {
          rollMode
        })
      }

      return roll
    }

    // Check if the user wants to bypass the roll dialog
    if (!quickRoll) {
      // Handle getting any situational modifiers
      const situationalModifiers = actor ? await getSituationalModifiers({ actor, selectors }) : {}

      // Roll dialog template
      const dialogTemplate = `systems/vtm5e/display/ui/${system}-roll-dialog.hbs`
      // Data that the dialog template needs
      const dialogData = {
        system,
        basicDice,
        advancedDice,
        disableBasicDice,
        disableAdvancedDice,
        difficulty,
        rollMode,
        rollModes: CONFIG.Dice.rollModes,
        situationalModifiers
      }
      // Render the dialog
      const content = await foundry.applications.handlebars.renderTemplate(dialogTemplate, dialogData)

      // Promise to handle the roll after the dialog window is closed
      // as well as any callbacks or other functions with the roll
      return foundry.applications.api.DialogV2.wait({
        window: {
          title: title || game.i18n.localize('WOD5E.RollList.Label')
        },
        content,
        actions: {
          plus: (_event, target) => {
            const input = target.ownerDocument.querySelector(`#${target.dataset.resource}`)
            input.valueAsNumber += 1
          },
          minus: (_event, target) => {
            const input = target.ownerDocument.querySelector(`#${target.dataset.resource}`)
            input.valueAsNumber = Math.max(input.valueAsNumber - 1, parseInt(input.min))
          },
          addCustomMod: (_event, target) => {
            // Define the custom modifiers list and a custom modifier element
            const customModList = target.ownerDocument.querySelector('#custom-modifiers-list')
            const customModElement = `<div class="form-group custom-modifier">
                <div class="mod-label">
                  <a class="mod-delete" data-action="deleteCustomMode" title="` + game.i18n.localize('WOD5E.Delete') + `">
                    <i class="fas fa-trash"></i>
                  </a>
                  <input class="mod-name" type="text" value="Custom"/>
                </div>
                <input class="mod-value" type="number" value="1"/>
              </div>`

            // Append a new custom modifier element to the list
            customModList.insertAdjacentHTML('beforeend', customModElement)
          },
          deleteCustomMode: (_event, target) => {
            target.closest('.custom-modifier').remove()
          }
        },
        buttons: [
          {
            action: 'roll',
            icon: 'fas fa-dice',
            label: game.i18n.localize('WOD5E.RollList.Label'),
            default: true,
            callback: async (_event, _button, dialog) => {
              const dialogHTML = dialog.element

              // Obtain the input fields
              const basicDiceInput = dialogHTML.querySelector('#inputBasicDice')
              const advancedDiceInput = dialogHTML.querySelector('#inputAdvancedDice')

              // Get the values
              const basicValue = basicDiceInput?.valueAsNumber ?? 0
              const advancedValue = advancedDiceInput?.valueAsNumber ?? 0

              // Add any custom modifiers
              const customModifiersList = dialogHTML.querySelectorAll('.custom-modifier')
              const modifierTotal = customModifiersList.entries().reduce((modifierTotal, [, el]) => {
                return modifierTotal + (el.querySelector('.mod-value')?.valueAsNumber ?? 0)
              }, 0)

              // Send the roll to the _roll function
              return await _roll(basicValue + modifierTotal, advancedValue, dialogHTML)
            }
          },
          {
            action: 'cancel',
            icon: 'fas fa-times',
            label: game.i18n.localize('WOD5E.Cancel')
          }
        ],
        classes: ['wod5e', system, 'roll-dialog'],
        render: (_event, dialog) => {
          const dialogHTML = dialog.element

          // Obtain the input fields
          const basicDiceInput = dialogHTML.querySelector('#inputBasicDice')
          const advancedDiceInput = dialogHTML.querySelector('#inputAdvancedDice')

          // Get the values
          // Add event listeners to the situational modifier toggles
          dialogHTML.querySelectorAll('.mod-checkbox').forEach(function (el) {
            el.addEventListener('change', function (event) {
              event.preventDefault()

              // Actor data
              const actorData = actor.system

              // Determine the input
              const modCheckbox = event.target
              const modifier = parseInt(event.currentTarget.dataset.value)
              const modifierIsNegative = modifier < 0

              // Get the values of basic and advanced dice
              const basicValue = basicDiceInput?.valueAsNumber ?? 0
              const advancedValue = advancedDiceInput?.valueAsNumber ?? 0
              const aCDValue = event.currentTarget.dataset.advancedCheckDice ? parseInt(event.currentTarget.dataset.advancedCheckDice) : 0

              // Determine whether any alterations need to be made to basic dice or advanced dice
              // Either use the current applyDiceTo (if set), or default to 'basic'
              let applyDiceTo = event.currentTarget.dataset.applyDiceTo || 'basic'

              // Make sure advanced dice are enabled
              if (!disableAdvancedDice) {
                if (modifierIsNegative) {
                  // Apply dice to basicDice unless basicDice is 0
                  if ((system === 'vampire' || system === 'werewolf') && basicValue === 0) {
                    applyDiceTo = 'advanced'
                  }
                } else {
                  // Apply dice to advancedDice if advancedValue is below the actor's hunger/rage value
                  if ((system === 'vampire' && advancedValue < actorData?.hunger.value) || (system === 'werewolf' && advancedValue < actorData?.rage.value)) {
                    applyDiceTo = 'advanced'
                  }
                }
              }

              // Determine the new input depending on if the modifier is adding or subtracting
              // Checked and modifier is NOT negative = Add
              // Unchecked and modifier is negative = Add
              // Checked and modifier is negative = Subtract
              // Unchecked and modifier is NOT negative = Subtract
              let newValue = 0
              let checkValue = 0
              if ((modCheckbox?.checked && !modifierIsNegative) || (!modCheckbox?.checked && modifierIsNegative)) {
                // Adding the modifier
                if (applyDiceTo === 'advanced') {
                  // Apply the modifier to advancedDice
                  newValue = advancedValue + Math.abs(modifier)

                  // Determine what we're checking against
                  if (system === 'vampire') {
                    checkValue = actorData?.hunger.value
                  }
                  if (system === 'werewolf') {
                    checkValue = actorData?.rage.value
                  }

                  if ((newValue > actorData?.hunger.value || newValue > checkValue) && !(event.currentTarget.dataset.applyDiceTo === 'advanced')) {
                    // Check for any excess and apply it to basicDice
                    const excess = newValue - checkValue
                    newValue = checkValue
                    basicDiceInput.value = basicValue + excess
                  }

                  // Update the advancedDice in the menu
                  advancedDiceInput.value = newValue
                } else {
                  // If advancedDice is already at its max, apply the whole modifier to just basicDice
                  newValue = basicValue + Math.abs(modifier)
                  basicDiceInput.value = newValue
                }

                // Apply the advancedCheckDice value
                advancedCheckDice = advancedCheckDice + aCDValue
              } else {
                // Removing the modifier
                if (applyDiceTo === 'advanced') {
                  // Apply the modifier to advancedDice
                  newValue = advancedValue - Math.abs(modifier)

                  if (newValue < 0) {
                    // Check for any deficit and apply it to basicDice
                    const deficit = Math.abs(newValue)
                    newValue = 0
                    basicDiceInput.value = Math.max(basicValue - deficit, 0)
                  }

                  // Update the advancedDice in the menu
                  advancedDiceInput.value = newValue
                } else {
                  newValue = basicValue - Math.abs(modifier)
                  if (newValue < 0) {
                    const deficit = Math.abs(newValue)
                    newValue = 0
                    advancedDiceInput.value = Math.max(advancedValue - deficit, 0)
                  }

                  basicDiceInput.value = newValue
                }

                // Apply the advancedCheckDice value while ensuring the value can't go below 0
                advancedCheckDice = Math.max(advancedCheckDice - aCDValue, 0)
              }

              // Ensure that there can't be negative dice
              if (basicDiceInput.value < 0) basicDiceInput.value = 0
              if (advancedDiceInput.value < 0) advancedDiceInput.value = 0
            })
          })
        }
      })
    } else {
      return _roll(basicDice, advancedDice)
    }

    // Function to help with handling additional functions as a result
    // of failures
    async function handleFailure (system, diceResults) {
      const failures = diceResults.filter(result => result.success === false && !result.discarded).length

      if (failures > 0) {
        if (system === 'vampire' && increaseHunger && game.settings.get('vtm5e', 'automatedHunger')) {
          _increaseHunger(actor, failures, rollMode)
        } else if (system === 'werewolf' && decreaseRage && game.settings.get('vtm5e', 'automatedRage')) {
          _decreaseRage(actor, failures, rollMode)
        }
      }

      // Handle Oblivion rouse checks here
      if (selectors.includes('oblivion-rouse') && game.settings.get('vtm5e', 'automatedOblivion')) {
        const oblivionTriggers = diceResults.filter(result => [1, 10].includes(result.result) && !result.discarded).length

        if (oblivionTriggers > 0) {
          _applyOblivionStains(actor, oblivionTriggers, rollMode)
        }
      }
    }
  }
}

export { WOD5eDice, WOD5eRoll }
