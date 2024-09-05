/* global foundry, game, TextEditor */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class WereformApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor (data) {
    super()

    this.data = data
  }

  get title () {
    return `Wereform Editor - ${this.data.formName}`;
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
      height: 400,
    },
    actions: {}
  }

  static PARTS = {
    form: {
      template: 'systems/vtm5e/display/wta/applications/wereform.hbs'
    }
  }

  async _prepareContext () {
    // Top-level variables
    const data = this.data
    const actorData = this.document.system

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

  static async wereformHandler (event, form, formData) {
    // Update the source document
    await this.document.update(formData.object)

    // Re-render the application
    this.render()
  }
}
