/* global game, renderTemplate, ChatMessage */

/** Post Gift description to the chat */
export const _onGiftToChat = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const gift = actor.system.gifts[dataset.gift]

  await renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
    name: game.i18n.localize(gift.name),
    img: 'icons/svg/dice-target.svg',
    description: gift.description
  }).then(html => {
    ChatMessage.create({
      content: html
    })
  })
}
