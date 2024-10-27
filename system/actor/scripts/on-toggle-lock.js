export const _onToggleLock = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor

  // Update the locked state
  actor.update({ 'system.locked': !actor.system.locked })
}
