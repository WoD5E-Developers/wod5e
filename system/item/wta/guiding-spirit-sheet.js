// Preparation functions
import {
  prepareDescriptionContext,
  prepareModifiersContext,
  prepareItemSettingsContext
} from '../scripts/prepare-partials.js'
import { prepareGuidingSpiritDetailsContext } from './scripts/prepare-partials.js'
// Base item sheet to extend from
import { WoDItemBase } from '../wod-item-base.js'
import { _onRemoveItem } from '../scripts/on-remove-item.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItemBase document
 * @extends {WoDItemBase}
 */
export class GuidingSpiritItemSheet extends HandlebarsApplicationMixin(WoDItemBase) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {
      removeGuidingSpirit: _onRemoveItem
    }
  }

  _getHeaderControls() {
    const controls = super._getHeaderControls()
    const item = this.item

    if (item?.isOwned) {
      controls.push({
        icon: 'fas fa-trash',
        label: 'WOD5E.WTA.RemoveGuidingSpirit',
        action: 'removeGuidingSpirit'
      })
    }

    return controls
  }

  static PARTS = {
    header: {
      template: 'systems/wod5e/display/wta/items/guiding-spirit-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/wod5e/display/shared/items/parts/description.hbs',
      scrollable: ['']
    },
    details: {
      template: 'systems/wod5e/display/wta/items/parts/guiding-spirit-details.hbs',
      scrollable: ['']
    },
    modifiers: {
      template: 'systems/wod5e/display/shared/items/parts/modifiers.hbs',
      scrollable: ['']
    },
    settings: {
      template: 'systems/wod5e/display/shared/items/parts/item-settings.hbs',
      scrollable: ['']
    }
  }

  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    details: {
      id: 'details',
      group: 'primary',
      label: 'WOD5E.Details'
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
      case 'details':
        return prepareGuidingSpiritDetailsContext(context, item)
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }
}
