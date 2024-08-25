/* global game, renderTemplate, ChatMessage */

/** Post Discipline description to the chat */
export const _onDisciplineToChat = async function (event) {
  event.preventDefault()

  // Top-level variables
  const actor = this.actor
  const element = event.currentTarget
  const dataset = Object.assign({}, element.dataset)
  const discipline = actor.system.disciplines[dataset.discipline]

  await renderTemplate('systems/vtm5e/display/ui/chat/chat-message.hbs', {
    name: game.i18n.localize(discipline.label),
    img: 'icons/svg/dice-target.svg',
    description: discipline.description
  }).then(html => {
    ChatMessage.create({
      content: html
    })
  })
}
