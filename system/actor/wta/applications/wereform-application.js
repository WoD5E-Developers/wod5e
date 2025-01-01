/* global foundry, game, TextEditor */

import { generateLocalizedLabel } from '../../../api/generate-localization.js'
const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class WereformApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor (data) {
    super()

    this.data = data
  }

  get title () {
    return `Wereform Editor - ${generateLocalizedLabel(this.data.form, 'wereform')}`
  }

  get document () {
    return game.actors.get(this.data.actor._id)
  }

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      submitOnChange: true,
      handler: WereformApplication.wereformHandler
    },
    window: {
      icon: 'fas fa-gear',
      title: 'WereForm Editor',
      resizable: true
    },
    classes: ['wod5e', 'sheet', 'werewolf', 'application', 'wereform'],
    position: {
      width: 480,
      height: 400
    },
    actions: {}
  }

  static PARTS = {
    form: {
      template: 'systems/vtm5ec/display/wta/applications/wereform-application/wereform-application.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5ec/display/wta/applications/wereform-application/parts/description.hbs'
    },
    tokenSettings: {
      template: 'systems/vtm5ec/display/wta/applications/wereform-application/parts/token-settings.hbs'
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
    tokenSettings: {
      id: 'token-settings',
      group: 'primary',
      icon: '',
      label: 'WOD5E.Tabs.TokenSettings'
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
    data.formData = actorData.forms[data.form]

    return data
  }

  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)
  }

  async _preparePartContext (partId, context) {
    switch (partId) {
      // Description
      case 'description':
        // Tab data
        context.tab = context.tabs.description

        // Part-specific data
        context.formDescription = context.formData?.description || ''
        context.enrichedDescription = await TextEditor.enrichHTML(context.formData?.description || '')

        break

      // Token settings
      case 'tokenSettings':
        // Tab data
        context.tab = context.tabs.tokenSettings

        // Part-specific data
        context.formTokenImg = context.formData.token.img

        break
    }

    return context
  }

  static async wereformHandler (event, form, formData) {
    // Update the source document
    await this.document.update(formData.object)

    // Re-render the application
    this.render()
  }
}
