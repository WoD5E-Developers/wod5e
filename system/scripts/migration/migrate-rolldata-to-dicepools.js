/* global ui, game, WOD5E, foundry, Item */

export const MigrateRolldataToDicepools = async function () {
  const compendiumsActorsList = game.packs.filter(compendium => compendium.metadata.type === 'Actor')
  const compendiumsItemsList = game.packs.filter(compendium => compendium.metadata.type === 'Item')
  const actorsList = game.actors
  const itemsList = game.items
  const totalIterations = actorsList.size + compendiumsItemsList.size + itemsList.size
  const migrationIDs = []

  // If there's nothing to go through, then just resolve and move on.
  if (totalIterations === 0) { return [] }

  // Fix dicepools of rollable items in actors in compendiums
  for (const compendium of compendiumsActorsList) {
    const docs = await compendium.getDocuments()

    for (const actor of docs) {
      const actorItems = actor.items
      const updatedActorItems = []
      let hasFixedItems = false

      for (const item of actorItems) {
        // If the item was previously rollable and doesn't already have a filled dicepool, migrate the rolldata to the new format
        if ((item.system?.rollable || item.type === 'customRoll') && foundry.utils.isEmpty(item.system?.dicepool)) {
          hasFixedItems = true

          // Push the updated item to the array
          updatedActorItems.push(fixItemData(item))
        }
      }

      if (hasFixedItems) {
        // Update the actor's data with the new information
        actor.updateEmbeddedDocuments('Item', updatedActorItems)
        ui.notifications.info(`Fixing actor ${actor.name}: Migrating roll data of items.`)
        migrationIDs.push(actor.id)
      }
    }
  }

  // Fix dicepools of rollable items in compendiums
  for (const compendium of compendiumsItemsList) {
    const docs = await compendium.getDocuments()

    const updates = docs
      .filter((item) => (item.system?.rollable || item.type === 'customRoll') && foundry.utils.isEmpty(item.system?.dicepool))
      .map((item) => {
        const updatedItemData = fixItemData(item)
        return {
          _id: item._id,
          ...updatedItemData
        }
      })

    // Apply the updates to the compendium
    if (updates.length > 0) {
      Item.updateDocuments(updates, {
        pack: compendium.metadata.id
      })
    }
  }

  // Fix dicepools of rollable items in the world
  for (const item of itemsList) {
    // If the item was previously rollable and doesn't already have a filled dicepool, migrate the rolldata to the new format
    if ((item.system?.rollable || item.type === 'customRoll') && foundry.utils.isEmpty(item.system?.dicepool)) {
      // Push the updated item data
      item.update({
        ...fixItemData(item)
      })
    }
  }

  // Fix dicepools of rollable items on actors
  for (const actor of actorsList) {
    const actorItems = actor.items
    const updatedActorItems = []
    let hasFixedItems = false

    for (const item of actorItems) {
      // If the item was previously rollable and doesn't already have a filled dicepool, migrate the rolldata to the new format
      if ((item.system?.rollable || item.type === 'customRoll') && foundry.utils.isEmpty(item.system?.dicepool)) {
        hasFixedItems = true

        // Push the updated item to the array
        updatedActorItems.push(fixItemData(item))
      }
    }

    if (hasFixedItems) {
      // Update the actor's data with the new information
      actor.updateEmbeddedDocuments('Item', updatedActorItems)
      ui.notifications.info(`Fixing actor ${actor.name}: Migrating roll data of items.`)
      migrationIDs.push(actor.id)
    }
  }

  return migrationIDs

  function fixItemData (item) {
    const dicepool = {}

    if (item.system.dice1) {
      const randomID = foundry.utils.randomID(8)

      dicepool[randomID] = {
        path: getDicePath(item.system.dice1, item.system)
      }
    }

    if (item.system.dice2) {
      const randomID = foundry.utils.randomID(8)

      dicepool[randomID] = {
        path: getDicePath(item.system.dice2, item.system)
      }
    }

    // Create a new object with the updated 'img' property
    const updatedItem = {
      _id: item._id, // Preserve the original _id
      ...item.toObject(),
      system: {
        dicepool
      }
    }

    // Remove unnecessary data
    delete updatedItem.system.roll1
    delete updatedItem.system.roll2
    delete updatedItem.system.rollable

    // Push the updated item to the array
    return updatedItem
  }

  // Function to change a given dice into its path
  function getDicePath (string, data) {
    string.toLowerCase()

    const skillsList = WOD5E.Skills.getList({})
    const attributesList = WOD5E.Attributes.getList({})

    if (string in skillsList) {
      return `skills.${string}`
    } else if (string in attributesList) {
      return `attributes.${string}`
    } else if (string === 'discipline') {
      if (data.discipline === 'rituals') {
        return 'disciplines.sorcery'
      } else if (data.discipline === 'ceremonies') {
        return 'disciplines.oblivion'
      } else {
        return `disciplines.${data.discipline}`
      }
    } else if (string === 'gift') {
      return `gifts.${data.gift}`
    }
  }
}
