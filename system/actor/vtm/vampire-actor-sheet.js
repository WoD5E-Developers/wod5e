/* global game, foundry, renderTemplate, ChatMessage */

import { WOD5eDice } from '../../scripts/system-rolls.js'
import { GhoulActorSheet } from './ghoul-actor-sheet.js'
import { getBloodPotencyValues, getBloodPotencyText } from './scripts/blood-potency.js'

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

    // Prepare discipline data
    data.actor.system.disciplines = await this._prepareDisciplineData(data)

    return data
  }

  /** Prepare item data for the Vampire actor */
  async _prepareItems (sheetData) {
    // Prepare items
    super._prepareItems(sheetData)

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
    html.find('.remorse-roll').click(this._onRemorseRoll.bind(this))
    html.find('.frenzy-roll').click(this._onFrenzyRoll.bind(this))
    html.find('.end-frenzy').click(this._onEndFrenzy.bind(this))
  }

  // Roll Handlers
  async _onRemorseRoll (event) {
    event.preventDefault()

    // Top-level variables
    const actor = this.actor

    // Secondary variables
    const humanity = actor.system.humanity.value
    const stain = actor.system.humanity.stains
    const dicePool = Math.max((10 - humanity - stain), 1)

    WOD5eDice.Roll({
      basicDice: dicePool,
      title: game.i18n.localize('WOD5E.VTM.RollingRemorse'),
      selectors: ['humanity'],
      actor,
      data: actor.system,
      quickRoll: true,
      disableAdvancedDice: true,
      callback: (err, rollData) => {
        if (err) console.log(err)

        const hasSuccess = rollData.terms[0].results.some(result => result.success)

        // Reduce humanity by 1 if the roll fails, otherwise reset stain to 0 in any other cases
        if (hasSuccess) {
          actor.update({ 'system.humanity.stains': 0 })
        } else {
          actor.update({ 'system.humanity.value': Math.max(humanity - 1, 0) })
          actor.update({ 'system.humanity.stains': 0 })

          renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
            name: game.i18n.localize('WOD5E.VTM.RemorseFailed'),
            img: 'systems/vtm5e/assets/icons/dice/vampire/bestial-failure.png',
            description: game.i18n.format('WOD5E.VTM.RemorseFailedDescription', {
              actor: actor.name
            })
          }).then(html => {
            ChatMessage.create({
              content: html
            })
          })
        }
      }
    })
  }

  async _onEndFrenzy (event) {
    event.preventDefault()

    // Top-level variables
    const actor = this.actor

    await actor.update({ 'system.frenzyActive': false })
  }

  async _onFrenzyRoll (event) {
    event.preventDefault()

    // Top-level variables
    const actor = this.actor

    // Secondary variables
    const willpowerDicePool = this.getWillpowerDicePool(actor)
    const humanity = actor.system.humanity.value
    const dicePool = Math.max(willpowerDicePool + Math.floor(humanity / 3), 1)

    WOD5eDice.Roll({
      basicDice: dicePool,
      title: game.i18n.localize('WOD5E.VTM.ResistingFrenzy'),
      actor,
      data: actor.system,
      disableAdvancedDice: true,
      callback: (err, result) => {
        if (err) console.log(err)

        if (!result.rollSuccessful) {
          actor.update({ 'system.frenzyActive': true })
        }
      }
    })
  }
}
