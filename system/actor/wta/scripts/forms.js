/* global game, ChatMessage, Dialog */

import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveBonuses } from '../../../scripts/rolls/situational-modifiers.js'
import { WereformApplication } from '../applications/wereform-application.js'

export const _onLostTheWolf = async function (actor) {
  // Variables yet to be defined
  let buttons = {}

  // If automatedRage is disabled, we don't wat to show this dialogue
  if (!game.settings.get('vtm5e', 'automatedRage')) return

  // If the actor has already lost the wolf, we don't need to show this prompt again
  if (actor.system.lostTheWolf) return

  // Update the listTheWolf key
  await actor.update({ 'system.lostTheWolf': true })

  // Define the template to be used
  const template = `
  <form>
      <div class="form-group">
          <label>${game.i18n.localize('WOD5E.WTA.LostWolfShiftDown')}</label>
      </div>
  </form>`

  // Define the buttons and push them to the buttons variable
  buttons = {
    homid: {
      label: 'Homid',
      callback: async () => {
        await actor.update({ 'system.activeForm': 'homid' })
      }
    },
    lupus: {
      label: 'Lupus',
      callback: async () => {
        await actor.update({ 'system.activeForm': 'lupus' })
      }
    }
  }

  new Dialog({
    title: game.i18n.localize('WOD5E.WTA.LostTheWolf'),
    content: template,
    buttons,
    default: 'homid'
  },
  {
    classes: ['wod5e', 'dialog', 'werewolf', 'dialog']
  }).render(true)
}

export const _onShiftForm = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const form = target.getAttribute('data-form')

  switch (form) {
    case 'glabro':
      handleFormChange(actor, 'glabro', 1)
      break
    case 'crinos':
      handleFormChange(actor, 'crinos', 2)
      break
    case 'hispo':
      handleFormChange(actor, 'hispo', 1)
      break
    case 'lupus':
      actor.update({ 'system.activeForm': 'lupus' })
      _onFormToChat(event, target, actor)
      break
    default:
      actor.update({ 'system.activeForm': 'homid' })
      _onFormToChat(event, target, actor)
  }
}

export const handleFormChange = async function (actor, form, diceCount) {
  // Variables yet to be defined
  const selectors = []

  // If automatedRage is turned on and the actor's rage is 0, present a warning
  if (game.settings.get('vtm5e', 'automatedRage') && actor.system.rage.value === 0) {
    _onInsufficientRage(actor, form)
  } else {
    // Variables
    const formData = actor.system.forms[form]

    // Handle getting any situational modifiers
    const activeBonuses = await getActiveBonuses({
      actor,
      selectors
    })

    // Roll the rage dice necessary
    await WOD5eDice.Roll({
      advancedDice: diceCount + activeBonuses.totalValue,
      title: form,
      flavor: formData.description,
      actor,
      data: actor.system,
      quickRoll: true,
      disableBasicDice: true,
      decreaseRage: true,
      selectors,
      callback: async (err, rollData) => {
        if (err) console.log(err)

        // Calculate the number of rage dice the actor has left
        const failures = rollData.terms[2].results.filter(result => !result.success).length
        const newRageAmount = Math.max(actor.system.rage.value - failures, 0)

        // If rolling rage dice didn't reduce the actor to 0 rage, then update the current form
        if (newRageAmount > 0) {
          actor.update({ 'system.activeForm': form })
        }
      }
    })
  }
}

export const _onFormToChat = async function (event, target, originActor) {
  event.preventDefault()

  // Top-level variables
  const actor = originActor ? originActor : this.actor
  const form = target.getAttribute('data-form')

  // Secondary variables
  const formData = actor.system.forms[form]
  const formName = formData.displayName
  const formDescription = formData.description ? `<p>${formData.description}</p>` : ''
  const formAbilities = formData.attributes

  // Define the chat message
  let chatMessage = `<p class="roll-label uppercase">${game.i18n.localize(formName)}</p>${formDescription}`
  if (formAbilities && formAbilities.length > 0) {
    chatMessage = chatMessage + '<ul>'
    formAbilities.forEach((ability) => {
      chatMessage = chatMessage + `<li>${ability}</li>`
    })
    chatMessage = chatMessage + '</ul>'
  }

  // Post the message to the chat
  ChatMessage.create({
    speaker: ChatMessage.getSpeaker({ actor }),
    content: chatMessage
  })
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
  // Variables yet to be defined
  let buttons = {}

  // Define the template to be used
  const template = `
  <form>
      <div class="form-group">
          <label>${game.i18n.localize('WOD5E.WTA.LostWolfShiftAnyway')}</label>
      </div>
  </form>`

  // Define the buttons and push them to the buttons variable
  buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: 'Shift Anyway',
      callback: async () => {
        await actor.update({ 'system.activeForm': form })
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  new Dialog({
    title: 'Can\'t Transform: Lost the Wolf',
    content: template,
    buttons,
    default: 'submit'
  },
  {
    classes: ['wod5e', 'dialog', 'werewolf', 'dialog']
  }).render(true)
}
