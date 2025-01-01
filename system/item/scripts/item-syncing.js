/* global game, ui, foundry */

export const _onSyncFromDataItem = async function (event) {
  event.preventDefault()

  const item = this.item
  const dataItemId = item.getFlag('vtm5ec', 'dataItemId')

  // Search for an applicable data item - there should only be one
  const compendiumsList = game.packs.filter(compendium => compendium.metadata.type === 'Item')
  const compendiumDataItems = []
  for (const compendium of compendiumsList) {
    const docs = await compendium.getDocuments()

    const foundItems = docs.filter((item) => (item?.flags?.vtm5e?.dataItemId === dataItemId))

    compendiumDataItems.push(...foundItems)
  }

  const worldDataItems = game.items.filter((item) => (item.getFlag('vtm5ec', 'dataItemId') === dataItemId))

  const allDataItems = compendiumDataItems.concat(worldDataItems)
  const totalCount = allDataItems.length

  // If we don't find any instances, we warn the user
  if (totalCount === 0) {
    return ui.notifications.warn(`There were no items found associated with Data Item ID "${dataItemId}"`)
  }

  // If we find more than one instance, we warn the user
  if (totalCount > 1) {
    return ui.notifications.warn(`There were 2 or more items found associated with Data Item ID "${dataItemId}"`)
  }

  // If we find exactly one instance, we use that
  if (totalCount === 1) {
    const itemToSyncFrom = allDataItems[0]

    // Ignore "points" because those are customized per-actor
    delete itemToSyncFrom.system?.points
    // Ignore "uses" because those can also be customized per-actor
    delete itemToSyncFrom.system?.uses

    const updates = {
      name: itemToSyncFrom.name,
      img: itemToSyncFrom.img,
      system: {
        ...itemToSyncFrom.system
      }
    }

    // Update the item with the data pulled
    item.update(updates)

    ui.notifications.info(`Item "${item.name}" has been updated on actor "${item.actor.name}"`)
  }
}

export const _onSyncToDataItems = async function (event) {
  event.preventDefault()

  const item = this.item
  const dataItemId = item.getFlag('vtm5ec', 'dataItemId')

  const actorsList = game.actors
  const actorDataItems = []

  for (const actor of actorsList) {
    const foundItems = actor.items.filter((item) => (item?.flags?.vtm5e?.dataItemId === dataItemId))

    actorDataItems.push(...foundItems)
  }

  const totalCount = actorDataItems.length

  // If there's no items to update, just let the user know
  if (totalCount === 0) {
    return ui.notifications.info(`There were no items found associated with Data Item ID "${dataItemId}"`)
  } else {
    const updateItemsConfirmed = await foundry.applications.api.DialogV2.wait({
      window: {
        title: game.i18n.localize('WOD5E.ItemsList.ConfirmOverwrite')
      },
      content: game.i18n.format('WOD5E.ItemsList.ConfirmOverwriteString', {
        string: totalCount
      }),
      modal: true,
      buttons: [
        {
          label: game.i18n.localize('WOD5E.Confirm'),
          action: true
        },
        {
          label: game.i18n.localize('WOD5E.Cancel'),
          action: false
        }
      ]
    })

    if (updateItemsConfirmed) {
      // Iterate through each item that we filtered and update them
      actorDataItems.forEach((itemToUpdate) => {
        // Ignore "points" because those are customized per-actor
        delete item.system?.points
        // Ignore "uses" because those can also be customized per-actor
        delete item.system?.uses

        const updates = {
          name: item.name,
          img: item.img,
          system: {
            ...item.system
          }
        }

        // Update the item with the data pulled
        itemToUpdate.update(updates)

        ui.notifications.info(`Item "${itemToUpdate.name}" has been updated on actor "${itemToUpdate.actor.name}"`)
      })
    }
  }
}
