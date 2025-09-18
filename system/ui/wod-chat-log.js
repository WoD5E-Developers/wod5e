/* global foundry, game */

// Various button functions
import { _onToggleCollapse } from '../actor/scripts/on-toggle-collapse.js'
import { timeSinceShort } from '../scripts/time-since-short.js'

export class WoDChatLog extends foundry.applications.sidebar.tabs.ChatLog {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {
      toggleCollapse: _onToggleCollapse
    }
  }

  updateTimestamps () {
    for (const li of document.querySelectorAll('.chat-message[data-message-id]')) {
      const message = game.messages.get(li.dataset.messageId)
      if (!message?.timestamp) return

      const stamp = li.querySelector('.message-timestamp')
      if (stamp) stamp.textContent = timeSinceShort(message.timestamp)
    }
  }
}
