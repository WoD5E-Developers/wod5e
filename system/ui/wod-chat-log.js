// Various button functions
import { _onToggleCollapse } from '../actor/scripts/on-toggle-collapse.js'
import { _onAddSelectedTokens } from '../applications/roll-menu/scripts/on-add-selected-tokens.js'
import { _onRemoveUser } from '../applications/roll-menu/scripts/on-remove-user.js'
import { _onRollFromChat } from '../applications/roll-menu/scripts/on-roll-from-chat.js'
import { _onAnyReroll } from '../scripts/any-reroll.js'
import { _onRenderRollMenu } from '../scripts/prompt-for-roll.js'
import { timeSinceShort } from '../scripts/time-since-short.js'
import { _onWillpowerReroll } from '../scripts/willpower-reroll.js'

export class WoDChatLog extends foundry.applications.sidebar.tabs.ChatLog {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {
      toggleCollapse: _onToggleCollapse,
      renderRollMenu: _onRenderRollMenu,
      addSelectedTokens: _onAddSelectedTokens,
      removeActor: _onRemoveUser,
      rollFromChat: _onRollFromChat,
      willpowerReroll: _onWillpowerReroll,
      anyReroll: _onAnyReroll
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

  /**
   * Add additional context options for chat messages
   */
  _getEntryContextOptions() {
    const contextOptions = super._getEntryContextOptions()

    // Reroll options
    contextOptions.push(
      {
        name: game.i18n.localize('WOD5E.Chat.WillpowerReroll'),
        icon: '<i class="fas fa-redo"></i>',
        condition: (li) => {
          // Only show this context menu if the person is GM or author of the message
          const message = game.messages.get(li.getAttribute('data-message-id'))

          // Only show this context menu if there are re-rollable dice in the message
          const rerollableDice = li.querySelectorAll('.rerollable').length

          // Only show this context menu if there's not any already rerolled dice in the message
          const rerolledDice = li.querySelectorAll('.rerolled').length

          // All must be true to show the reroll dialog
          return (
            // Is the GM or is the message author
            (game.user.isGM || message.isAuthor) &&
            // Has rerollable dice
            rerollableDice > 0 &&
            // Has no rerolled dice
            rerolledDice === 0 &&
            // Is NOT a roll prompt
            !message.flags?.wod5e?.isRollPrompt
          )
        },
        callback: (li) => _onWillpowerReroll(li)
      },
      {
        name: game.i18n.localize('WOD5E.Chat.Reroll'),
        icon: '<i class="fas fa-redo"></i>',
        condition: (li) => {
          // Only show this context menu if the person is GM or author of the message
          const message = game.messages.get(li.getAttribute('data-message-id'))

          // Only show this context menu if there are dice in the message
          const dice = li.querySelectorAll('.die').length

          // Only show this context menu if there's not any already rerolled dice in the message
          const rerolledDice = li.querySelectorAll('.rerolled').length

          // All must be true to show the reroll dialog
          return (
            // Is the GM or is the message author
            (game.user.isGM || message.isAuthor) &&
            // Has dice
            dice > 0 &&
            // Has no rerolled dice
            rerolledDice === 0 &&
            // Is NOT a roll prompt
            !message.flags?.wod5e?.isRollPrompt
          )
        },
        callback: (li) => _onAnyReroll(li)
      }
    )

    return contextOptions
  }
}

Hooks.on('renderChatInput', (context) => {
  const html = context.element

  const chatControls = html.querySelectorAll('#chat-controls')

  // If we don't find the chat controls element, do nothing
  if (!chatControls) return

  // Don't add anything if wod5e-chat-buttons already exists
  if (html.querySelector('.wod5e-chat-buttons')) return

  // Add the system's custom chat buttons
  const wod5eChatButtons = document.createElement('div')
  wod5eChatButtons.innerHTML = `
    <div class="wod5e-chat-buttons flexrow">
      <button type="button" class="ui-control icon fa-solid fa-dice-d10" data-action="renderRollMenu"
        data-tooltip aria-label="${game.i18n.localize('WOD5E.RollList.OpenRollMenu')}">
      </button>
    </div>
  `

  chatControls.forEach((element) => {
    element.prepend(wod5eChatButtons)
  })
})
