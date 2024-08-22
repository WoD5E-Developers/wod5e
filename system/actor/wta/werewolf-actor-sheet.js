/* global game, foundry, renderTemplate, ChatMessage */

import { WoDActor } from '../wod-v5-sheet.js'
import { _prepareWerewolfItems, prepareGiftData, prepareRiteData } from './scripts/prepare-data.js'
import { _onAddGift } from './scripts/gifts.js'
import { _onBeginFrenzy, _onEndFrenzy } from './scripts/frenzy.js'
import { _onShiftForm, _onFormToChat, _onFormEdit } from './scripts/forms.js'
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

    // Prepare gifts and rites data
    data.actor.system.gifts = await prepareGiftData(data)
    data.actor.system.rites = await prepareRiteData(data)

    // If the actor's rage is above 0, make sure they aren't in "lost the wolf" form
    if (data.actor.system.rage.value > 0 && data.actor.system.lostTheWolf) {
      this.actor.update({ 'system.lostTheWolf': false })
    }

    // Check if the actor's rage is 0, they're in a supernatural form, and they haven't already lost the wolf
    const supernaturalForms = ['glabro', 'crinos', 'hispo']
    if ((data.actor.system.rage.value === 0) && (supernaturalForms.indexOf(data.actor.system.activeForm) > -1)) {
      this._onLostTheWolf()
    }

    return data
  }

  async _prepareItems (sheetData) {
    // Prepare items
    await super._prepareItems(sheetData)

    // Prepare Werewolf-specific items
    await _prepareWerewolfItems(this.actor, sheetData)
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    // Activate listeners
    super.activateListeners(html)

    // Everything below here is only needed if the sheet is editable
    if (!this.options.editable) return

    // Top-level variables
    const actor = this.actor

    // Add a new gift type to the sheet
    html.find('.add-gift').click(_onAddGift.bind(actor, this))

    // Frenzy buttons
    html.find('.begin-frenzy').click(_onBeginFrenzy.bind(actor, this))
    html.find('.end-frenzy').click(_onEndFrenzy.bind(actor, this))

    // Form change buttons
    html.find('.change-form').click(_onShiftForm.bind(actor, this))

    // Harano buttons
    html.find('.harano-roll').click(_onHaranoRoll.bind(actor, this))
    // Hauglosk buttons
    html.find('.hauglosk-roll').click(_onHaugloskRoll.bind(actor, this))

    // Form to chat buttons
    html.find('.were-form-chat').click(_onFormToChat.bind(actor, this))

    // Form edit buttons
    html.find('.were-form-edit').click(_onFormEdit.bind(actor, this))

    // Post Gift description to the chat
    html.find('.gift-chat').click(ev => {
      const data = $(ev.currentTarget)[0].dataset
      const gift = actor.system.gifts[data.gift]

      renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
        name: game.i18n.localize(gift.name),
        img: 'icons/svg/dice-target.svg',
        description: gift.description
      }).then(html => {
        ChatMessage.create({
          content: html
        })
      })
    })
  }
}
