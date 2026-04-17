import { _onToggleDropdown, _onUpdateFilter } from './scripts/dropdown-actions.js'
import { getItems } from './scripts/get-items.js'
import { _onOpenItem } from './scripts/on-open-item.js'

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
    actions: {
      toggleDropdown: _onToggleDropdown,
      updateFilter: _onUpdateFilter,
      openItem: _onOpenItem
    }
  }

  constructor(application, options) {
    super(application, options)

    this.filters = {
      splats: {
        open: true,
        options: Object.entries(WOD5E.Systems.getList({})).map(([id, system]) => {
          return {
            id,
            label: system.label,
            enabled: true
          }
        })
      },
      types: {
        open: false,
        options: Object.entries(WOD5E.ItemTypes.getList({})).map(([id, item]) => {
          return {
            id,
            label: item.label,
            system: item.system,
            enabled: true
          }
        })
      },
      sources: []
    }
  }

  _getHeaderControls() {
    const controls = super._getHeaderControls()

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

    // Filter down to which ones are enabled and map to an array of strings
    data.splatFilterStatus = this.filters.splats.open
    data.enabledSplats = this.filters.splats.options
      .filter((splat) => splat.enabled)
      .map((splat) => splat.id)
    data.itemFilterStatus = this.filters.types.open
    data.enabledItems = this.filters.types.options
      .filter((type) => type.enabled)
      .map((type) => type.id)

    // Grab which items should be listed
    data.itemsInList = await getItems({
      types: data.enabledItems
    })

    return data
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options)

    switch (partId) {
      case 'sidebar':
        // Part-specific data
        context.splatFilterOptions = this.filters.splats.options
        context.typeFilterOptions = this.filters.types.options

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
