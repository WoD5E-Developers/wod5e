import { processMessage } from './message-logic/process-message.js'

export class WoDChatMessage extends ChatMessage {
  // Default avatar for the chat message
  static DEFAULT_AVATAR = 'icons/svg/mystery-man.svg'

  /**
   * Render the HTML for the ChatMessage which should be added to the log
   * @param {object} [options]             Additional options passed to the Handlebars template.
   * @param {boolean} [options.canDelete]  Render a delete button. By default, this is true for GM users.
   * @param {boolean} [options.canClose]   Render a close button for dismissing chat card notifications.
   * @returns {Promise<HTMLElement>}
   */
  async renderHTML({ canDelete, canClose = false, ...rest } = {}) {
    // Default message template
    this.template = CONFIG.ChatMessage.template

    // By default, GM users have the trash-bin icon in the chat log itself
    canDelete ??= game.user.isGM

    if (typeof this.system.renderHTML === 'function') {
      const html = await this.system.renderHTML({ canDelete, canClose, ...rest })
      Hooks.callAll('renderChatMessageHTML', this, html)
      return html
    }

    // Determine some metadata
    const speakerActor = this.speakerActor
    const data = this.toObject(false)
    data.content = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      this.content,
      {
        rollData: this.getRollData(),
        secrets: speakerActor?.isOwner ?? game.user.isGM
      }
    )
    const isWhisper = this.whisper.length

    // Construct message data
    this.messageData = {
      // Base messageData and permissions
      ...rest,
      message: data,
      canDelete,
      canClose,
      isGM: game.user.isGM,
      isWhisper: this.whisper.length,
      whisperTo: this.whisper.map((u) => game.users.get(u)?.name).filterJoin(', '),

      // User and author data
      user: game.user,
      author: this.author,

      // Display info
      title: this.title,
      alias: this.alias,
      speakerActor,
      portrait: (speakerActor?.img ?? this.author?.avatar) || this.constructor.DEFAULT_AVATAR,

      // CSS classes
      cssClass: [
        this.style === CONST.CHAT_MESSAGE_STYLES.IC ? 'ic' : null,
        this.style === CONST.CHAT_MESSAGE_STYLES.EMOTE ? 'emote' : null,
        isWhisper ? 'whisper' : null,
        this.blind ? 'blind' : null
      ].filterJoin(' '),

      // System-specific flags
      isRollPrompt: this.getFlag('vtm5e', 'isRollPrompt'),
      promptedRolls: this.getFlag('vtm5e', 'promptedRolls'),
      valuePaths: this.getFlag('vtm5e', 'valuePaths'),
      difficulty: this.getFlag('vtm5e', 'difficulty'),
      isRoll: this?.isRoll || false,
      isExtendedRoll: this.getFlag('vtm5e', 'isExtendedRoll')
    }

    // Render additional message data
    if (this.isRoll) {
      await this.#renderRollContent(this.messageData)
    }

    // Process the message with template-specific data
    await processMessage(this)

    // Define a border color
    if (this.style === CONST.CHAT_MESSAGE_STYLES.OOC)
      this.messageData.borderColor = this.author?.color.css

    // Add a check in for in case modules are adding content to use that as the description
    if (this.messageData?.message?.content) {
      this.messageData.description = this.messageData?.message?.content
    }

    // Render the chat message
    let html = await foundry.applications.handlebars.renderTemplate(this.template, this.messageData)
    html = foundry.utils.parseHTML(html)

    // Flag expanded state of dice rolls
    Hooks.callAll('renderChatMessageHTML', this, html, this.messageData)

    // Get whether descriptions should auto-collapse for this user or not and apply the styling
    const autoCollapse = game.settings.get('vtm5e', 'autoCollapseDescriptions')
    if (!autoCollapse) {
      const collapsibleContent = html.querySelector('.collapsible-content')
      if (collapsibleContent) collapsibleContent.style.maxHeight = 'unset'
    }

    return html
  }

  // Code pulled from core since this is a private method as of V13
  async #renderRollContent(messageData) {
    const data = messageData.message
    const renderRolls = async (isPrivate) => {
      let html = ''
      for (const r of this.rolls) {
        html += await r.render({
          isPrivate
        })
      }
      return html
    }

    // Suppress the "to:" whisper flavor for private rolls
    if (this.blind || this.whisper.length) messageData.isWhisper = false

    // Display standard Roll HTML content
    if (this.isContentVisible) {
      const el = document.createElement('div')
      el.innerHTML = data.content // Ensure the content does not already contain custom HTML
      if (!el.childElementCount && this.rolls.length)
        data.content = await this.#renderRollHTML(false)
    } else {
      // Otherwise, show "rolled privately" messages for Roll content
      const name = this.author?.name ?? game.i18n.localize('CHAT.UnknownUser')
      data.flavor = game.i18n.format('CHAT.PrivateRollContent', {
        user: foundry.utils.escapeHTML(name)
      })
      data.content = await renderRolls(true)
      messageData.alias = name
    }
  }

  async #renderRollHTML(isPrivate) {
    let html = ''

    for (const roll of this.rolls) {
      html += await roll.render({
        isPrivate,
        message: this
      })
    }

    return html
  }
}
