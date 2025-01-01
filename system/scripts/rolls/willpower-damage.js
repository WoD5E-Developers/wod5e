/* global ChatMessage, renderTemplate, game */

export async function _damageWillpower (event, target, actor, willpowerDamage, rollMode) {
  if (event) event.preventDefault()

  // If no actor is provided, try and assume this is being done from an actor
  if (!actor) actor = this.actor

  // If no willpower damage is provided, try and assume we're getitng data from a dataset
  if (!willpowerDamage) willpowerDamage = target.getAttribute('data-willpower-damage')

  // If no rollMode is provided, use the user's default
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  // If we have a label, define it so we can append it to the title of the chatcard
  let prependTitle = ''
  if (target?.getAttribute('data-label')) prependTitle = `${target.getAttribute('data-label')} - `

  // Get the actor's willpower and define it for convenience
  const actorWillpower = actor.system.willpower
  const maxWillpower = actorWillpower.max
  let aggrWillpower = actorWillpower.aggravated
  let superWillpower = actorWillpower.superficial

  // Loop to handle willpower damage tick by tick
  for (let i = 0; i < willpowerDamage; i++) {
    if ((superWillpower + aggrWillpower) < maxWillpower) {
      // If the superficial willpower ticket isn't completely full, then add a point
      superWillpower++
    } else if (aggrWillpower < maxWillpower) {
      // If there aren't any superficial boxes left, add an aggravated one
      // Define the new number of aggravated willpower damage
      // and subtract one from superficial
      superWillpower--
      aggrWillpower++
    } else {
      // If the willpower boxes are fully ticked with aggravated damage
      // then tell the chat and don't increase any values.

      renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
        name: `${prependTitle}${game.i18n.localize('WOD5E.Chat.WillpowerFullTitle')}`,
        img: 'systems/vtm5ec/assets/icons/dice/vampire/bestial-failure.png',
        description: game.i18n.localize('WOD5E.Chat.WillpowerFull')
      }).then(html => {
        const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, rollMode)
        ChatMessage.create(message)
      })

      // End the function here
      return
    }

    // Update the actor sheet
    actor.update({
      'system.willpower': {
        superficial: superWillpower,
        aggravated: aggrWillpower
      }
    })
  }

  renderTemplate('systems/vtm5ec/display/ui/chat/chat-message.hbs', {
    name: `${prependTitle}${game.i18n.localize('WOD5E.Chat.WillpowerDamage')}`,
    img: 'systems/vtm5ec/assets/icons/dice/vampire/bestial-failure.png',
    description: `${game.i18n.format('WOD5E.Chat.HasReceivedWillpowerDamage', {
      actor: actor.name,
      willpowerDamage
    })}`
  }).then(html => {
    const message = ChatMessage.applyRollMode({ speaker: ChatMessage.getSpeaker({ actor }), content: html }, rollMode)
    ChatMessage.create(message)
  })
}
