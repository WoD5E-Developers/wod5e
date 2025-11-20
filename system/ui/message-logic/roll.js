import { generateRollMessageData } from '../../scripts/rolls/roll-message.js'

export async function processRoll(context) {
  context.template = 'systems/wod5e/display/ui/chat/chat-message-roll.hbs'

  const roll = context.rolls[0]

  if (roll?.system) {
    const rollMessageData = await generateRollMessageData({
      title: roll.options.title || `${game.i18n.localize('WOD5E.Chat.Rolling')}...`,
      roll,
      system: roll.system,
      flavor: roll.options.flavor || '',
      difficulty: roll.options.difficulty || 0,
      activeModifiers: roll.options.activeModifiers || {},
      data: context.flags.data || {},
      isContentVisible: context.isContentVisible
    })

    Object.assign(context.messageData, rollMessageData)
  }
}
