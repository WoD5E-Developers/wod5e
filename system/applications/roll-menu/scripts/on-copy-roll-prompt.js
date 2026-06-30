export const _onCopyRollPrompt = async function (event) {
  event.preventDefault()

  const userId = game.users.current.id
  const savedRolls = await game.users.current.getFlag('wod5e', 'rollMenuSavedRolls')
  const rollId = await game.users.current.getFlag('wod5e', 'rollMenuActiveRoll')
  const activeRollObject = savedRolls[rollId]

  const dataId = `${userId}.${rollId}`
  const dataLabel = activeRollObject.name

  const rollString = `@RollPromptToChat[${dataId}]{${dataLabel}}`

  game.clipboard.copyPlainText(rollString)

  ui.notifications.info(
    game.i18n.format('WOD5E.StringCopiedToClipboard', {
      string: rollString
    })
  )
}
