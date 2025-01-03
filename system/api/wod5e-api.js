/* global renderTemplate, Dialog, ChatMessage, game, ui, WOD5E */

import { WOD5eDice } from '../scripts/system-rolls.js'
import { _onConfirmRoll } from '../actor/scripts/roll.js'
import { generateLocalizedLabel } from './generate-localization.js'

export class wod5eAPI {
  /**
   * Class that handles all WOD5e rolls.
   *
   * @param basicDice                 (Optional, default 0) The number of 'basic' dice to roll, such as v, w, and h
   * @param advancedDice              (Optional, default 0) The number of 'advanced' dice to roll, such as g, r and s
   * @param actor                     (Optional, default to speaker actor) The actor that the roll is coming from
   * @param data                      (Optional, default actor.system) Actor or item data to pass along with the roll
   * @param title                     (Optional, default "Rolling") Title of the roll for the dialog/chat message
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
   *
   */
  static async Roll ({
    basicDice = 0,
    advancedDice = 0,
    actor = game.actors.get(ChatMessage.getSpeaker().actor),
    data = game.actors.get(ChatMessage.getSpeaker().actor)?.system || {},
    title = 'Rolling',
    disableBasicDice = false,
    disableAdvancedDice = false,
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
    macro = ''
  }) {
    if (!actor || !data) {
      ui.notifications.error(game.i18n.localize('WOD5E.Notifications.NoActorDefined'))

      return
    }

    // Send the roll to the system
    await WOD5eDice.Roll({
      basicDice,
      advancedDice,
      actor,
      data,
      title,
      disableBasicDice,
      disableAdvancedDice,
      willpowerDamage,
      difficulty,
      flavor,
      callback,
      quickRoll,
      rollMode,
      rerollHunger,
      increaseHunger,
      decreaseRage,
      selectors,
      macro
    })
  }

  static async PromptRoll ({
    actor = game.actors.get(ChatMessage.getSpeaker().actor)
  }) {
    // Warn that we couldn't get an actor
    if (!actor) return ui.notifications.warn('No actor defined.')

    // Prompt a roll from a dataset
    WOD5E.api.RollFromDataset({
      dataset: {
        selectDialog: true
      }
    }, actor)
  }

  /**
   * Class that handles rolling via a dataset format before passing the data to Roll.
   *
   * @param dataset                   A formatted dataset with various roll variables
   * @param actor                     (Optional, default to speaker actor) The actor that the roll is coming from
  */
  static async RollFromDataset ({
    dataset,
    actor = game.actors.get(ChatMessage.getSpeaker().actor)
  }) {
    // If there's no dataset, send an error and then stop the function
    if (!dataset) return console.error('No dataset defined.')

    // If selectDialog isn't set, just skip to the next dialog immediately
    if (!dataset.selectDialog) return _onConfirmRoll(dataset, actor)

    // Variables
    const { skill, attribute, discipline, renown, art } = dataset

    // Attribute definitions
    const attributeOptions = WOD5E.Attributes.getList({})
    // Skill definitions
    const skillOptions = WOD5E.Skills.getList({})
    // Discipline definitions
    const disciplineOptions = WOD5E.Disciplines.getList({})
    // Arts definitions
    const artOptions = WOD5E.Arts.getList({})
    // Realms definitions
    const realmOptions = WOD5E.Realms.getList({})
    // Renown definitions
    const renownOptions = WOD5E.Renown.getList({})

    // Render selecting a skill/attribute to roll
    const dialogTemplate = 'systems/vtm5ec/display/ui/select-dice-dialog.hbs'
    const dialogData = {
      system: actor.system.gamesystem,
      skill,
      attribute,
      discipline,
      renown,
      attributeOptions,
      skillOptions,
      disciplineOptions,
      renownOptions,
      artOptions,
      realmOptions,
      art,
      hungerValue: actor.system.gamesystem === 'vampire' && actor.type !== 'ghoul' ? actor.system.hunger.value : 0,
      actorType: actor.type
    }
    // Render the template
    const content = await renderTemplate(dialogTemplate, dialogData)

    // Render the dialog window to select which skill/attribute combo to use
    new Dialog(
      {
        title: game.i18n.localize('WOD5E.RollList.SelectRoll'),
        content,
        buttons: {
          confirm: {
            icon: '<i class="fas fa-dice"></i>',
            label: game.i18n.localize('WOD5E.Confirm'),
            callback: async html => {
              // Compile the selected data and send it to the roll function
              const skillSelect = html.find('[id=skillSelect]').val()
              const attributeSelect = html.find('[id=attributeSelect]').val()
              const attributeSelect2 = html.find('[id=attributeSelect2]').val()
              const disciplineSelect = html.find('[id=disciplineSelect]').val()
              const bloodSurgeCheckbox = html.find('[id=bloodSurge]')
              const artSelect = html.find('[id=artSelect]').val()
              const realmSelect = html.find('[id=realmSelect]').val()
              const renownSelect = html.find('[id=renownSelect]').val()

              // Keep manipulated dataset data in a separate variable
              const modifiedDataset = {
                ...dataset
              }

              // Keep track of what we're constructing the label out of here
              const labelArray = []
              const valueArray = []
              let selectorsArray = []

              // Handle adding a skill to the dicepool
              if (skillSelect) {
                // Add it to the label
                labelArray.push(await WOD5E.api.generateLabelAndLocalize({ string: skillSelect, type: 'skills' }))

                // Add it to the value path if applicable
                valueArray.push(`skills.${skillSelect}.value`)

                // If using absolute values instead of value paths, add the values together
                if (dataset.useAbsoluteValue && dataset.absoluteValue) modifiedDataset.absoluteValue += actor.system.skills[skillSelect].value

                // Add the attribute selectors to the roll
                selectorsArray = selectorsArray.concat(['skills', `skills.${skillSelect}`])
              }
              // Handle adding an attribute to the dicepool
              if (attributeSelect) {
                // Add it to the label
                labelArray.push(await WOD5E.api.generateLabelAndLocalize({ string: attributeSelect, type: 'attributes' }))

                // Add it to the value path if applicable
                valueArray.push(`attributes.${attributeSelect}.value`)

                // If using absolute values instead of value paths, add the values together
                if (dataset.useAbsoluteValue && dataset.absoluteValue) modifiedDataset.absoluteValue += actor.system.attributes[attributeSelect].value

                // Add the attribute selectors to the roll
                selectorsArray = selectorsArray.concat(['attributes', `attributes.${attributeSelect}`, `${WOD5E.Attributes.getList({})[attributeSelect].type}`])
              }
              // Handle adding a second attribute to the dicepool
              if (attributeSelect2) {
                // Add it to the label
                labelArray.push(await WOD5E.api.generateLabelAndLocalize({ string: attributeSelect2, type: 'attributes' }))

                // Add it to the value path if applicable
                valueArray.push(`attributes.${attributeSelect2}.value`)

                // If using absolute values instead of value paths, add the values together
                if (dataset.useAbsoluteValue && dataset.absoluteValue) modifiedDataset.absoluteValue += actor.system.attributes[attributeSelect2].value

                // Add the attribute selectors to the roll
                selectorsArray = selectorsArray.concat(['attributes', `attributes.${attributeSelect2}`, `${WOD5E.Attributes.getList({})[attributeSelect2].type}`])
              }
              // Handle adding a discipline to the dicepool
              if (disciplineSelect) {
                // Add it to the label
                labelArray.push(await WOD5E.api.generateLabelAndLocalize({ string: disciplineSelect, type: 'discipline' }))

                // Add it to the value path if applicable
                valueArray.push(`disciplines.${disciplineSelect}.value`)

                // If using absolute values instead of value paths, add the values together
                if (dataset.useAbsoluteValue && dataset.absoluteValue) modifiedDataset.absoluteValue += actor.system.disciplines[disciplineSelect].value

                // Add the discipline and potency selectors to the roll
                selectorsArray = selectorsArray.concat(['disciplines', `disciplines.${disciplineSelect}`])
              }
              // Handle adding a blood surge to the roll
              if (bloodSurgeCheckbox[0]?.checked) {
                selectorsArray.push('blood-surge')
              }
              if (artSelect) {
                // Add it to the label
                labelArray.push(await WOD5E.api.generateLabelAndLocalize({ string: artSelect, type: 'art' }))

                // Add it to the value path if applicable
                valueArray.push(`arts.${artSelect}.value`)

                // If using absolute values instead of value paths, add the values together
                if (dataset.useAbsoluteValue && dataset.absoluteValue) modifiedDataset.absoluteValue += actor.system.arts[artSelect].value

                // Add the art and potency selectors to the roll
                selectorsArray = selectorsArray.concat(['arts', `arts.${disciplineSelect}`])
              }
              if (realmSelect) {
                // Add it to the label
                labelArray.push(await WOD5E.api.generateLabelAndLocalize({ string: realmSelect, type: 'realm' }))

                // Add it to the value path if applicable
                valueArray.push(`realms.${realmSelect}.value`)

                // If using absolute values instead of value paths, add the values together
                if (dataset.useAbsoluteValue && dataset.absoluteValue) modifiedDataset.absoluteValue += actor.system.realms[realmSelect].value

                // Add the realm and potency selectors to the roll
                selectorsArray = selectorsArray.concat(['realms', `realms.${realmSelect}`])
              }
              // Handle adding the resistance selector to the roll
              if (dataset?.resistance) {
                selectorsArray.push('resistance')
              }
              // Handle adding a renown to the dicepool
              if (renownSelect) {
                // Add it to the label
                labelArray.push(await WOD5E.api.generateLabelAndLocalize({ string: renownSelect, type: 'renown' }))

                // Add it to the value path if applicable
                valueArray.push(`renown.${renownSelect}.value`)

                // If using absolute values instead of value paths, add the values together
                if (dataset.useAbsoluteValue && dataset.absoluteValue) modifiedDataset.absoluteValue += actor.system.renown[renownSelect].value

                // Add the renown selector to the roll
                selectorsArray = selectorsArray.concat(['renown', `renown.${renownSelect}`])
              }

              // If we're not provided a label, construct one out of the elements of the array
              if (!modifiedDataset?.label) modifiedDataset.label = labelArray.join(' + ')
              // Join the value array
              modifiedDataset.valuePaths = valueArray.join(' ')
              // Join the selectors
              modifiedDataset.selectors = selectorsArray.join(' ')

              await _onConfirmRoll(modifiedDataset, actor)
            }
          },
          cancel: {
            icon: '<i class="fas fa-times"></i>',
            label: game.i18n.localize('WOD5E.Cancel')
          }
        },
        default: 'confirm'
      },
      {
        classes: ['wod5e', actor.system.gamesystem, 'dialog']
      }
    ).render(true)
  }

  // Function to grab the values of any given paths and add them up as the total number of basic dice for the roll
  static async getFlavorDescription ({
    valuePath = '',
    data = {}
  }) {
    // Look up the path and grab the value
    const properties = valuePath.split('.')

    let pathValue = data
    for (const prop of properties) {
      pathValue = pathValue[prop]

      if (pathValue === undefined) break // Break the loop if property is not found
    }

    return pathValue
  }

  // Function to grab the values of any given paths and add them up as the total number of basic dice for the roll
  static async getBasicDice ({
    valuePaths = [],
    flatMod = 0,
    actor = game.actors.get(ChatMessage.getSpeaker().actor)
  }) {
    // Top-level variables
    const actorData = actor.system

    // Secondary variables
    // We check if we're receiving an array; if not, split it into one
    const valueArray = valuePaths.constructor === Array ? valuePaths : valuePaths.split(' ')
    // Start with any flat modifiers or 0 if we have none
    let total = parseInt(flatMod) || 0

    // Look up the path and grab the value
    for (const path of valueArray) {
      const properties = path.split('.')

      let pathValue = actorData
      for (const prop of properties) {
        pathValue = pathValue[prop]

        if (pathValue === undefined) break // Break the loop if property is not found
      }

      // Add the value from the path to the total; if the value isn't a number, just default to 0
      total += typeof pathValue === 'number' ? pathValue : 0
    }

    return total
  }

  // Function to construct what the advanced dice of the actor's roll should be and total to
  static async getAdvancedDice ({
    actor = game.actors.get(ChatMessage.getSpeaker().actor)
  }) {
    // Top-level variables
    const actorData = actor.system

    if (actor.system.gamesystem === 'vampire' && actor.type !== 'ghoul') {
      // Define actor's hunger dice, ensuring it can't go below 0
      const hungerDice = Math.max(actorData?.hunger?.value, 0)

      return hungerDice
    } else if (actor.system.gamesystem === 'werewolf') {
      // Define actor's rage dice, ensuring it can't go below 0
      const rageDice = Math.max(actorData?.rage?.value, 0)

      return rageDice
    } else if (actor.system.gamesystem === "changeling") {
      // Define actor's nightmare dice, ensuring it can't go below 0
      const nightmareDice = Math.max(actorData?.nightmare?.value, 0)

      return nightmareDice
    } else {
      // Hunters will handle their Desperation dice in the roll dialog
      // Mortals and ghouls don't need this
      return 0
    }
  }

  static generateLabelAndLocalize ({
    string = '',
    type = ''
  }) {
    return generateLocalizedLabel(string, type)
  }
}
