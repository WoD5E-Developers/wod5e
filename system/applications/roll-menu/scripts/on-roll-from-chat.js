/* global game, WOD5E, ChatMessage, ui */

export const _onRollFromChat = async function (event, target) {
  event.preventDefault()

  // Ensure we have a valid actor to roll on
  const actor = game.actors.get(
    target.getAttribute('data-actor-id') || ChatMessage.getSpeaker().actor
  )
  if (!actor) ui.notifications.warn(game.i18n.localize('WOD5E.Notifications.NoTokenSelected'))

  const dataset = $(target).data()

  // Pipe the roll to our RollFromDataset function
  WOD5E.api.RollFromDataset({
    dataset,
    actor
  })
}
