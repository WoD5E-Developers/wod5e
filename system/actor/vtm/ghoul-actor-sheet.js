/* global game, foundry */

import { MortalActorSheet } from '../mortal-actor-sheet.js'
import { prepareDisciplines, prepareDisciplinePowers } from './scripts/prepare-data.js'
import { _onAddDiscipline, _onRemoveDiscipline, _onDisciplineToChat } from './scripts/disciplines.js'

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {MortalActorSheet}
 */

export class GhoulActorSheet extends MortalActorSheet {
  /** @override */
  static get defaultOptions () {
    // Define the base list of CSS classes
    const classList = ['ghoul-sheet', 'vampire']
    classList.push(...super.defaultOptions.classes)

    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: classList,
      template: 'systems/vtm5e/display/vtm/actors/ghoul-sheet.hbs'
    })
  }

  /** @override */
  get template () {
    if (!game.user.isGM && this.actor.limited) return 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
    return 'systems/vtm5e/display/vtm/actors/ghoul-sheet.hbs'
  }

  constructor (actor, options) {
    super(actor, options)
    this.hasBoons = true
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    // Top-level variables
    const data = await super.getData()

    // Prepare items
    await this._prepareItems(data)

    return data
  }

  /** Prepare item data for the Ghoul/Vampire actor */
  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    // Top-level variables
    const actorData = sheetData.actor

    // Prepare discipline data
    actorData.system.disciplines = await prepareDisciplines(actorData)

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      // Make sure the item is a power and has a discipline that exists
      if (i.type === 'power' && actorData.system.disciplines[i.system.discipline]) {
        // Append to disciplines list
        actorData.system.disciplines[i.system.discipline].powers.push(i)
      }
    }

    // Sort discipline powers
    actorData.system.disciplines = await prepareDisciplinePowers(actorData.system.disciplines)
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Add a new discipline to the sheet
    html.find('.add-discipline').click(_onAddDiscipline.bind(this))

    // Remove a discipline from the sheet
    html.find('.discipline-delete').click(_onRemoveDiscipline.bind(this))

    // Post Discipline description to the chat
    html.find('.discipline-chat').click(_onDisciplineToChat.bind(this))
  }
}
