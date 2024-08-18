/* global WOD5E, TextEditor */

// Handle gift data so we can display it on the actor sheet
export const _prepareWerewolfItems = async function (actor, sheetData) {
  // Secondary variables
  const gifts = actor.system.gifts

  for (const giftType in gifts) {
    // Localize the gift name
    gifts[giftType].label = WOD5E.api.generateLabelAndLocalize({ string: giftType, type: 'gift' })

    // Wipe old gift powers so they doesn't duplicate
    gifts[giftType].powers = []
  }
  actor.system.rites = []

  // Iterate through items, allocating to containers
  for (const i of sheetData.items) {
    if (i.type === 'gift') {
      if (i.system.giftType === 'rite') {
        // Append to the rites list.
        actor.system.rites.push(i)
      } else {
        // Append to each of the gift types.
        if (i.system.giftType !== undefined) {
          gifts[i.system.giftType].powers.push(i)
        }
      }
    }
  }
}

// Handle gift data so we can display it on the actor sheet
export const prepareGiftData = async function (sheetData) {
  const gifts = sheetData.actor.system.gifts

  // Sort the gift containers by the level of the gift instead of by creation date
  for (const giftType in gifts) {
    if (gifts[giftType].powers.length > 0) {
      // If there are any gift powers in the list, make them visible
      if (!gifts[giftType].visible) gifts[giftType].visible = true

      gifts[giftType].powers = gifts[giftType].powers.sort(function (gift1, gift2) {
        // If the levels are the same, sort alphabetically instead
        if (gift1.system.level === gift2.system.level) {
          return gift1.name.localeCompare(gift2.name)
        }

        // Sort by level
        return gift1.system.level - gift2.system.level
      })
    }

    // Enrich gift description
    gifts[giftType].enrichedDescription = await TextEditor.enrichHTML(gifts[giftType].description)
  }

  return gifts
}

// Handle rite data so we can display it on the actor sheet
export const prepareRiteData = async function (sheetData) {
  const rites = sheetData.actor.system.rites

  // Sort the rite containers by the level of the rite instead of by creation date
  rites.sort(function (rite1, rite2) {
    // If the levels are the same, sort alphabetically instead
    if (rite1.system.level === rite2.system.level) {
      return rite1.name.localeCompare(rite2.name)
    }

    // Sort by level
    return rite1.system.level - rite2.system.level
  })

  return rites
}
