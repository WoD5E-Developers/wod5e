/* global foundry, game, TextEditor */

import { _onAddBonus, _onEditBonus, _onDeleteBonus } from './scripts/specialty-bonuses.js'
import { generateLocalizedLabel } from '../../api/generate-localization.js'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class SkillApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor (data) {
    super()

    this.data = data
  }

  get title () {
    const skillName = generateLocalizedLabel(this.data.skill, 'skill')
    return `Skill Editor - ${skillName}`
  }

  get document () {
    return game.actors.get(this.data.actor._id)
  }

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      submitOnChange: true,
      handler: SkillApplication.skillHandler
    },
    window: {
      icon: 'fas fa-gear',
      title: 'Skill Editor',
      resizable: true
    },
    classes: ['wod5e', 'dialog-app', 'sheet', 'application'],
    position: {
      width: 480,
      height: 400
    },
    actions: {
      addBonus: _onAddBonus,
      editBonus: _onEditBonus,
      deleteBonus: _onDeleteBonus
    }
  }

  static PARTS = {
    form: {
      template: 'systems/vtm5e/display/shared/applications/skill-application/skill-application.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/shared/applications/skill-application/parts/description.hbs'
    },
    macro: {
      template: 'systems/vtm5e/display/shared/applications/skill-application/parts/macro.hbs'
    },
    bonuses: {
      template: 'systems/vtm5e/display/shared/applications/skill-application/parts/bonuses.hbs'
    }
  }

  tabGroups = {
    primary: 'description'
  }

  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      icon: '',
      label: 'WOD5E.Tabs.Description'
    },
    macro: {
      id: 'macro',
      group: 'primary',
      icon: '',
      label: 'WOD5E.ItemsList.Macro'
    },
    bonuses: {
      id: 'bonuses',
      group: 'primary',
      icon: '',
      label: 'WOD5E.SkillsList.Specialties'
    }
  }

  #getTabs () {
    const tabs = this.tabs

    for (const tab of Object.values(tabs)) {
      tab.active = this.tabGroups[tab.group] === tab.id
      tab.cssClass = tab.active ? 'active' : ''
    }

    return tabs
  }

  async _prepareContext () {
    // Top-level variables
    const data = this.data
    const actorData = this.document.system

    // Prepare tabs
    data.tabs = this.#getTabs()

    // Define the data the template needs
    data.skillData = actorData.skills[this.data.skill]

    return data
  }

  async _preparePartContext (partId, context) {
    switch (partId) {
      // Description
      case 'description':
        // Tab data
        context.tab = context.tabs.description

        // Part-specific data
        context.description = context.skillData.description
        context.enrichedDescription = await TextEditor.enrichHTML(context.skillData.description)

        break

      // Macro
      case 'macro':
        // Tab data
        context.tab = context.tabs.macro

        // Part-specific data
        context.macroid = context.skillData.macroid

        break

      // Bonuses
      case 'bonuses':
        // Tab data
        context.tab = context.tabs.bonuses

        // Part-specific data
        context.bonuses = context.skillData.bonuses

        break
    }

    return context
  }

  static async skillHandler (event, form, formData) {
    // Update the source document
    await this.document.update(formData.object)

    // Re-render the application
    this.render()
  }
}
