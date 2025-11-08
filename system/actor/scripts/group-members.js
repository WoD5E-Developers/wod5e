export const _addActor = async function (group, uuid) {
  // Define the actor data
  const actor = fromUuidSync(uuid)

  // Don't let group sheets be added to group sheets
  if (actor.type === 'group') return

  // Check if the actor is unique in the already existing list;
  // Returns false if it's found, or true if it's not found
  const actorIsntUnique = group.system.members.find((players) => players === uuid)
  if (actorIsntUnique) {
    ui.notifications.warn(`Actor ${actor.name} is already part of this group.`)

    return
  }

  // Check if the actor is already in a group and if the group still exists
  const actorHasGroup = actor.system.group
  const groupExists = game.actors.get(actorHasGroup)

  if (actorHasGroup && groupExists) {
    ui.notifications.warn(`Actor ${actor.name} is already in an existing group.`)

    return
  }

  // If the actor exists, is unique, and does not already belong to an existing group, continue
  // Define the current members list
  const membersList = group.system.members ? group.system.members : []

  // Push actor to the list
  membersList.push(uuid)

  // Update the group sheet with the new actor
  await group.update({ 'system.members': membersList })

  // Set the actor's group to the group's ID
  await actor.update({ 'system.group': group.id })

  // Update the group's permissions to include the players as limited by default if the default ownership is "none"
  // Otherwise keep whatever default ownership the storyteller has set
  if (actor.hasPlayerOwner && group.ownership.default === 0) {
    await group.update({ ownership: { default: 1 } })
  }

  // Re-render the actors list
  await game.actors.render()
}

export const _removeActor = async function (event, target) {
  event.preventDefault()

  if (!this.actor.isOwner) return

  // Define variables
  const uuid = target.getAttribute('data-uuid')
  const group = this.actor
  const actor = fromUuidSync(uuid)

  // Filter out the UUID from the members list
  const membersList = group.system.members.filter((actor) => actor !== uuid)

  // Update the group sheet with the new members list
  await group.update({ 'system.members': membersList })

  // Empty the group field on the actor
  await actor.update({ 'system.group': '' })

  // Re-render the actors list
  await game.actors.render()
}

export const _openActorSheet = async function (event, target) {
  event.preventDefault()

  // Define variables
  const uuid = target.getAttribute('data-uuid')
  const actor = fromUuidSync(uuid)

  actor.sheet.render(true)
}
