import { _onAddNewRoll } from './scripts/on-add-new-dice.js'
import { _onOpenRollBuilder } from './scripts/on-open-roll-builder.js'
import { _onPromptInChat } from './scripts/on-prompt-in-chat.js'
import { _onRemoveSavedRoll } from './scripts/on-remove-roll.js'
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
      title: 'WOD5E.RollList.RollMenu',
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
      promptInChat: _onPromptInChat,
      removeSavedRoll: _onRemoveSavedRoll,
      openRollBuilder: _onOpenRollBuilder
    }
  }

  static PARTS = {
    sidebar: {
      template: 'systems/wod5e/display/ui/roll-menu/sidebar.hbs'
    },
    body: {
      template: 'systems/wod5e/display/ui/roll-menu/body.hbs'
    }
  }

  async _prepareContext() {
    const data = await super._prepareContext()
    const rollMenuSavedRolls = game.users.current.getFlag('wod5e', 'rollMenuSavedRolls') || {}

    data.activeRollID = game.users.current.getFlag('wod5e', 'rollMenuActiveRoll') || ''
    data.allRolls = rollMenuSavedRolls

    // Simple and performant way to snip out the 'temp' key here
    // eslint-disable-next-line no-unused-vars
    data.savedRolls = (({ temp, ...rolls }) => rolls)(rollMenuSavedRolls ?? {})

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
          context.activeRoll = context.allRolls[context.activeRollID]
        }

        break
    }

    return context
  }

  static async applicationHandler(event, form, formData) {
    const data = formData.object

    let activeRoll = game.users.current.getFlag('wod5e', 'rollMenuActiveRoll') || ''

    // If there's no active roll, save to a 'temp' ID that's used for the roll builder
    if (!activeRoll) {
      activeRoll = 'temp'
      game.users.current.setFlag('wod5e', 'rollMenuActiveRoll', activeRoll)
    }

    // If there is an active roll, we can update it as input fields are updated
    const savedRolls = game.users.current.getFlag('wod5e', 'rollMenuSavedRolls') || {}

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
    await game.users.current.setFlag('wod5e', 'rollMenuSavedRolls', savedRolls)

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
      <div title="${game.i18n.localize('WOD5E.RollList.WhatIsRollMenuDescription')}">
        <i class="fa-solid fa-circle-info"></i> <i>${game.i18n.localize('WOD5E.RollList.WhatIsRollMenu')}</i>
      </div>
    `

    html.querySelector('.window-header .window-title').after(explanationElement)
  }
}
