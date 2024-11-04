/* global game, Dialog, WOD5E, renderTemplate, ChatMessage */

import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'
import { _damageWillpower } from '../../../scripts/rolls/willpower-damage.js'

export const _onAddGift = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Secondary variables
  const selectLabel = game.i18n.localize('WOD5E.WTA.SelectGift')
  const itemOptions = WOD5E.Gifts.getList({})

  // Variables yet to be defined
  let options = []
  let giftSelected

  // Prompt a dialog to determine which edge we're adding
  // Build the options for the select dropdown
  for (const [key, value] of Object.entries(itemOptions)) {
    options += `<option value="${key}">${value.displayName}</option>`
  }

  // Template for the dialog form
  const template = `
    <form>
      <div class="form-group">
        <label>${selectLabel}</label>
        <select id="giftSelect">${options}</select>
      </div>
    </form>`

  // Define dialog buttons
  const buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Add'),
      callback: async (html) => {
        giftSelected = html.find('#giftSelect')[0].value

        // Make the edge visible
        actor.update({ [`system.gifts.${giftSelected}.visible`]: true })

        // Update the currently selected discipline and power
        _updateSelectedGift(actor, giftSelected)
        _updateSelectedGiftPower(actor, '')
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  // Display the dialog
  new Dialog({
    title: game.i18n.localize('WOD5E.Add'),
    content: template,
    buttons,
    default: 'submit'
  }, {
    classes: ['wod5e', 'dialog', 'werewolf', 'dialog']
  }).render(true)
}

/** Handle removing a gift from an actor */
export const _onRemoveGift = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const gift = target.getAttribute('data-gift')

  actor.update({
    [`system.gifts.${gift}.visible`]: false
  })
}

export const _onGiftCost = async function (actor, item, rollMode) {
  // Secondary variables
  const cost = item.system.cost
  const willpowerCost = item.system.willpowercost
  let selectors = []

  // Apply rollMode from chat if none is set
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  // If we're rolling no rage dice and
  if (cost < 1 && willpowerCost > 0) {
    _damageWillpower(null, null, actor, willpowerCost, rollMode)
  } else if (cost > 0 && willpowerCost > 0) {
    selectors = ['rage']

    // Handle getting any situational modifiers
    const activeModifiers = await getActiveModifiers({
      actor,
      selectors
    })

    // Send the roll to the system
    WOD5eDice.Roll({
      advancedDice: cost + activeModifiers.totalValue,
      title: `${game.i18n.localize('WOD5E.WTA.RageDice')} - ${item.name}`,
      actor,
      rollMode,
      disableBasicDice: true,
      decreaseRage: true,
      selectors,
      quickRoll: true,
      willpowerDamage: willpowerCost
    })
  }
}

/** Post Gift description to the chat */
export const _onGiftToChat = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const gift = actor.system.gifts[target.getAttribute('data-gift')]

  await renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
    name: gift.displayName,
    img: 'icons/svg/dice-target.svg',
    description: gift?.description || ''
  }).then(html => {
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, game.settings.get('core', 'rollMode'))
    ChatMessage.create(message)
  })
}

/** Select a gift to display */
export const _onSelectGift = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const gift = target.getAttribute('data-gift')

  _updateSelectedGift(actor, gift)
}

/** Select a power to display */
export const _onSelectGiftPower = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const power = target.getAttribute('data-power')

  _updateSelectedGiftPower(actor, power)
}

export const _updateSelectedGiftPower = async function (actor, power) {
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have a valid power defined
  if (power && actor.items.get(power)) {
    const powerItem = actor.items.get(power)
    const gift = powerItem.system.giftType

    // Update the selected power
    updatedData.selectedGiftPower = power
    powerItem.update({
      system: {
        selected: true
      }
    })

    // Update the selected gifts
    _updateSelectedGift(actor, gift)
  } else {
    // Revert to an empty string
    updatedData.selectedGiftPower = ''
  }

  // Unselect the previously selected power
  const previouslySelectedPower = actor.system?.selectedGiftPower
  if (previouslySelectedPower && actor.items.get(previouslySelectedPower) && previouslySelectedPower !== power) {
    actor.items.get(previouslySelectedPower).update({
      system: {
        selected: false
      }
    })
  }

  // Update the actor data
  actor.update({
    system: updatedData
  })
}

export const _updateSelectedGift = async function (actor, gift) {
  // Variables yet to be defined
  const updatedData = {}

  // Make sure we actually have a gift defined
  if (gift && actor.system.gifts[gift]) {
    updatedData.gifts ??= {}
    updatedData.gifts[gift] ??= {}

    // Update the selected gifts
    updatedData.selectedGift = gift
    updatedData.gifts[gift].selected = true
  } else {
    // Revert to an empty string
    updatedData.selectedGift = ''
  }

  // Unselect the previously selected gift

  const previouslySelectedGift = actor.system?.selectedGift
  if (previouslySelectedGift && previouslySelectedGift !== gift) {
    updatedData.gifts[previouslySelectedGift] ??= {}
    updatedData.gifts[previouslySelectedGift].selected = false
  }

  // Update the actor data
  actor.update({
    system: updatedData
  })
}
