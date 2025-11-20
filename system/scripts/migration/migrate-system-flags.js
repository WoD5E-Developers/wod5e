export const MigrateSystemFlags = async function () {
  // Filter down to entities that only have a vtm5e flag set
  const actorsList = game.actors.filter((a) => a.flags?.vtm5e)
  const itemsList = game.items.filter((i) => i.flags?.vtm5e)
  const messagesList = game.messages.filter((m) => m.flags?.vtm5e)

  // Begin migration
  ui.notifications.info(
    'Migrating all entity flags. Please do not shut down the game until this is finished.'
  )

  // Migrate all vtm5e flags to wod5e flags
  for (const actor of actorsList) {
    await updateFlags(actor)
  }

  for (const item of itemsList) {
    await updateFlags(item)
  }

  for (const message of messagesList) {
    await updateFlags(message)
  }

  // Complete migration
  ui.notifications.info('Entity flag migration complete.')

  function updateFlags(entity) {
    const oldFlags = entity.flags.vtm5e
    entity.update({
      flags: {
        wod5e: oldFlags
      }
    })
  }
}
