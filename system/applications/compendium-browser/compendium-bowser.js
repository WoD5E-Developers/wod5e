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
    },
    dragDrop: [
      {
        dragSelector: '[data-drag]',
        dropSelector: null
      }
    ]
  }

  constructor(application, options) {
    super(application, options)

    this.#dragDrop = this.#createDragDropHandlers()

    this.filters = {
      text: {
        string: ''
      },
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
            splat: item.splat,
            subtypes: Object.entries(item?.subtypes ? item?.subtypes.getList({}) : {}).map(
              ([id, subtype]) => {
                return {
                  id,
                  label: subtype.label,
                  enabled: true
                }
              }
            ),
            subtypePath: item.subtypePath,
            enabled: true,
            hidden: false
          }
        })
      },
      sources: []
    }

    // If a "type" was provided by the application, disable all other types
    if (application?.type) {
      const typesToUpdate = this.filters.types.options.filter(
        (itemType) => itemType.id != application.type
      )

      typesToUpdate.forEach((itemType) => {
        itemType.enabled = false
      })

      // If a "subtype" was provided too, further filter down
      if (application?.subtype) {
        const subtypesToUpdate = this.filters.types.options
          .filter((itemType) => itemType.id === application.type)[0]
          .subtypes.filter((itemSubtype) => itemSubtype.id != application.subtype)

        subtypesToUpdate.forEach((itemSubtype) => {
          itemSubtype.enabled = false
        })
      }
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
    data.enabledTypes = this.filters.types.options
      .filter((type) => type.enabled && !type.hidden)
      .map((type) => ({
        id: type.id,
        subtypePath: type?.subtypePath,
        subtypes: type?.subtypes.filter((subtype) => subtype.enabled).map((subtype) => subtype.id)
      }))
    data.textFilter = this.filters.text?.string || ''

    return data
  }

  async _preparePartContext(partId, context, options) {
    context = await super._preparePartContext(partId, context, options)

    switch (partId) {
      case 'sidebar':
        // Part-specific data
        context.splatFilterOptions = this.filters.splats.options
        context.typeFilterOptions = this.filters.types.options.filter((option) => !option.hidden)

        break
      case 'body':
        // Part-specific data
        // Grab which items should be listed
        context.itemsInList = await getItems({
          types: context.enabledTypes,
          subtypePath: context.subtypePath,
          text: context.textFilter
        })

        break
    }

    return context
  }

  static async applicationHandler(event, form, formData) {
    const data = formData.object

    // Grab what string we're using for the search and set it in our filters
    this.filters.text.string = data?.search || ''

    // Re-render the body, since it's the only part we're modifying
    this.render(false, {
      parts: ['body']
    })
  }

  async _onRender() {
    // Drag and drop functionality
    this.#dragDrop.forEach((d) => d.bind(this.element))
  }

  #createDragDropHandlers() {
    return this.options.dragDrop.map((d) => {
      d.permissions = {
        dragstart: true,
        drop: false
      }

      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this)
      }
      return new foundry.applications.ux.DragDrop(d)
    })
  }

  #dragDrop

  _onDragStart(event) {
    const dataset = event.target.dataset
    if ('link' in dataset) return

    // Extract the data you need
    const dragData = {
      type: dataset.type,
      uuid: dataset.documentUuid
    }

    if (!dragData) return

    // Set data transfer
    event.dataTransfer.setData('text/plain', JSON.stringify(dragData))
  }

  _onDragOver() {}
}
