/* global ui, game */

export const MigrateAbilitiesToAttributes = async function () {
  const actorsList = game.actors
  const totalIterations = actorsList.size
  const migrationIDs = []

  // If there's nothing to go through, then just resolve and move on.
  if (totalIterations === 0) {
    return []
  }

  // Fix 'abilities' to use the proper term of 'attributes'
  for (const actor of actorsList) {
    const actorData = actor.system

    // Ignore all non-player sheets
    // Additionally, if actorData.attributes already exists, ignore it as well
    if (
      actor.type !== 'spc' &&
      actor.type !== 'cell' &&
      actor.type !== 'coterie' &&
      actor.type !== 'group' &&
      actorData.abilities
    ) {
      // Move abilities -> attributes
      actorData.attributes = actorData.abilities

      // Delete the old abilities data
      delete actorData.abilities
      await actor.update({ 'system.-=abilities': null })

      // Update the actor's data with the new attributes information
      await actor.update({ system: actorData })

      // Send a notification and push the actor ID to the migration IDs list
      ui.notifications.info(`Fixing actor ${actor.name}: Migrating abilities data to attributes.`)
      migrationIDs.push(actor.uuid)
    }
  }

  return migrationIDs
}
