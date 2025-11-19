export const MigrateSystemId = async function () {
  // Define the template to be used
  const template = `
    <div class="form-group">
        <label>${game.i18n.localize('WOD5E.MigrateSystemIdDescription')}</label>
    </div>`

  const shouldUpdate = await foundry.applications.api.DialogV2.confirm({
    window: { title: game.i18n.localize('WOD5E.MigrateSystemIdTitle') },
    content: template,
    yes: {
      label: game.i18n.localize('WOD5E.Confirm')
    },
    no: {
      label: game.i18n.localize('WOD5E.Cancel'),
      default: true
    },
    classes: ['wod5e']
  })

  if (shouldUpdate) {
    ui.notifications.info(game.i18n.localize('WOD5E.MigrateSystemIdInProgress'))
    await updateWorldDetails()
    ui.notifications.info(game.i18n.localize('WOD5E.MigrateSystemIdComplete'))
  } else {
    ui.notifications.info(game.i18n.localize('WOD5E.MigrateSystemIdCancel'))
  }
}

// Update the world's system from vtm5e to wod5e
async function updateWorldDetails() {
  const worldData = {
    action: 'editWorld',
    id: game.world.id,
    system: 'wod5e'
  }

  await foundry.utils.fetchJsonWithTimeout(foundry.utils.getRoute('setup'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(worldData)
  })

  game.world.updateSource(worldData)
}
