import { getItems } from './scripts/get-items.js'

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class CompendiumBrowserApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  static DEFAULT_OPTIONS = {
    tag: 'form',
    id: 'wod5e-compendium-browser',
    form: {
      submitOnChange: true,
      handler: CompendiumBrowserApplication.applicationHandler
    },
    window: {
      icon: 'fa-solid fa-dice-d10',
      title: 'WOD5E.CompendiumBrowser.Label',
      resizable: true
    },
    classes: ['wod5e', 'dialog-app', 'sheet', 'application', 'compendium-browser'],
    position: {
      width: 900,
      height: 500
    },
    actions: {}
  }

  constructor(application, options) {
    super(application, options)
  }

  _getHeaderControls() {
    const controls = super._getHeaderControls()

    controls.push({
      icon: 'fa-solid fa-passport',
      label: 'WOD5E.CompendiumBrowser.ConfigureSources',
      action: 'configureSources'
    })

    return controls
  }

  static PARTS = {
    sidebar: {
      template: 'systems/wod5e/display/ui/compendium-browser/sidebar.hbs'
    },
    body: {
      template: 'systems/wod5e/display/ui/compendium-browser/body.hbs'
    }
  }

  async _prepareContext() {
    const data = await super._prepareContext()

    // Splat definitions
    data.splatOptions = WOD5E.Systems.getList({})

    data.filters = {}

    data.itemsInList = await getItems({
      type: 'clan'
    })

    console.log(data)

    return data
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options)

    switch (partId) {
      case 'sidebar':
        // Part-specific data
        //console.log('Test1')

        break
      case 'body':
        // Part-specific data
        //console.log('Test2')

        break
    }

    return context
  }

  static async applicationHandler(event, form, formData) {
    const data = formData.object

    console.log(data)

    // Re-render the application
    this.render()
  }
}
