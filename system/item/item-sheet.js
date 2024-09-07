/* global ItemSheet, foundry, TextEditor, WOD5E */

import { _onAddBonus, _onDeleteBonus, _onEditBonus } from './scripts/item-bonuses.js'
import { getDicepoolList } from '../api/dicepool-list.js'

/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class WoDItemSheet extends ItemSheet {
  /** @override */
  static get defaultOptions () {
    // Define the base list of CSS classes
    const classList = ['wod5e', 'sheet', 'item']

    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: classList,
      width: 530,
      height: 400,
      tabs: [{
        navSelector: '.sheet-tabs',
        contentSelector: '.sheet-body',
        initial: 'description'
      }]
    })
  }

  /** @override */
  get template () {
    const itemType = this.item.type
    const gamesystem = this.item.system.gamesystem
    let path = ''

    // Append gamesystem
    if (gamesystem === 'vampire') {
      this.options.classes.push(...['vampire'])
    } else if (gamesystem === 'hunter') {
      this.options.classes.push(...['hunter'])
    } else if (gamesystem === 'werewolf') {
      this.options.classes.push(...['werewolf'])
    } else {
      this.options.classes.push(...['mortal'])
    }

    // Handle which path to use to determine where the item template is
    if (itemType === 'power') {
      path = 'systems/vtm5e/display/vtm/items/item-discipline-sheet.hbs'
    } else if (itemType === 'perk' || itemType === 'edgepool') {
      path = `systems/vtm5e/display/htr/items/item-${itemType}-sheet.hbs`
    } else if (itemType === 'gift') {
      path = `systems/vtm5e/display/wta/items/item-${itemType}-sheet.hbs`
    } else {
      path = `systems/vtm5e/display/shared/items/item-${itemType}-sheet.hbs`
    }

    return path
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    const data = await super.getData()

    const item = data.document
    const itemData = item.system

    // Encrich editor content
    data.enrichedDescription = await TextEditor.enrichHTML(itemData.description)
    data.bonuses = itemData.bonuses

    if (!itemData.gamesystem && this.actor) {
      switch (this.actor.system.gamesystem) {
        case 'vampire':
          itemData.gamesystem = 'vampire'
          break
        case 'werewolf':
          itemData.gamesystem = 'werewolf'
          break
        case 'hunter':
          itemData.gamesystem = 'hunter'
          break
        default:
          itemData.gamesystem = 'mortal'
          break
      }
    }

    // Localize dicepool labels
    const dicepool = itemData?.dicepool
    if (dicepool) {
      for (const [, value] of Object.entries(dicepool)) {
        if (value.path) {
          const dicePartials = value.path.split('.')
          const diceCategory = dicePartials[0]
          const diceKey = dicePartials[1]

          value.label = WOD5E.api.generateLabelAndLocalize({ string: diceKey, type: diceCategory })
        }
      }
    }

    data.diceOptions = await getDicepoolList(item)

    data.featureTypes = {
      merit: 'WOD5E.ItemsList.Merit',
      flaw: 'WOD5E.ItemsList.Flaw',
      background: 'WOD5E.ItemsList.Background',
      boon: 'WOD5E.ItemsList.Boon'
    }

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Top-level Variables
    const item = this.item

    // Prompt the dialog to add a new bonus
    html.find('.add-bonus').click(async event => {
      _onAddBonus(event, item)
    })

    // Delete a bonus
    html.find('.delete-bonus').click(async event => {
      _onDeleteBonus(event, item)
    })

    // Prompt the dialog to edit a bonus
    html.find('.edit-bonus').click(async event => {
      _onEditBonus(event, item)
    })

    // Add a new section to a dicepool
    html.find('.add-dice').click(this._onAddDice.bind(this))

    // Remove a section from a dicepool
    html.find('.remove-dice').click(this._onRemoveDice.bind(this))
  }

  // Handle adding a new section to a dicepool
  async _onAddDice (event) {
    event.preventDefault()

    // Top-level variables
    const item = this.item

    // Secondary variables
    const randomID = foundry.utils.randomID(8)

    // Append a new dice to the dicepool
    const defaultData = {
      path: 'attributes.strength'
    }

    await item.update({ [`system.dicepool.${randomID}`]: defaultData })
  }

  // Handle removing a section from a dicepool
  async _onRemoveDice (event) {
    event.preventDefault()

    // Top-level variables
    const item = this.item

    // Secondary variables
    const diceID = event.currentTarget.dataset.diceId

    await item.update({ [`system.dicepool.-=${diceID}`]: null })
  }
}
