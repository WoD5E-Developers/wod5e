/* global foundry, game */

// Various button functions
import { _onToggleCollapse } from '../actor/scripts/on-toggle-collapse.js'
import { _onAddSelectedTokens } from '../applications/roll-menu/scripts/on-add-selected-tokens.js'
import { _onRemoveUser } from '../applications/roll-menu/scripts/on-remove-user.js'
import { _onRollFromChat } from '../applications/roll-menu/scripts/on-roll-from-chat.js'
import { _onRenderRollMenu } from '../scripts/prompt-for-roll.js'
import { timeSinceShort } from '../scripts/time-since-short.js'

export class WoDChatLog extends foundry.applications.sidebar.tabs.ChatLog {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {
      toggleCollapse: _onToggleCollapse,
      renderRollMenu: _onRenderRollMenu,
      addSelectedTokens: _onAddSelectedTokens,
      removeActor: _onRemoveUser,
      rollFromChat: _onRollFromChat
    }
  }

  updateTimestamps() {
    for (const li of document.querySelectorAll('.chat-message[data-message-id]')) {
      const message = game.messages.get(li.dataset.messageId)
      if (!message?.timestamp) return

      const stamp = li.querySelector('.message-timestamp')
      if (stamp) stamp.textContent = timeSinceShort(message.timestamp)
    }
  }

  async _onRender(context, options) {
    await super._onRender(context, options)

    const html = this.element

    const chatControls = html.querySelector('#chat-controls')

    // If we don't find the chat controls element, do nothing
    if (!chatControls) return

    // Don't add anything if wod5e-chat-buttons already exists
    if (html.querySelector('.wod5e-chat-buttons')) return

    // Add the system's custom chat buttons
    const wod5eChatButtons = document.createElement('div')
    wod5eChatButtons.innerHTML = `
      <div class="wod5e-chat-buttons flexrow">
        <button type="button" class="ui-control icon fa-solid fa-dice-d10" data-action="renderRollMenu"
          data-tooltip aria-label="Open Roll Menu">
        </button>
      </div>
    `

    chatControls.prepend(wod5eChatButtons)
  }
}
