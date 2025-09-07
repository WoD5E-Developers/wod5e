import { handleFormChange } from './forms.js'

export const _onBeginFrenzy = async function (event, target) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Enable frenzy and set rage to 5
  await actor.update({
    'system.frenzyActive': true,
    'system.rage.value': 5
  })

  // Shift to Crinos
  handleFormChange(event, target, actor, 'crinos', 2)
}

export const _onEndFrenzy = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Disable frenzy and set rage to 0
  await actor.update({
    'system.frenzyActive': false,
    'system.rage.value': 0
   })
}
