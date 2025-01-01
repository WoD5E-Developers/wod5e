/* global game, CONST, CONFIG, TextEditor, renderTemplate, ChatMessage, Hooks */

import { generateRollMessage } from '../scripts/rolls/roll-message.js'

export class WoDChatMessage extends ChatMessage {
  /**
   * Render the HTML for the ChatMessage which should be added to the log
   * @returns {Promise<jQuery>}
   */
  async getHTML () {
    // Determine some metadata
    const data = this.toObject(false)
    data.content = await TextEditor.enrichHTML(this.content, { rollData: this.getRollData() })
    const isWhisper = this.whisper.length

    // Construct message data
    const messageData = {
      message: data,
      user: game.user,
      author: this.author,
      alias: this.alias,
      cssClass: [
        this.style === CONST.CHAT_MESSAGE_STYLES.IC ? 'ic' : null,
        this.style === CONST.CHAT_MESSAGE_STYLES.EMOTE ? 'emote' : null,
        isWhisper ? 'whisper' : null,
        this.blind ? 'blind' : null
      ].filterJoin(' '),
      isWhisper: this.whisper.length,
      canDelete: game.user.isGM, // Only GM users are allowed to have the trash-bin icon in the chat log itself
      whisperTo: this.whisper.map(u => {
        const user = game.users.get(u)
        return user ? user.name : null
      }).filterJoin(', ')
    }

    // Render message data specifically for ROLL type messages
    if (this.isRoll) await this._renderRollContent(messageData)

    // Define a border color
    if (this.style === CONST.CHAT_MESSAGE_STYLES.OOC) messageData.borderColor = this.author?.color.css

    // Render the chat message
    let html = await renderTemplate(CONFIG.ChatMessage.template, messageData)

    html = $(html)

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

        // Check for Changeling dice
        if (term.constructor.name === 'ChangelingDie' || term.constructor.name === 'ChangelingNightmareDie') {
          this.flags.system = 'changeling'
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

        html.find('.message-content').html(messageContent)

        const autoCollapse = game.settings.get('vtm5ec', 'autoCollapseDescriptions')

        if (!autoCollapse) {
          const content = html.find('.collapsible-content')

          content.css('maxHeight', 'unset')
        }

        // Add collapsible toggle event listener
        html.find('.collapsible').click(async event => {
          event.preventDefault()

          const content = html.find('.collapsible-content')

          if (content.css('maxHeight') === '0px') {
            content.css('maxHeight', content.prop('scrollHeight') + 'px')
          } else {
            content.css('maxHeight', '0px')
          }
        })
      }
    }

    // Flag expanded state of dice rolls
    Hooks.call('renderChatMessage', this, html, messageData)
    return html
  }
}
