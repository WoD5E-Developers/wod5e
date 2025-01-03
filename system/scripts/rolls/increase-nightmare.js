/* global ChatMessage, renderTemplate, game */

export async function _increaseNightmare (actor, amount, rollMode) {
    // Automatically add nightmare to the actor on a failure (for rouse checks)
    const currentNightmare = actor.system.nightmare.value
    const newNightmareAmount = Math.min(currentNightmare + amount, 5)

    // If no rollMode is provided, use the user's default
    if (!rollMode) rollMode = game.settings.get('core', 'rollMode')
  
    // If the actor is already at max nightmare, send a message in the chat to warn them
    // that their nightmare cannot be increased further
    if (amount > 0 && currentNightmare === 5) {
      renderTemplate('systems/vtm5ec/templates/chat/chat-message.hbs', {
        name: game.i18n.localize('WOD5E.CTD.NightmareFull1'),
        img: 'systems/vtm5ec/assets/icons/dice/changeling/panic-failure.png',
        description: game.i18n.localize('WOD5E.CTD.NightmareFull2')
      }).then(html => {
        ChatMessage.create({
          speaker: ChatMessage.getSpeaker({ actor }),
          content: html
        }, rollMode)
      })
    }
  
    // Update the actor with the new amount of rage
    actor.update({ 'system.nightmare.value': newNightmareAmount })
  }