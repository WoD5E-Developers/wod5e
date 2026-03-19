export const _onRollFromMenu = async function (event) {
  const dataset = event.target.dataset
  let rollId

  // Ensure we have a valid actor selected
  const actor = game.actors.get(ChatMessage.getSpeaker().actor)
  if (!actor)
    return ui.notifications.warn(game.i18n.localize('WOD5E.Notifications.NoTokenSelected'))

  // Grab data from user config flags to determine the currently active roll
  const savedRolls = await game.users.current.getFlag('wod5e', 'rollMenuSavedRolls')

  // Get the saved roll ID from either the ID passed through the dataset, or the currently active roll
  console.log(dataset)
  if (dataset?.id) {
    // Check to make sure the ID actually exists
    if (!savedRolls[dataset?.id]) {
      ui.notifications.warn(
        game.i18n.format('WOD5E.Notifications.RollIdNotFound', {
          string: dataset?.id
        })
      )

      return
    }

    rollId = dataset.id
  } else {
    rollId = await game.users.current.getFlag('wod5e', 'rollMenuActiveRoll')
  }

  // Finally pull the details of the roll we should be using
  const activeRollObject = savedRolls[rollId]

  // Construct the valuePaths array that gets sent to the rollFromDataset function
  const valuePathsArray = []
  if (activeRollObject.dice.skill)
    valuePathsArray.push(`skills.${activeRollObject.dice.skill}.value`)
  if (activeRollObject.dice.attribute)
    valuePathsArray.push(`attributes.${activeRollObject.dice.attribute}.value`)

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
