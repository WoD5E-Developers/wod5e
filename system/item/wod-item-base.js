/* global foundry */

// Preparation functions
import { getDicepoolList } from '../api/dicepool-list.js'
import { getSelectorsList } from '../api/get-selectors-list.js'
// Various button functions
import { _onAddBonus, _onDeleteBonus, _onEditBonus } from './scripts/item-bonuses.js'
import { _onAddDice, _onRemoveDice } from './scripts/dicepools.js'
import { _onEditImage } from './scripts/on-edit-image.js'
import { _onFormatDataId } from './scripts/on-format-data-id.js'
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
      addBonus: _onAddBonus,
      deleteBonus: _onDeleteBonus,
      editBonus: _onEditBonus,
      editImage: _onEditImage,
      formatDataId: _onFormatDataId
    }
  }

  _getHeaderControls () {
    const controls = super._getHeaderControls()

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
    const input = html.find('.bonus-selectors')
    // Style the selectors properly
    const data = getSelectorsList(this.item)
    input.flexdatalist({
      selectionRequired: 1,
      minLength: 1,
      searchIn: ['displayName'],
      multiple: true,
      valueProperty: 'id',
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
