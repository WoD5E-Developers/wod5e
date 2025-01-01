/* global foundry, game, TextEditor */

import { _onAddModifier, _onEditModifier, _onDeleteModifier } from './scripts/specialty-bonuses.js'
import { generateLocalizedLabel } from '../../api/generate-localization.js'
import { Skills } from '../../api/def/skills.js'
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
      addModifier: _onAddModifier,
      editModifier: _onEditModifier,
      deleteModifier: _onDeleteModifier
    }
  }

  static PARTS = {
    form: {
      template: 'systems/vtm5ec/display/shared/applications/skill-application/skill-application.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5ec/display/shared/applications/skill-application/parts/description.hbs'
    },
    macro: {
      template: 'systems/vtm5ec/display/shared/applications/skill-application/parts/macro.hbs'
    },
    modifiers: {
      template: 'systems/vtm5ec/display/shared/applications/skill-application/parts/modifiers.hbs'
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
    modifiers: {
      id: 'modifiers',
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
        context.description = context.skillData?.description
        context.enrichedDescription = await TextEditor.enrichHTML(context.skillData?.description)

        break

      // Macro
      case 'macro':
        // Tab data
        context.tab = context.tabs.macro

        // Part-specific data
        context.macroid = context.skillData.macroid

        break

      // Modifiers
      case 'modifiers':
        // Tab data
        context.tab = context.tabs.modifiers

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

  _onRender () {
    const html = $(this.element)

    // Input for the list of selectors
    const input = html.find('.modifier-selectors')
    // List of selectors to choose from
    const skillOptions = Skills.getList({
      prependType: true
    })

    const data = Object.entries(skillOptions).map(([id, obj]) => ({
      id,
      ...obj
    }))

    data.unshift({
      id: 'skills',
      displayName: 'All Skills'
    })

    input.flexdatalist({
      selectionRequired: 1,
      minLength: 1,
      searchIn: ['displayName'],
      multiple: true,
      valueProperty: 'id',
      searchContain: true,
      data
    })
  }
}
