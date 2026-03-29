export const _onRollFromMenu = async function (event) {
  const dataset = event.target.dataset
  let rollId
  let savedRolls = []

  // Ensure we have a valid actor selected
  const actor = game.actors.get(ChatMessage.getSpeaker().actor)
  if (!actor) {
    return ui.notifications.warn(game.i18n.localize('WOD5E.Notifications.NoTokenSelected'))
  }

  // Get the saved roll ID from either the ID passed through the dataset, or the currently active roll
  if (dataset?.id) {
    // Data array expected format: {User}.{ID}
    const dataArray = dataset?.id.split('.')
    const dataUser = dataArray[0] || ''
    const dataId = dataArray[1] || ''

    // If we have an ID, we use that
    savedRolls = await game.users.get(dataUser).getFlag('wod5e', 'rollMenuSavedRolls')
    rollId = dataId
  } else {
    // If we don't have an ID provided in the dataset, we use the user's personal currently set active roll
    savedRolls = await game.users.current.getFlag('wod5e', 'rollMenuSavedRolls')
    rollId = await game.users.current.getFlag('wod5e', 'rollMenuActiveRoll')
  }

  // Finally pull the details of the roll we should be using
  const activeRollObject = savedRolls[rollId]

  // Check to make sure the lookup actually returned something
  if (!activeRollObject) {
    ui.notifications.warn(
      game.i18n.format('WOD5E.Notifications.RollIdNotFound', {
        string: rollId
      })
    )

    return
  }

  // Construct the valuePaths array that gets sent to the rollFromDataset function
  const valuePathsArray = []
  if (activeRollObject.dice.skill) {
    valuePathsArray.push(`skills.${activeRollObject.dice.skill}.value`)
  }
  if (activeRollObject.dice.attribute) {
    valuePathsArray.push(`attributes.${activeRollObject.dice.attribute}.value`)
  }

  // Pipe the roll to our RollFromDataset function
  WOD5E.api.RollFromDataset({
    dataset: {
      label: activeRollObject.name,
      valuePaths: valuePathsArray.join(' '),
      difficulty: activeRollObject.difficulty
    },
    actor
  })
}
