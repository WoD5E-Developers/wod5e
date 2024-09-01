/* global game, foundry */

import { WoDActor } from '../wod-v5-sheet.js'
import { prepareGifts, prepareGiftPowers, prepareFormData } from './scripts/prepare-data.js'
import { _onAddGift, _onRemoveGift, _onGiftToChat } from './scripts/gifts.js'
import { _onBeginFrenzy, _onEndFrenzy } from './scripts/frenzy.js'
import { _onShiftForm, _onFormToChat, _onFormEdit, _onLostTheWolf } from './scripts/forms.js'
import { _onHaranoRoll, _onHaugloskRoll } from './scripts/balance.js'

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {Wov5DActorSheet}
 */

export class WerewolfActorSheet extends WoDActor {
  /** @override */
  static get defaultOptions () {
    // Define the base list of CSS classes
    const classList = ['werewolf']
    classList.push(...super.defaultOptions.classes)

    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: classList,
      template: 'systems/vtm5e/display/wta/actors/werewolf-sheet.hbs'
    })
  }

  /** @override */
  get template () {
    if (!game.user.isGM && this.actor.limited) return 'systems/vtm5e/display/shared/actors/limited-sheet.hbs'
    return 'systems/vtm5e/display/wta/actors/werewolf-sheet.hbs'
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    // Top-level variables
    const data = await super.getData()

    // Prepare items
    await this._prepareItems(data)

    // If the actor's rage is above 0, make sure they aren't in "lost the wolf" form
    if (data.actor.system.rage.value > 0 && data.actor.system.lostTheWolf) {
      await this.actor.update({ 'system.lostTheWolf': false })
    }

    // Check if the actor's rage is 0, they're in a supernatural form, and they haven't already lost the wolf
    const supernaturalForms = ['glabro', 'crinos', 'hispo']
    if ((data.actor.system.rage.value === 0) && (supernaturalForms.indexOf(data.actor.system.activeForm) > -1)) {
      await _onLostTheWolf(this.actor)
    }

    console.log(data)

    return data
  }

  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    // Top-level variables
    const actorData = sheetData.actor

    // Prepare discipline data
    actorData.system.gifts = await prepareGifts(actorData)

    // Prepare form data
    actorData.system.forms = await prepareFormData(actorData.system.forms)

    // Iterate through items, allocating to containers
    for (const i of sheetData.items) {
      // Make sure the item is a gift and has a gift type that exists
      if (i.type === 'gift' && actorData.system.gifts[i.system.giftType]) {
        if (!actorData.system.gifts[i.system.giftType]?.powers) actorData.system.gifts[i.system.giftType].powers = []
        // Append to gifts list
        actorData.system.gifts[i.system.giftType].powers.push(i)
      }
    }

    // Sort discipline powers
    actorData.system.gifts = await prepareGiftPowers(actorData.system.gifts)
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Add a new gift type to the sheet
    html.find('.add-gift').click(_onAddGift.bind(this))

    // Remove a gift type from the sheet
    html.find('.gift-delete').click(_onRemoveGift.bind(this))

    // Frenzy buttons
    html.find('.begin-frenzy').click(_onBeginFrenzy.bind(this))
    html.find('.end-frenzy').click(_onEndFrenzy.bind(this))

    // Form change buttons
    html.find('.change-form').click(_onShiftForm.bind(this))

    // Harano buttons
    html.find('.harano-roll').click(_onHaranoRoll.bind(this))
    // Hauglosk buttons
    html.find('.hauglosk-roll').click(_onHaugloskRoll.bind(this))

    // Form to chat buttons
    html.find('.were-form-chat').click(_onFormToChat.bind(this))

    // Form edit buttons
    html.find('.were-form-edit').click(_onFormEdit.bind(this))

    // Post Gift description to the chat
    html.find('.gift-chat').click(_onGiftToChat.bind(this))
  }
}
