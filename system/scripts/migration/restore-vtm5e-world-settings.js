export const RestoreOldWorldSettings = async function () {
  // Get world settings from storage that start with 'vtm5e'
  const worldSettings = [...game.settings.storage.get('world').values()].filter((setting) =>
    setting.key.startsWith('vtm5e.')
  )

  // Check to make sure there's at least one setting we need to update
  if (worldSettings.length > 0 && !game.settings.get('wod5e', 'settingsMigrationComplete')) {
    // Begin migration
    ui.notifications.info(
      'Migrating old vtm5e world settings. Please do not shut down your world until this is complete.'
    )

    // Restore world settings from inactive settings by accessing game.settings.storage
    // We have to do this because the 'vtm5e' scope isn't active when the world is migrated over
    worldSettings.forEach((setting) => {
      // Snip out the 'vtm5e' part to get the right 'wod5e' key, and then set the value
      // to complete the migration
      game.settings.set('wod5e', setting.key.replace('vtm5e.', ''), setting.value)
    })

    // Complete migration
    ui.notifications.info('World settings migration complete.')
    game.settings.set('wod5e', 'settingsMigrationComplete', true)
  }
}
