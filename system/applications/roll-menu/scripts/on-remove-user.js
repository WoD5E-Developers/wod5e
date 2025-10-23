/* global game */

export const _onRemoveUser = async function (event, target) {
  event.preventDefault()

  // Grab the user and the chat message we're working with
  const userID = target.closest('.user-roll').getAttribute('data-user-id')
  const messageID = target.closest('.chat-message').getAttribute('data-message-id')
  const chatMessage = game.messages.get(messageID)

  // Remove the user from the promptedRolls flag
  chatMessage.update({ [`flags.vtm5e.promptedRolls.-=${userID}`]: null })
}
