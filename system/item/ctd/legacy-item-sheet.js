/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareModifiersContext, prepareItemSettingsContext } from '../scripts/prepare-partials.js'
import { prepareLegacyBanContext } from './scripts/prepare-partials.js'
// Base item sheet to extend from
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItem document
 * @extends {WoDItem}
 */
export class LegacyItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5ec/display/ctd/items/legacy-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5ec/display/shared/items/parts/description.hbs'
    },
    ban: {
      template: 'systems/vtm5ec/display/ctd/items/parts/ban.hbs'
    },
    modifiers: {
      template: 'systems/vtm5ec/display/shared/items/parts/modifiers.hbs'
    },
    settings: {
      template: 'systems/vtm5ec/display/shared/items/parts/item-settings.hbs'
    }
  }

  tabs = {
    description: {
      id: 'description',
      group: 'primary',
      label: 'WOD5E.Tabs.Description'
    },
    ban: {
      id: 'ban',
      group: 'primary',
      label: 'WOD5E.CTD.LegacyBan'
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
      case 'ban':
        return prepareLegacyBanContext(context, item)
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }
}
