/* global game, foundry */

import { WoDActor } from '../wod-v5-sheet.js'
import { prepareEdges, prepareEdgePowers } from './scripts/prepare-data.js'
import { _onAddEdge, _onRemoveEdge, _onEdgeToChat } from './scripts/edges.js'
import { _onToggleDespair } from './scripts/toggle-despair.js'

/**
 * Extend the WOD5E ActorSheet with some very simple modifications
 * @extends {WoDActor}
 */

export class HunterActorSheet extends WoDActor {
  /** @override */
  static get defaultOptions () {
    // Define the base list of CSS classes
    const classList = ['hunter']
    classList.push(...super.defaultOptions.classes)

    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: classList,
      template: 'systems/vtm5e/display/htr/actors/hunter-sheet.hbs'
    })
  }

  constructor (actor, options) {
    super(actor, options)
    this.despairActive = false
  }

  /** @override */
  get template () {
    if (!game.user.isGM && this.actor.limited) return 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
    return 'systems/vtm5e/display/htr/actors/hunter-sheet.hbs'
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    // Top-level variables
    const data = await super.getData()

    this.actor.system.gamesystem = 'hunter'

    // Prepare items
    await this._prepareItems(data)

    return data
  }

  /** Prepare item data for the Hunter actor */
  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    // Top-level variables
    const actorData = sheetData.actor
    const actor = this.actor

    // Track whether despair is toggled on or not
    if (actor.system.despair.value > 0) {
      actorData.system.despairActive = true
    }

    // Prepare edge data
    actorData.system.edges = await prepareEdges(actorData)

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      // Make sure the item is a perk and has a edge
      if (i.type === 'perk' && actorData.system.edges[i.system.edge]) {
        if (!actorData.system.edges[i.system.edge]?.perks) actorData.system.edge[i.system.edge].perks = []
        // Append to edges list
        actorData.system.edges[i.system.edge].perks.push(i)
      } else if (i.type === 'edgepool' && actorData.system.edges[i.system.edge]) {
        if (!actorData.system.edges[i.system.edge]?.pools) actorData.system.edges[i.system.edge].pools = []
        actorData.system.edges[i.system.edge].pools.push(i)
      }
    }

    // Sort edge perks
    actorData.system.edges = await prepareEdgePowers(actorData.system.edges)
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Toggle despair
    html.find('.despair-toggle').click(_onToggleDespair.bind(this))

    // Handle adding a new edge to the sheet
    html.find('.add-edge').click(_onAddEdge.bind(this))

    // Handle removing an edge from the sheet
    html.find('.remove-edge').click(_onRemoveEdge.bind(this))

    // Post Edge description to the chat
    html.find('.edge-chat').click(_onEdgeToChat.bind(this))
  }
}
