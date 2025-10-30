/* global game */

export const _onRemoveUser = async function (event, target) {
  event.preventDefault()

  // Grab the user and the chat message we're working with
  const actorID = target.closest('.user-roll').getAttribute('data-actor-id')
  const messageID = target.closest('.chat-message').getAttribute('data-message-id')
  const chatMessage = game.messages.get(messageID)

  // Remove the user from the promptedRolls flag
  if (chatMessage.isOwner) {
    chatMessage.update({ [`flags.vtm5e.promptedRolls.-=${actorID}`]: null })
  } else {
    const socketData = {
      action: 'removeActor',
      actorID,
      messageID
    }

    game.socket.emit('system.vtm5e', socketData)
  }
}
