/* global game, foundry, TextEditor, WOD5E, WOD5E */

import { WoDActor } from '../wod-v5-sheet.js'
import { _onAddEdge } from './scripts/add-edge.js'
import { _onRemoveEdge } from './scripts/remove-edge.js'
import { _onEdgeToChat } from './scripts/edge-to-chat.js'
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

    // Prepare items
    await this._prepareItems(data)

    // Prepare edge data
    data.actor.system.edges = await this._prepareEdgeData(data)

    return data
  }

  /** Prepare item data for the Hunter actor */
  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    // Top-level variables
    const actorData = sheetData.actor
    const actor = this.actor

    // Secondary variables
    const edges = actor.system.edges

    // Track whether despair is toggled on or not
    if (actor.system.despair.value > 0) {
      actorData.system.despairActive = true
    }

    for (const edgeType in edges) {
      // Localize the edge name
      edges[edgeType].label = WOD5E.api.generateLabelAndLocalize({ string: edgeType, type: 'edge' })

      // Wipe old perks so they doesn't duplicate
      edges[edgeType].perks = []

      // Wipe old edge pools so they doesn't duplicate
      edges[edgeType].pools = []
    }

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      // Make sure the item is a perk and has an edge set
      if (i.type === 'perk') {
        if (i.system.edge !== undefined) {
          edges[i.system.edge].perks.push(i)
        }
      } else if (i.type === 'edgepool') {
        if (i.system.edge !== undefined) {
          edges[i.system.edge].pools.push(i)
        }
      }
    }

    return sheetData
  }

  // Handle edge data so we can display it on the actor sheet
  async _prepareEdgeData (sheetData) {
    const edges = sheetData.actor.system.edges

    // Sort the edge containers by the level of the perk instead of by creation date
    // and enrich any Edge/Perk descriptions
    for (const edgeType in edges) {
      // If there's perks for this Edge, then make sure it's visible and sort them
      if (edges[edgeType].perks.length > 0) {
        if (!edges[edgeType].visible) edges[edgeType].visible = true

        edges[edgeType].perks = edges[edgeType].perks.sort(function (perk1, perk2) {
          // If the levels are the same, sort alphabetically instead
          if (perk1.system.level === perk2.system.level) {
            return perk1.name.localeCompare(perk2.name)
          }

          // Sort by level
          return perk1.system.level - perk2.system.level
        })
      }

      // Enrich edge description
      edges[edgeType].enrichedDescription = await TextEditor.enrichHTML(edges[edgeType].description)
    }

    return edges
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
