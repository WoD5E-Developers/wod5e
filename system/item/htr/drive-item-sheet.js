// Preparation functions
import {
  prepareDescriptionContext,
  prepareModifiersContext,
  prepareItemSettingsContext
} from '../scripts/prepare-partials.js'
import { prepareRedemptionContext } from './scripts/prepare-partials.js'
// Base item sheet to extend from
import { WoDItemBase } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItemBase document
 * @extends {WoDItemBase}
 */
export class DriveItemSheet extends HandlebarsApplicationMixin(WoDItemBase) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/wod5e/display/htr/items/drive-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/wod5e/display/shared/items/parts/description.hbs'
    },
    redemption: {
      template: 'systems/wod5e/display/htr/items/parts/redemption.hbs'
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
    redemption: {
      id: 'redemption',
      group: 'primary',
      label: 'WOD5E.HTR.Redemption'
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
      case 'redemption':
        return prepareRedemptionContext(context, item)
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }
}
