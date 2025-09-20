/** Handle toggling the depsair value */
export const _onToggleDespair = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const actorData = actor.system

  // I really only do this so it's clear what we're doing here
  const currentDespair = (actorData?.despair?.value ? actorData?.despair?.value : 0) > 0
  const newDespair = !currentDespair

  // Have to do this silly thing in order to prevent old versions of the Hunter sheet from freaking out
  // Basically we're tracking the boolean of true/false in the sheet code but making sure that
  // old versions of the sheet continue to track it in binary 1 or 0.
  // It's dumb, I know, and I hope to set up a migration function to fix it sometime
  // but I don't want to delay this release more than I already had to-
  if (newDespair) { // Set as "true"
    actor.update({ 'system.despair.value': 1 })
  } else { // Set as "false"
    actor.update({ 'system.despair.value': 0 })
  }
}
