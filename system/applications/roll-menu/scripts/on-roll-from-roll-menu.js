/* global game, WOD5E, ChatMessage, ui */

export const _onRollFromRollMenu = async function (event) {
  event.preventDefault()

  // Ensure we have a valid actor selected
  const actor = game.actors.get(ChatMessage.getSpeaker().actor)
  if (!actor) ui.notifications.warn(game.i18n.localize('WOD5E.Notifications.NoTokenSelected'))

  // Grab data from user config flags to determine the currently active roll
  const activeRoll = await game.users.current.getFlag('vtm5e', 'rollMenuActiveRoll')
  const savedRolls = await game.users.current.getFlag('vtm5e', 'rollMenuSavedRolls')
  const activeRollObject = savedRolls[activeRoll]

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
