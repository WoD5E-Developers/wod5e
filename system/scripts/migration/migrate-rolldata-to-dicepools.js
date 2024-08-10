/* global ui, game, WOD5E, foundry */

export const MigrateRolldataToDicepools = async function () {
  const actorsList = game.actors
  const totalIterations = actorsList.size
  const migrationIDs = []

  // If there's nothing to go through, then just resolve and move on.
  if (totalIterations === 0) { return [] }

  // Fix image data across items (v4.0.0)
  for (const actor of actorsList) {
    const actorItems = actor.items
    const updatedItems = []
    let hasFixedItems = false

    for (const item of actorItems) {
      // If the item was previously rollable, migrate the rolldata to the new format
      if (item.system?.rollable) {
        hasFixedItems = true
        let dicepool = {}

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
        const { roll1, roll2, rollable, ...remainingSystem } = updatedItem.system
        roll1 = null
        roll2 = null
        rollable = null
        updatedItem.system = remainingSystem

        // Push the updated item to the array
        updatedItems.push(updatedItem)
      }
    }

    if (hasFixedItems) {
      // Update the actor's data with the new information
      actor.updateEmbeddedDocuments('Item', updatedItems)
      ui.notifications.info(`Fixing actor ${actor.name}: Migrating roll data of items.`)
    }
  }

  return migrationIDs

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
