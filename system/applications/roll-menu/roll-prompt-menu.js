/* global foundry, game, WOD5E */

import { _onAddNewRoll } from './scripts/on-add-new-dice.js'
import { _onPromptInChat } from './scripts/on-prompt-in-chat.js'
import { _onRollFromRollMenu } from './scripts/on-roll-from-roll-menu.js'
import { _onSelectSavedRoll } from './scripts/on-select-saved-roll.js'

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class RollMenuApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: 'form',
    id: 'wod5e-roll-menu',
    form: {
      submitOnChange: true,
      handler: RollMenuApplication.applicationHandler
    },
    window: {
      icon: 'fa-solid fa-dice-d10',
      title: 'Roll Menu',
      resizable: true
    },
    classes: ['wod5e', 'dialog-app', 'sheet', 'application', 'roll-menu'],
    position: {
      width: 480,
      height: 300
    },
    actions: {
      selectSavedRoll: _onSelectSavedRoll,
      addNewRoll: _onAddNewRoll,
      rollFromRollMenu: _onRollFromRollMenu,
      promptInChat: _onPromptInChat
    }
  }

  static PARTS = {
    savedRolls: {
      template: 'systems/vtm5e/display/ui/parts/roll-menu/saved-rolls.hbs'
    },
    body: {
      template: 'systems/vtm5e/display/ui/parts/roll-menu/main.hbs'
    }
  }

  async _prepareContext() {
    const data = await super._prepareContext()

    data.activeRollID = game.users.current.getFlag('vtm5e', 'rollMenuActiveRoll') || ''
    data.savedRolls = game.users.current.getFlag('vtm5e', 'rollMenuSavedRolls') || {}

    // Splat definitions
    data.splatOptions = WOD5E.Systems.getList({})

    // Attribute definitions
    data.attributeOptions = WOD5E.Attributes.getList({})

    // Skill definitions
    data.skillOptions = WOD5E.Skills.getList({})

    return data
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options)

    switch (partId) {
    case 'body':
      // Part-specific data
      if (context.activeRollID) {
        context.activeRoll = context.savedRolls[context.activeRollID]
      }

      break
    }

    return context
  }

  static async applicationHandler(event, form, formData) {
    const data = formData.object

    let activeRoll = game.users.current.getFlag('vtm5e', 'rollMenuActiveRoll') || ''

    // If there's no active roll, generate a new ID
    if (!activeRoll) {
      activeRoll = foundry.utils.randomID(8)
      game.users.current.setFlag('vtm5e', 'rollMenuActiveRoll', activeRoll)
    }

    // If there is an active roll, we can update it as input fields are updated
    const savedRolls = game.users.current.getFlag('vtm5e', 'rollMenuSavedRolls') || {}

    // Ensure that the savedRolls object exists, then add/update it
    if (savedRolls) {
      savedRolls[activeRoll] = {
        name: data.name,
        difficulty: Math.max(data.difficulty, 0),
        isExtendedRoll: data.extendedRollCheckbox,
        isContestedRoll: data.contestedRollCheckbox,
        dice: {
          skill: data.skillSelect,
          attribute: data.attributeSelect
        }
      }
    }

    // Save the mutated object
    await game.users.current.setFlag('vtm5e', 'rollMenuSavedRolls', savedRolls)

    // Re-render the application
    this.render()
  }

  async _onRender() {
    const html = this.element

    // Check if the Roll Menu Hint already exists
    const existingRollMenuHint = html.querySelector('.roll-menu-hint')
    if (existingRollMenuHint) return

    // Create the Roll Menu Hint if it doesn't already exist
    const explanationElement = document.createElement('div')
    explanationElement.classList.add('roll-menu-hint')
    explanationElement.innerHTML = `
      <div title="The Roll Menu is an application where you can handle all non-actor rolls or rolls that require greater control over the data than what the actor sheets provide. This includes prompting players for specific rolls, constructing extended rolls, and saving custom rolls used across actors.">
        <i class="fa-solid fa-circle-info"></i> <i>What is the Roll Menu?</i>
      </div>
    `

    html.querySelector('.window-header .window-title').after(explanationElement)
  }
}
