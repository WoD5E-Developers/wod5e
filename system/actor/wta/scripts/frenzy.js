export const _onBeginFrenzy = async function (actor, event) {
  event.preventDefault()

  // Enable frenzy
  actor.update({ 'system.frenzyActive': true })

  // Set rage to 5
  actor.update({ 'system.rage.value': 5 })
}

export const _onEndFrenzy = async function (actor, event) {
  event.preventDefault()

  // Disable frenzy
  actor.update({ 'system.frenzyActive': false })

  // Set rage to 0
  actor.update({ 'system.rage.value': 0 })
}
