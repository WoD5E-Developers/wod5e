/* global ui, game */

// Data item format function
import { formatDataItemId } from '../../actor/scripts/format-data-item-id.js'

export const MigrateOldDetailsToNewItems = async function () {
  const actorsList = game.actors
  const totalIterations = actorsList.size
  const migrationIDs = []

  // If there's nothing to go through, then just resolve and move on.
  if (totalIterations === 0) { return [] }

  // Move old detail data to the new items (v5.0.0)
  for (const actor of actorsList) {
    const actorData = actor.system
    const itemsToCreate = []

    if (actor.type === 'vampire') {
      /*
      * CLAN ITEM
      * Only gets created if the actor doesn't already have a clan item AND has either a bane or a clan set in an old field
      */
      if (actor.items.filter(item => item.type === 'clan').length === 0 && (actorData?.headers?.bane || actorData?.clan?.value)) {
        const name = actorData?.clan?.value || game.i18n.format('WOD5E.NewString', {
          string: 'WOD5E.VTM.Clan'
        })
        const dataItemId = `clan-${formatDataItemId(name)}`

        const clanData = {
          name,
          type: 'clan',
          flags: {
            vtm5e: {
              dataItemId
            }
          },
          system: {
            bane: actorData?.headers?.bane || ''
          }
        }
        itemsToCreate.push(clanData)
      }

      /*
      * PREDATOR TYPE ITEM
      * Only gets created if the actor doesn't already have a predatorType item AND has a predator type set in the old field
      */
      if (actor.items.filter(item => item.type === 'predatorType').length === 0 && actorData?.headers?.predator) {
        const name = actorData?.headers?.predator || game.i18n.format('WOD5E.NewString', {
          string: 'WOD5E.VTM.PredatorType'
        })
        const dataItemId = `predatorType-${formatDataItemId(name)}`

        const predatorData = {
          name,
          type: 'predatorType',
          flags: {
            vtm5e: {
              dataItemId
            }
          }
        }
        itemsToCreate.push(predatorData)
      }

      /*
      * RESONANCE ITEM
      * Only gets created if the actor doesn't already have a resonance item AND has a resonance set in the old field
      */
      if (actor.items.filter(item => item.type === 'resonance').length === 0 && actorData?.blood?.resonance) {
        const name = actorData?.blood?.resonance || game.i18n.format('WOD5E.NewString', {
          string: 'WOD5E.VTM.Resonance'
        })
        const dataItemId = `resonance-${formatDataItemId(name)}`

        const resonanceData = {
          name,
          type: 'resonance',
          flags: {
            vtm5e: {
              dataItemId
            }
          }
        }
        itemsToCreate.push(resonanceData)
      }
    } else if (actor.type === 'hunter') {
      /*
      * CREED ITEM
      * Only gets created if the actor doesn't already have a creed item AND has either a creed or creedFields set in the old fields
      */
      if (actor.items.filter(item => item.type === 'creed').length === 0 && (actorData?.headers?.creed || actorData?.headers?.creedFields)) {
        const name = actorData?.headers?.creed || game.i18n.format('WOD5E.NewString', {
          string: 'WOD5E.HTR.Creed'
        })
        const dataItemId = `creed-${formatDataItemId(name)}`

        const creedData = {
          name,
          type: 'creed',
          flags: {
            vtm5e: {
              dataItemId
            }
          },
          system: {
            desperationFields: actorData?.headers?.creedFields || ''
          }
        }
        itemsToCreate.push(creedData)
      }

      /*
      * DRIVE ITEM
      * Only gets created if the actor doesn't already have a drive item AND has either drive or redemption set in the old fields
      */
      if (actor.items.filter(item => item.type === 'drive').length === 0 && (actorData?.headers?.drive || actorData?.redemption?.value)) {
        const name = actorData?.headers?.drive || game.i18n.format('WOD5E.NewString', {
          string: 'WOD5E.HTR.Drive'
        })
        const dataItemId = `drive-${formatDataItemId(name)}`

        const driveData = {
          name,
          type: 'drive',
          flags: {
            vtm5e: {
              dataItemId
            }
          },
          system: {
            redemption: actorData?.redemption?.value || ''
          }
        }
        itemsToCreate.push(driveData)
      }
    } else if (actor.type === 'werewolf') {
      /*
      * TRIBE ITEM
      * Only gets created if the actor doesn't already have a clan item AND has any tribe, patron, favor or ban set in the old fields
      */
      if (actor.items.filter(item => item.type === 'tribe').length === 0 && (actorData?.headers?.tribe || actorData?.headers?.patron || actorData?.headers?.favor || actorData?.headers?.ban)) {
        const name = actorData?.headers?.tribe || game.i18n.format('WOD5E.NewString', {
          string: 'WOD5E.WTA.Tribe'
        })
        const dataItemId = `tribe-${formatDataItemId(name)}`

        const tribeData = {
          name,
          type: 'tribe',
          flags: {
            vtm5e: {
              dataItemId
            }
          },
          system: {
            patronSpirit: {
              name: actorData?.headers?.patron || '',
              description: '',
              favor: actorData?.headers?.favor || '',
              ban: actorData?.headers?.ban || ''
            }
          }
        }
        itemsToCreate.push(tribeData)
      }

      /*
      * CLAN ITEM
      * Only gets created if the actor doesn't already have a clan item AND has an auspice set in the old field
      */
      if (actor.items.filter(item => item.type === 'auspice').length === 0 && (actorData?.headers?.auspice)) {
        const name = actorData?.headers?.auspice || game.i18n.format('WOD5E.NewString', {
          string: 'WOD5E.WTA.Auspice'
        })
        const dataItemId = `auspice-${formatDataItemId(name)}`

        const auspiceData = {
          name,
          type: 'auspice',
          flags: {
            vtm5e: {
              dataItemId
            }
          }
        }
        itemsToCreate.push(auspiceData)
      }
    }

    if (itemsToCreate.length > 0) {
      actor.createEmbeddedDocuments('Item', itemsToCreate)
      ui.notifications.info(`Fixing actor ${actor.name}: Creating new data items.`)
      migrationIDs.push(actor.id)
    }
  }

  return migrationIDs
}
