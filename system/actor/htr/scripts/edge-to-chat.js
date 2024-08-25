/* global game, renderTemplate, ChatMessage */

/** Post an Edge description to the chat */
export const _onEdgeToChat = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const edge = actor.system.edges[dataset.edge]

  await renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
    name: game.i18n.localize(edge.name),
    img: 'icons/svg/dice-target.svg',
    description: edge.description
  }).then(html => {
    ChatMessage.create({
      content: html
    })
  })
}
