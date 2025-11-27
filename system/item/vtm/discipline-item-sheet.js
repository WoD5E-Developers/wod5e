// Preparation functions
import {
  prepareDescriptionContext,
  prepareDicepoolContext,
  prepareMacroContext,
  prepareModifiersContext,
  prepareItemSettingsContext
} from '../scripts/prepare-partials.js'
import { Disciplines } from '../../api/def/disciplines.js'
// Base item sheet to extend from
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItem document
 * @extends {WoDItem}
 */
export class DisciplineItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/wod5e/display/vtm/items/discipline-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/wod5e/display/shared/items/parts/description.hbs'
    },
    dicepool: {
      template: 'systems/wod5e/display/shared/items/parts/dicepool.hbs'
    },
    macro: {
      template: 'systems/wod5e/display/shared/items/parts/macro.hbs'
    },
    modifiers: {
      template: 'systems/wod5e/display/shared/items/parts/modifiers.hbs'
    },
    settings: {
      template: 'systems/wod5e/display/shared/items/parts/item-settings.hbs'
    }
  }

  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    dicepool: {
      id: 'dicepool',
      group: 'primary',
      label: 'WOD5E.Tabs.Dicepool',
      hidden: this.document.parent?.type === 'spc'
    },
    macro: {
      id: 'macro',
      group: 'primary',
      label: 'WOD5E.ItemsList.Macro'
    },
    modifiers: {
      id: 'modifiers',
      group: 'primary',
      label: 'WOD5E.ItemsList.Modifiers'
    },
    settings: {
      id: 'settings',
      group: 'primary',
      label: 'WOD5E.ItemsList.ItemSettings'
    }
  }

  async _prepareContext() {
    // Top-level variables
    const data = await super._prepareContext()
    const item = this.item
    const itemData = item.system

    data.disciplineOptions = Disciplines.getList({})
    data.selectedDiscipline = itemData.discipline
    data.level = itemData.level
    data.cost = itemData.cost

    return data
  }

  async _preparePartContext(partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const item = this.item

    // Prepare each page context
    switch (partId) {
      // Stats
      case 'description':
        return prepareDescriptionContext(context, item)
      case 'dicepool':
        return prepareDicepoolContext(context, item)
      case 'macro':
        return prepareMacroContext(context, item)
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }

  _configureRenderOptions(options) {
    super._configureRenderOptions(options)

    // Hide the "Dicepool" tab from gifts on SPC sheets.
    if (this.document.parent && this.document.parent?.type === 'spc') {
      options.parts = options.parts.filter((item) => item !== 'dicepool')
    }
  }
}
