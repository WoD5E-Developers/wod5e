/* global foundry, game, ChatMessage */

import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'
import { WereformApplication } from '../applications/wereform-application.js'

export const _onLostTheWolf = async function (actor) {
  // Variables yet to be defined
  let buttons = {}

  // If automatedRage is disabled, we don't wat to show this dialogue
  if (!game.settings.get('vtm5e', 'automatedRage')) return

  // Define the template to be used
  const template = `
    <div class="form-group">
        <label>${game.i18n.localize('WOD5E.WTA.LostWolfShiftDown')}</label>
    </div>`

  // Define the buttons and push them to the buttons variable
  buttons = [
    {
      action: 'homid',
      label: game.i18n.localize('WOD5E.WTA.HomidName'),
      default: true
    },
    {
      action: 'lupus',
      label: game.i18n.localize('WOD5E.WTA.LupusName')
    },
    {
      action: 'override',
      label: game.i18n.localize('WOD5E.WTA.StayInCurrentForm')
    }
  ]

  const result = await foundry.applications.api.DialogV2.wait({
    window: { title: game.i18n.localize('WOD5E.WTA.LostTheWolf') },
    content: template,
    buttons,
    classes: ['wod5e', 'werewolf']
  })

  if (result === 'override') {
    actor.update({ 'system.formOverride': true })
  } else {
    actor.update({ 'system.activeForm': result })
    _updateToken(actor, result)
  }
}

export const _onShiftForm = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const form = target.getAttribute('data-form')

  switch (form) {
    case 'glabro':
      handleFormChange(event, target, actor, 'glabro', 1)
      break
    case 'crinos':
      handleFormChange(event, target, actor, 'crinos', 2)
      break
    case 'hispo':
      handleFormChange(event, target, actor, 'hispo', 1)
      break
    case 'lupus':
      actor.update({ 'system.activeForm': 'lupus' })
      _updateToken(actor, 'lupus')
      _onFormToChat(event, target, actor)
      break
    default:
      actor.update({ 'system.activeForm': 'homid' })
      _updateToken(actor, 'homid')
      _onFormToChat(event, target, actor)
  }
}

export const handleFormChange = async function (event, target, actor, form, diceCount) {
  // Variables yet to be defined
  const selectors = []

  // If automatedRage is turned on and the actor's rage is 0, present a warning
  if (game.settings.get('vtm5e', 'automatedRage') && actor.system.rage.value === 0) {
    _onInsufficientRage(actor, form)
  } else {
    // Variables
    const formData = actor.system.forms[form]

    // Handle getting any situational modifiers
    const activeModifiers = await getActiveModifiers({
      actor,
      selectors
    })

    // Roll the rage dice necessary
    await WOD5eDice.Roll({
      advancedDice: diceCount + activeModifiers.totalValue,
      title: form,
      flavor: formData?.description || '',
      actor,
      data: actor.system,
      quickRoll: true,
      disableBasicDice: true,
      decreaseRage: true,
      selectors,
      callback: async (err, rollData) => {
        if (err) console.log('World of Darkness 5e | ' + err)

        // Calculate the number of rage dice the actor has left
        const failures = rollData.terms[2].results.filter(result => !result.success).length
        const newRageAmount = Math.max(actor.system.rage.value - failures, 0)

        // If rolling rage dice didn't reduce the actor to 0 rage, then update the current form
        // and post the description to chat as well
        if (newRageAmount > 0) {
          actor.update({ 'system.activeForm': form })
          _onFormToChat(event, target, actor)
          _updateToken(actor, form)
        }
      }
    })
  }
}

export const _onFormToChat = async function (event, target, originActor) {
  event.preventDefault()

  // Top-level variables
  const actor = originActor || this.actor
  const form = target.getAttribute('data-form')

  // Secondary variables
  const formData = actor.system.forms[form]
  const formName = formData.displayName
  const formDescription = formData?.description ? `<p>${formData?.description}</p>` : ''
  const formAbilities = formData.attributes

  // Define the chat message
  let chatMessage = `<p class="roll-label uppercase">${game.i18n.localize(formName)}</p>${formDescription}`
  if (formAbilities && formAbilities.length > 0) {
    chatMessage = chatMessage + '<ul>'
    formAbilities.forEach((ability) => {
      let abilityLabel = ability.label

      // If there's a hint icon, emulate what we show on the forms page of the Werewolf sheet
      if (ability?.hintIcon) {
        abilityLabel = `${ability.label} <span class="ability-hint" title="${ability.hintDescription}">${ability.hintIcon}</span>`
      }

      chatMessage = chatMessage + `<li>${abilityLabel}</li>`
    })
    chatMessage = chatMessage + '</ul>'
  }

  // Post the message to the chat
  const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: chatMessage }, game.settings.get('core', 'rollMode'))
  ChatMessage.create(message)
}

export const _onFormEdit = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const form = target.getAttribute('data-form')

  new WereformApplication({
    actor: this.actor,
    form
  }).render(true)
}

export const _onInsufficientRage = async function (actor, form) {
  // Define the template to be used
  const template = `
    <div class="form-group">
        <label>${game.i18n.localize('WOD5E.WTA.LostWolfShiftAnyway')}</label>
    </div>`

  const shouldShift = await foundry.applications.api.DialogV2.confirm({
    window: {
      title: game.i18n.localize('WOD5E.WTA.LostTheWolf')
    },
    content: template,
    yes: {
      icon: 'fas fa-check',
      label: game.i18n.localize('WOD5E.WTA.Shift')
    },
    no: {
      icon: 'fas fa-times',
      label: game.i18n.localize('WOD5E.Cancel')
    },
    classes: ['wod5e', 'werewolf']
  })

  if (shouldShift) {
    actor.update({
      'system.activeForm': form,
      'system.formOverride': true
    })
    _updateToken(actor, form)
  }
}

export const _updateToken = async function (actor, form) {
  // Original image
  let originalImage = ''

  // When the user is shifting out of homid, make sure that the homid image is the original token image,
  // unless the original token image is a wildcard, then skip this
  if (actor.prototypeToken.texture.src.indexOf('*') === -1) {
    if (actor.system.activeForm === 'homid') {
      originalImage = actor.prototypeToken.texture.src

      actor.update({
        'system.forms.homid.token.img': originalImage
      })
    } else {
      originalImage = actor.system.forms.homid.token.img
    }
  }

  // New image
  const tokenImg = actor.system.forms[form].token.img

  // Get a list of the active tokens in a given scene
  const activeTokens = actor.getActiveTokens()

  // Depending on if we have a token image set, update all instances of the token image
  if (tokenImg) {
    // Update the actor itself
    actor.update({
      'prototypeToken.texture.src': tokenImg
    })

    // Update tokens
    activeTokens.forEach((token) => {
      token.document.update({
        'texture.src': tokenImg
      })
    })
  } else {
    // Default to the actor's original image if the original image is not a wildcard
    if (actor.prototypeToken.texture.src.indexOf('*') === -1) {
      activeTokens.forEach((token) => {
        token.document.update({
          'texture.src': originalImage
        })
      })
    }
  }
}
