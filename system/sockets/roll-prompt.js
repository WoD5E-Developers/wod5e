/* global foundry, game */

export async function RollPromptSockets () {
  game.socket.on('system.vtm5e', async data => {
    const chatMessage = game.messages.get(data.messageId)

    if (data.action === 'updateRollPrompt' && chatMessage.isOwner) updateRollPrompt(data)
  })
}

export async function updateRollPrompt (data) {
  const chatMessage = game.messages.get(data.messageId)
  if (!chatMessage?.isOwner) return

  const promptedRollsList = chatMessage.getFlag('vtm5e', 'promptedRolls')
  const actorObject = promptedRollsList[data.actorId]
  if (!actorObject) return

  const updatedList = foundry.utils.mergeObject(promptedRollsList, {
    [data.actorId]: {
      rolled: true,
      roll: foundry.dice.Roll.fromData(data.roll)
    }
  })

  await chatMessage.setFlag('vtm5e', 'promptedRolls', updatedList)
}
