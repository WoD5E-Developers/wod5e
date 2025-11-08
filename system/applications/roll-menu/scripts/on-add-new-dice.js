export const _onAddNewRoll = async function (event) {
  event.preventDefault()

  // Generate a new ID
  const newRollID = foundry.utils.randomID(8)

  // Build the new roll
  const defaultRollObject = {
    name: game.i18n.format('WOD5E.NewString', {
      string: game.i18n.localize('WOD5E.RollList.Label')
    }),
    isExtendedRoll: false,
    isContestedRoll: false,
    dice: {
      skill: '',
      attribute: ''
    }
  }

  // Get the current list of saved rolls and create a new object inside of them
  const savedRolls = await game.users.current.getFlag('vtm5e', 'rollMenuSavedRolls')
  savedRolls[newRollID] = defaultRollObject

  // Persist it back to the user flags
  await game.users.current.setFlag('vtm5e', 'rollMenuSavedRolls', savedRolls)

  // Update the active roll to the new
  await game.users.current.setFlag('vtm5e', 'rollMenuActiveRoll', newRollID)

  // Re-render the application window once settings are updated
  const RollMenuApplication = foundry.applications.instances.get('wod5e-roll-menu')
  if (RollMenuApplication) {
    RollMenuApplication.render()
  }
}
