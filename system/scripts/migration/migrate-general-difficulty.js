/* global ui, game */

export const MigrateGeneralDifficulty = async function () {
  const actorsList = game.actors.filter((actor) => actor.type === 'spc')
  const totalIterations = actorsList.size
  const migrationIDs = []

  // If there's nothing to go through, then just resolve and move on.
  if (totalIterations === 0) { return [] }

  // Fix the General Difficulty of SPC sheets (v5.0.0)
  for (const actor of actorsList) {
    const actorData = actor.system

    // Check if the actor has both normal and strongest general difficulties using the old values, or the old values are null
    if ((actorData?.generaldifficulty?.normal?.value && actorData?.generaldifficulty?.strongest?.value) || (actorData?.generaldifficulty?.normal?.value === null || actorData?.generaldifficulty?.strongest?.value === null)) {
      const generaldifficulty = {
        normal: actorData.generaldifficulty.normal.value || 0,
        strongest: actorData.generaldifficulty.strongest.value || 0
      }

      // Update the actor's data with the new information
      await actor.update({ 'system.generaldifficulty': generaldifficulty })

      // Send a notification and push the actor ID to the migration IDs list
      ui.notifications.info(`Fixing actor ${actor.name}: Migrating General Difficulty data.`)
      migrationIDs.push(actor.uuid)
    }
  }

  return migrationIDs
}
