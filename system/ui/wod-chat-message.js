/* global game, CONST, CONFIG, foundry, ChatMessage, Hooks */

import { generateRollMessage } from '../scripts/rolls/roll-message.js'

export class WoDChatMessage extends ChatMessage {
  /**
   * Render the HTML for the ChatMessage which should be added to the log
   * @param {object} [options]             Additional options passed to the Handlebars template.
   * @param {boolean} [options.canDelete]  Render a delete button. By default, this is true for GM users.
   * @param {boolean} [options.canClose]   Render a close button for dismissing chat card notifications.
   * @returns {Promise<HTMLElement>}
   */
  async renderHTML({ canDelete, canClose=false, ...rest }={}) {
    canDelete ??= game.user.isGM // By default, GM users have the trash-bin icon in the chat log itself

    if (typeof this.system.renderHTML === 'function') {
      const html = await this.system.renderHTML({ canDelete, canClose, ...rest })
      Hooks.callAll('renderChatMessageHTML', this, html)
      return html
    }

    // Determine some metadata
    const speakerActor = this.speakerActor
    const data = this.toObject(false)
    data.content = await foundry.applications.ux.TextEditor.implementation.enrichHTML(this.content, {
      rollData: this.getRollData(),
      secrets: speakerActor?.isOwner ?? game.user.isGM
    })
    const isWhisper = this.whisper.length

    // Construct message data
    const messageData = {
      ...rest,
      canDelete,
      canClose,
      message: data,
      user: game.user,
      author: this.author,
      speakerActor,
      alias: this.alias,
      cssClass: [
        this.style === CONST.CHAT_MESSAGE_STYLES.IC ? 'ic' : null,
        this.style === CONST.CHAT_MESSAGE_STYLES.EMOTE ? 'emote' : null,
        isWhisper ? 'whisper' : null,
        this.blind ? 'blind': null
      ].filterJoin(' '),
      isWhisper: this.whisper.length,
      whisperTo: this.whisper.map(u => game.users.get(u)?.name).filterJoin(', ')
    }

    // Render message data specifically for ROLL type messages
    if (this.isRoll) await this.#renderRollContent(messageData)

    // Define a border color
    if (this.style === CONST.CHAT_MESSAGE_STYLES.OOC) messageData.borderColor = this.author?.color.css

    // Render the chat message
    let html = await foundry.applications.handlebars.renderTemplate(CONFIG.ChatMessage.template, messageData)
    html = foundry.utils.parseHTML(html)

    if (this.isRoll) {
      // Append a system value if roll classes are detected
      const rollTerms = this.rolls[0].terms

      rollTerms.forEach(term => {
        // Check for Mortal dice
        if (term.constructor.name === 'MortalDie') {
          this.flags.system = 'mortal'
        }

        // Check for Vampire dice
        if (term.constructor.name === 'VampireDie' || term.constructor.name === 'VampireHungerDie') {
          this.flags.system = 'vampire'
        }

        // Check for Hunter dice
        if (term.constructor.name === 'HunterDie' || term.constructor.name === 'HunterDesperationDie') {
          this.flags.system = 'hunter'
        }

        // Check for Werewolf dice
        if (term.constructor.name === 'WerewolfDie' || term.constructor.name === 'WerewolfRageDie') {
          this.flags.system = 'werewolf'
        }
      })

      if (this.flags.system) {
        const messageContent = await generateRollMessage({
          title: this.flags.title || `${game.i18n.localize('WOD5E.Chat.Rolling')}...`,
          roll: this.rolls[0],
          system: this.flags.system || 'mortal',
          flavor: this.flags.flavor || '',
          difficulty: this.flags.difficulty || 0,
          activeModifiers: this.flags.activeModifiers || {},
          data: this.flags.data || {},
          isContentVisible: this.isContentVisible
        })

        // Create an HTML element with the provided message content
        const messageHTML = document.createElement('div')
        messageHTML.innerHTML = messageContent
      }
    }

    // Flag expanded state of dice rolls
    Hooks.callAll('renderChatMessageHTML', this, html, messageData)

    // Get whether descriptions should auto-collapse for this user or not and apply the styling
    const autoCollapse = game.settings.get('vtm5e', 'autoCollapseDescriptions')
    if (!autoCollapse) {
      const collapsibleContent = html.querySelector('.collapsible-content')
      if (collapsibleContent) collapsibleContent.style.maxHeight = 'unset'
    }

    return html
  }

  // Code pulled from core since this is a private method as of V13
  async #renderRollContent (messageData) {
    const data = messageData.message
    const renderRolls = async isPrivate => {
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
      if (!el.childElementCount && this.rolls.length) data.content = await this.#renderRollHTML(false)
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

  async #renderRollHTML (isPrivate) {
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
