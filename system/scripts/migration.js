/* global ui, game, foundry */

import { MigrateLegacySheets } from './migration/migrate-legacy-sheets.js'
import { MigrateSpecialties } from './migration/migrate-specialties.js'
import { MigrateItemImages } from './migration/migrate-item-images.js'
import { MigrateAnimalKen } from './migration/migrate-animal-ken.js'
import { MigrateGroupSheets } from './migration/migrate-group-sheets.js'
import { MigrateAbilitiesToAttributes } from './migration/migrate-abilities-to-attributes.js'
import { MigrateRolldataToDicepools } from './migration/migrate-rolldata-to-dicepools.js'
import { MigrateOldDetailsToNewItems } from './migration/migrate-old-details-to-new-items.js'
import { MigrateGeneralDifficulty } from './migration/migrate-general-difficulty.js'

export const migrateWorld = async () => {
  // Only allow the Game Master to run this script
  if (!game.user.isGM) return

  // Store current loaded version of the system
  const currentVersion = game.system.version
  // Store the world version pre-migration
  const worldVersion = game.settings.get('vtm5e', 'worldVersion') || '1.5'

  console.log('Current SchreckNet Layer v' + worldVersion)

  async function updateWorld () {
    if (worldVersion !== currentVersion || worldVersion === '1.5') {
      const updates = []

      ui.notifications.info('New version detected. Updating SchreckNet, please wait.')
      console.log('Obtaining SchreckNet Layer v' + currentVersion)

      try {
        // Migrate legacy sheets
        const migrationIDs1 = await MigrateLegacySheets()
        updates.push(...migrationIDs1)

        // Migrate specialties into their respective skills
        const migrationIDs5 = await MigrateSpecialties()
        updates.push(...migrationIDs5)

        // Migrate item images
        const migrationIDs7 = await MigrateItemImages()
        updates.push(...migrationIDs7)

        // Migrate the Animal Ken skill
        const migrationIDs8 = await MigrateAnimalKen()
        updates.push(...migrationIDs8)

        // Unify Cell and Coterie sheets into one "Group" type
        const migrationIDs9 = await MigrateGroupSheets()
        updates.push(...migrationIDs9)

        // Migrate the abilities object to attributes
        const migrationIDs10 = await MigrateAbilitiesToAttributes()
        updates.push(...migrationIDs10)

        // Migrate old roll data on items into the new Dicepool format
        const migrationIDs11 = await MigrateRolldataToDicepools()
        updates.push(...migrationIDs11)

        // Migrate old actor data to new items
        const migrationIDs12 = await MigrateOldDetailsToNewItems()
        updates.push(...migrationIDs12)

        // Migrate General Difficulty of SPC sheets
        const migrationIDs13 = await MigrateGeneralDifficulty()
        updates.push(...migrationIDs13)

        // Only reload if there's 1 or more updates
        if (updates.length > 0) {
          ui.notifications.info('Upgrade complete! Foundry will now refresh in 15 seconds...')

          // Reload to implement the fixes after 15 seconds
          setTimeout(() => {
            foundry.utils.debouncedReload()
          }, 15000)
        } else {
          ui.notifications.info('Welcome to version ' + currentVersion)
        }
      } catch (error) {
        console.error('Error during update:', error)
      }

      // Update game version, no matter if we error or not
      game.settings.set('vtm5e', 'worldVersion', currentVersion)
    }
  }

  updateWorld()
}
