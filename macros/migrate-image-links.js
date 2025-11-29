export const MigrateImageLinks = async function () {
  const oldPath = 'systems/vtm5e/'
  const newPath = 'systems/wod5e/'
  // Escape the oldPath for the regex
  const escapedOldPath = oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  // Create a case-insensitive regex to use in replacement functions
  const regex = new RegExp(escapedOldPath, 'i')

  // World documents
  const actorsList = game.actors.contents
  const actorsItemsList = actorsList.flatMap((actor) =>
    actor.items.filter((i) => i.img?.includes(oldPath))
  )
  const itemsList = game.items.filter((i) => i.img.includes(oldPath))
  const messagesList = game.messages.filter((m) => m.img?.includes(oldPath))

  // Compendium documents
  const actorPacks = game.packs.filter((p) => p.documentClass.documentName === 'Actor')
  let compendiumActorItemsList, compendiumActorsList
  if (actorPacks) {
    const compendiumActors = (await Promise.all(actorPacks.map((c) => c.getDocuments()))).flat()
    compendiumActorsList = compendiumActors
    compendiumActorItemsList = compendiumActorsList.flatMap((actor) =>
      actor.items.filter((i) => i.img?.includes(oldPath))
    )
  }

  const itemPacks = game.packs.filter((p) => p.documentClass.documentName === 'Item')
  let compendiumItemsList
  if (itemPacks) {
    const compendiumItems = (await Promise.all(itemPacks.map((c) => c.getDocuments()))).flat()
    compendiumItemsList = compendiumItems.filter((i) => i.img.includes(oldPath))
  }

  const allLists = [
    actorsList,
    actorsItemsList,
    itemsList,
    messagesList,
    compendiumActorsList,
    compendiumActorItemsList,
    compendiumItemsList
  ]

  const total = allLists.reduce((sum, arr) => sum + arr.length, 0)
  let current = 0

  // Nothing to migrate
  if (total === 0) return

  // Define the content of the Dialog
  const content = `<p>
      There were ${total} entities needing to have their image paths updated. Do you wish to proceed?
    </p>`

  const updateEntitiesConfirm = await foundry.applications.api.DialogV2.wait({
    window: {
      title: 'Confirm Updating Entities'
    },
    classes: ['wod5e', 'dialog'],
    content,
    modal: true,
    buttons: [
      {
        label: 'Proceed',
        action: true
      },
      {
        label: 'Cancel',
        action: false
      }
    ]
  })

  if (updateEntitiesConfirm) {
    const migrationProgress = ui.notifications.info(
      `Migrating image paths of ${total} entities from vtm5e to wod5e. Do not close Foundry until complete.`,
      {
        permanent: true,
        progress: true
      }
    )

    // --- WORLD ACTORS ---
    for (const actor of actorsList) {
      await replaceImg(actor)
      await replaceActorEmbeddedItems(actor)
      await updateProgressTracker(migrationProgress)
    }

    // --- WORLD ITEMS ---
    for (const item of itemsList) {
      await replaceImg(item)
      await updateProgressTracker(migrationProgress)
    }

    // --- WORLD MESSAGES ---
    for (const msg of messagesList) {
      await replaceImg(msg)
      await updateProgressTracker(migrationProgress)
    }

    // --- COMPENDIUM ACTORS ---
    for (const actor of compendiumActorsList) {
      await replaceImg(actor)
      await replaceActorEmbeddedItems(actor)
      await updateProgressTracker(migrationProgress)
    }

    // --- COMPENDIUM ITEMS ---
    for (const item of compendiumItemsList) {
      await replaceImg(item)
      await updateProgressTracker(migrationProgress)
    }

    ui.notifications.info('Image migration complete.')
  }

  async function replaceImg(entity) {
    let hasLockedPack = false
    let pack

    if (!entity.img || !entity.img.includes(oldPath)) return null

    // Check for if this entity is in a pack
    if (entity?.pack) {
      pack = game.packs.get(entity.pack)

      // Unlock the pack if needed
      if (pack?.locked) {
        hasLockedPack = true
        await pack.configure({ locked: false })
      }
    }

    // Update the entity
    await entity.update({ img: entity.img.replace(regex, newPath) })

    // Re-lock the pack
    if (hasLockedPack) {
      await pack.configure({ locked: true })
    }
  }

  async function replaceActorEmbeddedItems(actor) {
    let hasLockedPack = false
    let pack

    // Check for if this entity is in a pack
    if (actor?.pack) {
      pack = game.packs.get(actor.pack)

      // Unlock the pack if needed
      if (pack?.locked) {
        hasLockedPack = true
        await pack.configure({ locked: false })
      }
    }

    // Update the actor's embedded items
    const updates = []
    for (const item of actor.items) {
      if (item.img?.includes(oldPath)) {
        updates.push({
          _id: item.id,
          img: item.img.replace(regex, newPath)
        })
      }
    }

    // Batch updates
    if (updates.length > 0) {
      await actor.updateEmbeddedDocuments('Item', updates)
    }

    current += updates.length

    // Re-lock the pack
    if (hasLockedPack) {
      await pack.configure({ locked: true })
    }
  }

  async function updateProgressTracker(notification) {
    current++
    notification.update({
      pct: current / total
    })
  }
}
