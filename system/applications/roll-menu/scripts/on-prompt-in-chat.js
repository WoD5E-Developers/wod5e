/* global game, foundry, canvas */

export const _onPromptInChat = async function (event) {
  event.preventDefault()

  // Grab data from user config flags to determine the currently active roll
  const activeRoll = await game.users.current.getFlag('vtm5e', 'rollMenuActiveRoll')
  const savedRolls = await game.users.current.getFlag('vtm5e', 'rollMenuSavedRolls')
  const activeRollObject = savedRolls[activeRoll]

  // Construct the valuePaths array that gets sent to the rollFromDataset function
  let valuePathsArray = []
  if (activeRollObject.dice.skill) valuePathsArray.push(`skills.${activeRollObject.dice.skill}.value`)
  if (activeRollObject.dice.attribute) valuePathsArray.push(`attributes.${activeRollObject.dice.attribute}.value`)

  // Compile the list of tokens selected and use them as
  // the basis for default users being prompted for the roll
  const promptedRolls = {}
  const tokens = canvas.tokens.controlled
  const actorsList = tokens.map(i => i.actor)
  actorsList.forEach((actor) => {
    promptedRolls[actor.id] = {
      actor,
      rolled: false
    }
  })

  // Create the chat message
  foundry.documents.ChatMessage.implementation.create({
    title: `${activeRollObject.name}`,
    flavor: `<b>Test of:</b> ${activeRollObject.dice.skill} + ${activeRollObject.dice.attribute}`,
    flags: {
      vtm5e: {
        template: 'systems/vtm5e/display/ui/chat/chat-message-roll-prompt.hbs',
        valuePaths: valuePathsArray.join(' '),
        isRollPrompt: true,
        promptedRolls
      }
    }
  })
}
