/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareDicepoolContext, prepareMacroContext, prepareBonusesContext } from '../scripts/prepare-partials.js'
// Base item sheet to extend from
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItem document
 * @extends {WoDItem}
 */
export class CustomRollItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {}
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5e/display/shared/items/custom-roll-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5e/display/shared/items/parts/description.hbs'
    },
    dicepool: {
      template: 'systems/vtm5e/display/shared/items/parts/dicepool.hbs'
    },
    macro: {
      template: 'systems/vtm5e/display/shared/items/parts/macro.hbs'
    },
    bonuses: {
      template: 'systems/vtm5e/display/shared/items/parts/bonuses.hbs'
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
      label: 'WOD5E.Tabs.Dicepool'
    },
    macro: {
      id: 'macro',
      group: 'primary',
      label: 'WOD5E.ItemsList.Macro'
    },
    bonuses: {
      id: 'bonuses',
      group: 'primary',
      label: 'WOD5E.ItemsList.Bonuses'
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
      case 'dicepool':
        return prepareDicepoolContext(context, item)
      case 'macro':
        return prepareMacroContext(context, item)
      case 'bonuses':
        return prepareBonusesContext(context, item)
    }

    return context
  }
}
