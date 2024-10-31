/* global ChatMessage, game */

export async function _applyOblivionStains (actor, amount, rollMode) {
  // Apply a stain for each failed rouse check
  const currentHumanity = actor.system.humanity
  const newStains = Math.min((currentHumanity.stains + amount), 10 - currentHumanity.value)

  // If no rollMode is provided, use the user's default
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  if (newStains > 0) {
    const chatMessage = `<p class="roll-label uppercase">${game.i18n.localize('WOD5E.VTM.OblivionStainsTitle')}</p>
    <p class="roll-content">${game.i18n.format('WOD5E.VTM.OblivionStainsContent', {
      actor: actor.name,
      amount
    })}</p>`

    // Post the message to the chat
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: chatMessage }, rollMode)
    ChatMessage.create(message)

    // Update the actor with the new amount of stains
    actor.update({ 'system.humanity.stains': newStains })
  }
}
