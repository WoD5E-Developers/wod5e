/* global foundry */

// Various button functions
import { _onToggleCollapse } from '../actor/scripts/on-toggle-collapse.js'

export class WoDChatLog extends foundry.applications.sidebar.tabs.ChatLog {

  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    actions: {
      toggleCollapse: _onToggleCollapse
    }
  }
}