import { _onPromptInChat } from '../../applications/roll-menu/scripts/on-prompt-in-chat.js'
import { _onRollFromMenu } from '../../applications/roll-menu/scripts/on-roll-from-menu.js'

// Roll prompt functionality
export const rollPrompt = {
  id: 'rollPrompt',
  pattern: /@RollPrompt\[([^\]]+)]{([^}]+)}/gi,
  enricher: rollPromptEnricher,
  onRender
}

async function rollPromptEnricher(match) {
  const [, id, label] = match

  const a = document.createElement('a')

  // Visuals
  a.classList.add('content-link')
  a.innerHTML = `<i class="fa-solid fa-dice-d10" insert></i> ${label}`

  // Data & Functionality
  a.classList.add('roll-prompt')
  a.dataset.action = 'rollFromMenu'
  a.dataset.id = id

  return a
}

// Posting roll prompts to chat
export const rollPromptToChat = {
  id: 'rollPromptToChat',
  pattern: /@RollPromptToChat\[([^\]]+)]{([^}]+)}/gi,
  enricher: rollPromptToChatEnricher,
  onRender
}

async function rollPromptToChatEnricher(match) {
  const [, id, label] = match

  const a = document.createElement('a')

  // Visuals
  a.classList.add('content-link')
  a.innerHTML = `<i class="fas fa-comment-alt" insert></i> ${label}`

  // Data & Functionality
  a.classList.add('content-link')
  a.dataset.action = 'promptInChat'
  a.dataset.id = id

  return a
}

// Shared functions for adding the new enrichers
// Inspired by DrawSteel's implementation: https://github.com/MetaMorphic-Digital/draw-steel
export function onRender(element) {
  const links = element.querySelectorAll('a[data-action]')

  for (const link of links) {
    link.addEventListener('click', onClickAnchor)
  }
}

async function onClickAnchor(event) {
  event.preventDefault()

  const action = this.dataset.action

  switch (action) {
    case 'rollFromMenu':
      return _onRollFromMenu(event)

    case 'promptInChat':
      return _onPromptInChat(event)
  }
}
