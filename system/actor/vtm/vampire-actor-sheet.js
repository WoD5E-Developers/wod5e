/* global game, foundry */

import { GhoulActorSheet } from './ghoul-actor-sheet.js'
import { getBloodPotencyValues, getBloodPotencyText } from './scripts/blood-potency.js'
import { _onRemorseRoll } from './scripts/roll-remorse.js'
import { _onEndFrenzy } from './scripts/end-frenzy.js'
import { _onFrenzyRoll } from './scripts/frenzy-roll.js'

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {GhoulActorSheet}
 */

export class VampireActorSheet extends GhoulActorSheet {
  /** @override */
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      template: 'systems/vtm5e/display/vtm/actors/vampire-sheet.hbs'
    })
  }

  constructor (actor, options) {
    super(actor, options)
    this.hasBoons = true
  }

  /** @override */
  get template () {
    if (!game.user.isGM && this.actor.limited) return 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
    return 'systems/vtm5e/display/vtm/actors/vampire-sheet.hbs'
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    const data = await super.getData()

    // Prepare items
    await this._prepareItems(data)

    return data
  }

  /** Prepare item data for the Vampire actor */
  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    // Top-level variables
    const actorData = sheetData.actor
    const actor = this.actor

    // Define various blood potency values
    actorData.system.bloodPotencyValue = parseInt(actor.system.blood.potency)
    sheetData.blood_potency_text = await getBloodPotencyText(actorData.system.bloodPotencyValue)
    actorData.system.bloodPotency = await getBloodPotencyValues(actorData.system.bloodPotencyValue)

    // Handle adding blood potency bonuses
    actorData.system.blood.bonuses = [
      {
        source: game.i18n.localize('WOD5E.VTM.BloodPotency'),
        value: actorData.system.bloodPotency.power,
        paths: ['disciplines'],
        activeWhen: {
          check: 'always'
        }
      },
      {
        source: game.i18n.localize('WOD5E.VTM.BloodSurge'),
        value: actorData.system.bloodPotency.surge,
        paths: ['all'],
        unless: ['willpower', 'humanity', 'extended'],
        displayWhenInactive: true,
        activeWhen: {
          check: 'isPath',
          path: 'blood-surge'
        },
        advancedCheckDice: 1
      }
    ]
  }

  /* -------------------------------------------- */
  /*  Event Listeners and Handlers                */
  /* -------------------------------------------- */

  // Event Listeners
  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Rollable gift buttons
    html.find('.remorse-roll').click(_onRemorseRoll.bind(this))
    html.find('.frenzy-roll').click(_onFrenzyRoll.bind(this))
    html.find('.end-frenzy').click(_onEndFrenzy.bind(this))
  }
}
