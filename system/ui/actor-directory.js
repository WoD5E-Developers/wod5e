/* global game, foundry, fromUuidSync */

/**
 * Extend the base ActorDirectory functionality
 * @extends {ActorDirectory}
 */
export class WOD5EActorDirectory extends foundry.applications.sidebar.tabs.ActorDirectory {
  constructor (...args) {
    super(...args)

    // The structure of the sidebar we're going to be manipulating
    const actorStructure = game.actors.tree

    // List of actors in groups
    const actorsInGroups = []

    // Push each group sheet into the groupsList
    this.groups = actorStructure.entries.filter(actor => actor.type === 'group')

    // Iterate through each group's members list
    this.groups.forEach(group => {
      const groupMembers = group.system?.members

      // Add group members to actorsInGroups list so we can filter them out later
      if (groupMembers) {
        groupMembers.forEach(actorUuid => {
          const actorObject = fromUuidSync(actorUuid)

          // Check to verify the actor exists
          if (actorObject) {
            // Make super sure that the actor has its folder field set to an empty string.
            actorObject.update({ folder: '' })

            actorsInGroups.push(actorObject.id)
          }
        })
      }
    })
  }
}
