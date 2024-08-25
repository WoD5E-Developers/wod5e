/** Handle removing the frenzy condition from a vampire */
export const _onEndFrenzy = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  await actor.update({ 'system.frenzyActive': false })
}
