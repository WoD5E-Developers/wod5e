/* global game, ChatMessage, Dialog */

import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveBonuses } from '../../../scripts/rolls/situational-modifiers.js'

export const _onLostTheWolf = async function (actor) {
  // Variables yet to be defined
  let buttons = {}

  // If automatedRage is disabled, we don't wat to show this dialogue
  if (!game.settings.get('vtm5e', 'automatedRage')) return

  // If the actor has already lost the wolf, we don't need to show this prompt again
  if (actor.system.lostTheWolf) return

  // Update the listTheWolf key
  actor.update({ 'system.lostTheWolf': true })

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
        actor.update({ 'system.activeForm': 'homid' })
      }
    },
    lupus: {
      label: 'Lupus',
      callback: async () => {
        actor.update({ 'system.activeForm': 'lupus' })
      }
    }
  }

  new Dialog({
    title: 'Lost the Wolf',
    content: template,
    buttons,
    default: 'homid'
  },
  {
    classes: ['wod5e', 'dialog', 'werewolf', 'dialog']
  }).render(true)
}

export const _onShiftForm = async function (actor, event) {
  event.preventDefault()

  // Top-level variables
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const form = dataset.form

  switch (form) {
    case 'glabro':
      this.handleFormChange(actor, 'glabro', 1)
      break
    case 'crinos':
      this.handleFormChange(actor, 'crinos', 2)
      break
    case 'hispo':
      this.handleFormChange(actor, 'hispo', 1)
      break
    case 'lupus':
      actor.update({ 'system.activeForm': 'lupus' })
      this._onFormToChat(event)
      break
    default:
      actor.update({ 'system.activeForm': 'homid' })
      this._onFormToChat(event)
  }
}

export const handleFormChange = async function (actor, form, diceCount) {
  // Variables yet to be defined
  const selectors = []

  // If automatedRage is turned on and the actor's rage is 0, present a warning
  if (game.settings.get('vtm5e', 'automatedRage') && actor.system.rage.value === 0) {
    this._onInsufficientRage(form)
  } else {
    // Variables
    const formData = actor.system.forms[form]
    const flavor = formData.description

    // Handle getting any situational modifiers
    const activeBonuses = await getActiveBonuses({
      actor,
      selectors
    })

    // Roll the rage dice necessary
    WOD5eDice.Roll({
      advancedDice: diceCount + activeBonuses.totalValue,
      title: form,
      actor,
      data: actor.system,
      flavor,
      quickRoll: true,
      disableBasicDice: true,
      decreaseRage: true,
      selectors,
      callback: (err, rollData) => {
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

export const _onFormToChat = async function (actor, event) {
  event.preventDefault()

  // Top-level variables
  const header = event.currentTarget
  const form = header.dataset.form

  // Secondary variables
  const formData = actor.system.forms[form]
  const formName = formData.name
  const formDescription = formData.description ? `<p>${formData.description}</p>` : ''
  const formAbilities = formData.attributes

  // Define the chat message
  let chatMessage = `<p class="roll-label uppercase">${game.i18n.localize(formName)}</p>${formDescription}`
  if (formAbilities.length > 0) {
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

  // Remove focus once the chat message is posted
  event.currentTarget.blur()
}

export const _onFormEdit = async function (actor, event) {
  event.preventDefault()

  // Top-level variables
  const header = event.currentTarget
  const form = header.dataset.form

  // Secondary variables
  const formData = actor.system.forms[form]
  const formName = formData.name
  const formDescription = formData.description

  // Variables yet to be defined
  let buttons = {}

  // Define the template to be used
  const template = `
    <form>
        <div class="flexrow">
          <textarea id="formDescription">${formDescription}</textarea>
        </div>
    </form>`

  // Define the buttons to be used and push them to the buttons variable
  buttons = {
    submit: {
      icon: '<i class="fas fa-check"></i>',
      label: game.i18n.localize('WOD5E.Submit'),
      callback: async (html) => {
        const newDescription = html.find('#formDescription')[0].value

        actor.update({ [`system.forms.${form}.description`]: newDescription })
      }
    },
    cancel: {
      icon: '<i class="fas fa-times"></i>',
      label: game.i18n.localize('WOD5E.Cancel')
    }
  }

  // Display the dialog
  new Dialog({
    title: game.i18n.localize('WOD5E.Edit') + ' ' + game.i18n.localize(formName),
    content: template,
    buttons,
    default: 'submit'
  },
  {
    classes: ['wod5e', 'dialog', 'werewolf', 'dialog']
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
        actor.update({ 'system.activeForm': form })
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