/* global foundry */

// Preparation functions
import { getDicepoolList } from '../api/dicepool-list.js'
import { getSelectorsList } from '../api/get-selectors-list.js'
// Various button functions
import { _onAddModifier, _onDeleteModifier, _onEditModifier } from './scripts/item-modifiers.js'
import { _onAddDice, _onRemoveDice } from './scripts/dicepools.js'
import { _onEditImage } from './scripts/on-edit-image.js'
import { _onFormatDataId } from './scripts/on-format-data-id.js'
import { _onSyncFromDataItem, _onSyncToDataItems } from './scripts/item-syncing.js'
// Mixin
const { HandlebarsApplicationMixin } = foundry.applications.api

/**
 * Extend the base ItemSheetV2 document
 * @extends {foundry.applications.sheets.ItemSheetV2}
 */
export class WoDItem extends HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  constructor (options = {}) {
    super(options)
  }

  static DEFAULT_OPTIONS = {
    form: {
      submitOnChange: true,
      handler: WoDItem.onSubmitItemForm
    },
    window: {
      icon: 'fa-solid fa-dice-d10',
      resizable: true
    },
    classes: ['wod5e', 'item', 'sheet'],
    position: {
      width: 530,
      height: 400
    },
    actions: {
      addDice: _onAddDice,
      removeDice: _onRemoveDice,
      addModifier: _onAddModifier,
      deleteModifier: _onDeleteModifier,
      editModifier: _onEditModifier,
      editImage: _onEditImage,
      formatDataId: _onFormatDataId,
      syncFromDataItem: _onSyncFromDataItem,
      syncToDataItems: _onSyncToDataItems
    }
  }

  _getHeaderControls () {
    const controls = super._getHeaderControls()
    const item = this.item

    if (item?.isOwned) {
      // Allow this item to have its item updated from an existing data item
      controls.push({
        icon: 'fa-solid fa-down-long',
        label: 'WOD5E.ItemsList.SyncFromDataItem',
        action: 'syncFromDataItem'
      })
    } else {
      // Allow this item to update all data items
      controls.push({
        icon: 'fa-solid fa-up-long',
        label: 'WOD5E.ItemsList.SyncToDataItems',
        action: 'syncToDataItems'
      })
    }

    return controls
  }

  tabGroups = {
    primary: 'description'
  }

  getTabs () {
    const tabs = this.tabs

    for (const tab of Object.values(tabs)) {
      tab.active = this.tabGroups[tab.group] === tab.id
      tab.cssClass = tab.active ? 'active' : ''
    }

    return tabs
  }

  async _prepareContext () {
    // Top-level variables
    const data = await super._prepareContext()
    const item = this.item
    const actor = this.actor
    const itemData = item.system

    // Prepare tabs
    data.tabs = this.getTabs()

    // Define the data the template needs
    this.item.system.gamesystem = actor ? actor?.system?.gamesystem : itemData.gamesystem

    // Transform any data needed for sheet rendering
    return {
      ...data,

      name: item.name,
      img: item.img,

      diceOptions: await getDicepoolList(item),

      gamesystem: itemData.gamesystem || 'mortal',

      dataItemId: item.getFlag('vtm5e', 'dataItemId') || ''
    }
  }

  static async onSubmitItemForm (event, form, formData) {
    // Process submit data
    const submitData = this._prepareSubmitData(event, form, formData)

    // Update the item data
    await this.item.update(submitData)
  }

  _onRender () {
    const html = $(this.element)

    // Update the window title (since ItemSheetV2 doesn't do it automatically)
    $(this.window.title).text(this.title)

    // Input for the list of selectors
    const input = html.find('.modifier-selectors')
    // Style the selectors properly
    const data = getSelectorsList()
    input.flexdatalist({
      selectionRequired: 1,
      minLength: 1,
      searchIn: ['displayName'],
      multiple: true,
      valueProperty: 'id',
      searchContain: true,
      data
    })

    // Add a new sheet styling depending on the type of sheet
    const gamesystem = this.item.system.gamesystem
    if (gamesystem === 'vampire') {
      html.removeClass('hunter werewolf mortal')
      html.addClass('vampire')
    } else if (gamesystem === 'hunter') {
      html.removeClass('vampire werewolf mortal')
      html.addClass('hunter')
    } else if (gamesystem === 'werewolf') {
      html.removeClass('hunter vampire mortal')
      html.addClass('werewolf')
    } else {
      // Default to a mortal sheet
      html.removeClass('hunter vampire werewolf')
      html.addClass('mortal')
    }
  }
}
