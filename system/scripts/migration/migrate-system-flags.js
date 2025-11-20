export const MigrateSystemFlags = async function () {
  // Filter down to entities in the world that only have a vtm5e flag set
  const actorsList = game.actors.filter((a) => a.flags?.vtm5e)
  const itemsList = game.items.filter((i) => i.flags?.vtm5e)
  const messagesList = game.messages.filter((m) => m.flags?.vtm5e)

  // Get the compendium collections
  const actorCompendiums = game.packs.filter((c) => c.metadata.type === 'Actor' && !c.locked)
  const itemCompendiums = game.packs.filter((c) => c.metadata.type === 'Item' && !c.locked)

  // Load all actor documents from all actor compendiums
  const compendiumActors = (await Promise.all(actorCompendiums.map((c) => c.getDocuments()))).flat()

  // Load all item documents from all item compendiums
  const compendiumItems = (await Promise.all(itemCompendiums.map((c) => c.getDocuments()))).flat()

  // Filter each to those containing a vtm5e flag
  const compendiumActorsList = compendiumActors.filter((doc) => doc.flags?.vtm5e)
  const compendiumItemsList = compendiumItems.filter((doc) => doc.flags?.vtm5e)

  const allLists = [
    actorsList,
    itemsList,
    messagesList,
    compendiumActorsList,
    compendiumItemsList
  ]

  const total = allLists.reduce((sum, arr) => sum + arr.length, 0)

  if (total > 0) {
    // Begin migration
    ui.notifications.info(
      'Migrating all entity flags. Do not shut down the game server until this is finished.'
    )

    // Migrate all vtm5e flags to wod5e flags
    for (const actor of actorsList) {
      await updateFlags(actor)
    }

    for (const actor of compendiumActorsList) {
      await updateFlags(actor)
    }

    for (const item of itemsList) {
      await updateFlags(item)
    }

    for (const item of compendiumItemsList) {
      await updateFlags(item)
    }

    for (const message of messagesList) {
      await updateFlags(message)
    }

    // Complete migration
    ui.notifications.info('Entity flag migration complete.')
  }

  function updateFlags(entity) {
    const oldFlags = entity.flags.vtm5e
    entity.update({
      flags: {
        wod5e: oldFlags
      }
    })
  }
}
