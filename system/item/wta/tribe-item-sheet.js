/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareBonusesContext, prepareItemSettingsContext } from '../scripts/prepare-partials.js'
import { preparePatronSpiritContext } from './scripts/prepare-partials.js'
// Base item sheet to extend from
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItem document
 * @extends {WoDItem}
 */
export class TribeItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5e/display/wta/items/tribe-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/shared/items/parts/description.hbs'
    },
    patronSpirit: {
      template: 'systems/vtm5e/display/wta/items/parts/patron-spirit.hbs'
    },
    bonuses: {
      template: 'systems/vtm5e/display/shared/items/parts/bonuses.hbs'
    },
    settings: {
      template: 'systems/vtm5e/display/shared/items/parts/item-settings.hbs'
    }
  }

  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    patronSpirit: {
      id: 'patronSpirit',
      group: 'primary',
      label: 'WOD5E.WTA.PatronSpirit'
    },
    bonuses: {
      id: 'bonuses',
      group: 'primary',
      label: 'WOD5E.ItemsList.Bonuses'
    },
    settings: {
      id: 'settings',
      group: 'primary',
      label: 'WOD5E.ItemsList.ItemSettings'
    }
  }

  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext()

    return data
  }

  async _preparePartContext (partId, context, options) {
    // Inherit any preparation from the extended class
    context = { ...(await super._preparePartContext(partId, context, options)) }

    // Top-level variables
    const item = this.item

    // Prepare each page context
    switch (partId) {
      // Stats
      case 'description':
        return prepareDescriptionContext(context, item)
      case 'patronSpirit':
        return preparePatronSpiritContext(context, item)
      case 'bonuses':
        return prepareBonusesContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }
}
