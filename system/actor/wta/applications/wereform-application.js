/* global foundry, game, TextEditor */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class WereformApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor (data) {
    super()

    this.data = data
  }

  get title () {
    return `Wereform Editor - ${this.data.formName}`
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
      title: 'WereForm Editor'
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
      template: 'systems/vtm5e/display/wta/applications/wereform-application/wereform-application.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/wta/applications/wereform-application/parts/description.hbs'
    },
    tokenSettings: {
      template: 'systems/vtm5e/display/wta/applications/wereform-application/parts/token-settings.hbs'
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

  #getTabs() {
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
    data.formDescription = actorData.forms[data.form].description
    data.enrichedDescription = await TextEditor.enrichHTML(actorData.forms[data.form].description)

    data.formTokenImg = actorData.forms[data.form].token.img

    return data
  }

  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)
  }

  async _preparePartContext(partId, context) {
    switch (partId) {
      // Description
      case 'description':
        context.tab = context.tabs.description
        break

      // Token settings
      case 'tokenSettings':
        context.tab = context.tabs.tokenSettings
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
