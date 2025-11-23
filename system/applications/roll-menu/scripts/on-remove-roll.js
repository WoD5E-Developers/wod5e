export const _onRemoveSavedRoll = async function (event, target) {
  // Grab all the variables we need upfront
  const rollToRemove = target.closest('.saved-roll').getAttribute('data-id')
  const currentActiveRoll = game.users.current.getFlag('wod5e', 'rollMenuActiveRoll')
  const savedRolls = foundry.utils.duplicate(
    game.users.current.getFlag('wod5e', 'rollMenuSavedRolls')
  )

  // Define the content of the Dialog
  const content = `<p>
    ${game.i18n.format('WOD5E.ConfirmDeleteDescription', {
      string: savedRolls[currentActiveRoll].name
    })}
  </p>`

  // Prompt a dialog for the user to confirm they want to delete the item
  const confirmDelete = await foundry.applications.api.DialogV2.wait({
    window: {
      title: game.i18n.localize('WOD5E.ConfirmDelete')
    },
    classes: ['wod5e', 'dialog'],
    content,
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

  if (confirmDelete) {
    // Remove the roll
    delete savedRolls[rollToRemove]

    // If the roll was the one currently being viewed, reset the active roll to the first
    // set roll, or just nothing
    if (rollToRemove === currentActiveRoll) {
      const keys = Object.keys(savedRolls)
      const newActiveRoll = keys.length ? keys[0] : ''

      await game.users.current.setFlag('wod5e', 'rollMenuActiveRoll', newActiveRoll)
    }

    // Update the saved rolls flag
    await game.users.current.update({ [`flags.wod5e.rollMenuSavedRolls.-=${rollToRemove}`]: null })

    // Re-render the application window once settings are updated
    const RollMenuApplication = foundry.applications.instances.get('wod5e-roll-menu')
    if (RollMenuApplication) {
      RollMenuApplication.render()
    }
  }
}
