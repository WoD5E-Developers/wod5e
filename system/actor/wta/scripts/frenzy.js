import { handleFormChange } from "./forms.js"

export const _onBeginFrenzy = async function (event,) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Enable frenzy
  await actor.update({ 'system.frenzyActive': true })

  // Set rage to 5
  await actor.update({ 'system.rage.value': 5 })

  // Shift to Crinos
  handleFormChange(event, actor, 'crinos', 2)
}

export const _onEndFrenzy = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Disable frenzy
  await actor.update({ 'system.frenzyActive': false })

  // Set rage to 0
  await actor.update({ 'system.rage.value': 0 })
}
