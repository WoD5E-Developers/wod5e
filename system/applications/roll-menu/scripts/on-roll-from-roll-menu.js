/* global game, WOD5E, ChatMessage, ui */

export const _onRollFromRollMenu = async function (event) {
  event.preventDefault()

  const actor = game.actors.get(ChatMessage.getSpeaker().actor)

  if (!actor) ui.notifications.warn(game.i18n.localize('WOD5E.Notifications.NoTokenSelected'))

  const activeRoll = await game.users.current.getFlag('vtm5e', 'rollMenuActiveRoll')
  const savedRolls = await game.users.current.getFlag('vtm5e', 'rollMenuSavedRolls')

  const activeRollObject = savedRolls[activeRoll]

  let valuePathsArray = []

  if (activeRollObject.dice.skill) valuePathsArray.push(`skills.${activeRollObject.dice.skill}.value`)
  if (activeRollObject.dice.attribute) valuePathsArray.push(`attributes.${activeRollObject.dice.attribute}.value`)

  WOD5E.api.RollFromDataset({
    dataset: {
      label: activeRollObject.name,
      valuePaths: valuePathsArray.join(' ')
    },
    actor
  })
}
