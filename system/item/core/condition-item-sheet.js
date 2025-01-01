/* global foundry */

// Preparation functions
import { prepareDescriptionContext, prepareModifiersContext, prepareEffectsContext, prepareItemSettingsContext } from '../scripts/prepare-partials.js'
import { _onAddEffect, _onRemoveEffect } from './scripts/effects.js'
import { getEffectKeys } from './scripts/get-effect-keys.js'
// Base item sheet to extend from
import { WoDItem } from '../wod-item-base.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the WoDItem document
 * @extends {WoDItem}
 */
export class ConditionItemSheet extends HandlebarsApplicationMixin(WoDItem) {
  static DEFAULT_OPTIONS = {
    classes: ['wod5e', 'item', 'sheet'],
    actions: {
      addEffect: _onAddEffect,
      removeEffect: _onRemoveEffect
    }
  }

  static PARTS = {
    header: {
      template: 'systems/vtm5ec/display/shared/items/condition-sheet.hbs'
    },
    tabs: {
      template: 'templates/generic/tab-navigation.hbs'
    },
    description: {
      template: 'systems/vtm5ec/display/shared/items/parts/description.hbs'
    },
    modifiers: {
      template: 'systems/vtm5ec/display/shared/items/parts/modifiers.hbs'
    },
    effects: {
      template: 'systems/vtm5ec/display/shared/items/parts/effects.hbs'
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
    modifiers: {
      id: 'modifiers',
      group: 'primary',
      label: 'WOD5E.ItemsList.Modifiers'
    },
    effects: {
      id: 'effects',
      group: 'primary',
      label: 'WOD5E.ItemsList.Effects'
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
    const item = this.item
    const itemData = item.system

    data.suppressed = itemData.suppressed

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
      case 'modifiers':
        return prepareModifiersContext(context, item)
      case 'effects':
        return prepareEffectsContext(context, item)
      case 'settings':
        return prepareItemSettingsContext(context, item)
    }

    return context
  }

  async _onRender () {
    super._onRender()

    const html = $(this.element)
    const item = this.item

    // Input for the list of keys
    const input = html.find('.effectKeys')

    // List of keys to choose from
    const data = getEffectKeys()

    input.flexdatalist({
      selectionRequired: 1,
      minLength: 1,
      searchIn: ['displayName'],
      multiple: true,
      valueProperty: 'id',
      searchContain: true,
      data
    })

    input.on('change:flexdatalist', function (event) {
      event.preventDefault()

      // Input for the list of keys
      const values = $(this).flexdatalist('value')

      const effect = event.target.closest('[data-effect-id]')
      const effectId = effect.dataset.effectId

      item.update({
        [`system.effects.${effectId}.keys`]: values
      })
    })
  }
}
