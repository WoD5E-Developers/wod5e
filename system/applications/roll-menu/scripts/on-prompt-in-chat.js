export const _onPromptInChat = async function (event) {
  const dataset = event.target.dataset
  let rollId

  // Grab data from user config flags to determine the currently active roll
  const savedRolls = await game.users.current.getFlag('wod5e', 'rollMenuSavedRolls')

  // Get the saved roll ID from either the ID passed through the dataset, or the currently active roll
  if (dataset?.dataId) {
    // Check to make sure the ID actually exists
    if (!savedRolls[dataset?.dataId]) {
      ui.notifications.warn(
        game.i18n.format('WOD5E.Notifications.RollIdNotFound', {
          string: dataset?.dataId
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

  // Compile the list of tokens selected and use them as
  // the basis for default users being prompted for the roll
  const promptedRolls = {}
  const tokens = canvas.tokens.controlled
  const actorsList = tokens.map((i) => i.actor)
  actorsList.forEach((actor) => {
    promptedRolls[actor.id] = {
      actor,
      rolled: false
    }
  })

  // Create the chat message
  foundry.documents.ChatMessage.implementation.create({
    title: `${activeRollObject.name}`,
    flavor: `<b>${game.i18n.localize('WOD5E.RollList.TestOf')}:</b> ${activeRollObject.dice.skill} + ${activeRollObject.dice.attribute}${
      // Dynamically determine whether to append the 'difficulty' part of the title or not
      activeRollObject.difficulty > 0
        ? ' vs <b>' +
          game.i18n.format('WOD5E.Chat.DifficultyString', {
            string: activeRollObject.difficulty
          }) +
          '</b>'
        : ''
    }`,
    flags: {
      wod5e: {
        template: 'systems/wod5e/display/ui/chat/chat-message-roll-prompt.hbs',
        valuePaths: valuePathsArray.join(' '),
        isRollPrompt: true,
        promptedRolls,
        difficulty: activeRollObject.difficulty
      }
    }
  })
}
