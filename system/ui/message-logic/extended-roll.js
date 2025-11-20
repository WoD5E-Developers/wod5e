import { generateRollMessageData } from '../../scripts/rolls/roll-message.js'

export async function processExtendedRoll(context) {
  context.template = 'systems/wod5e/display/ui/chat/chat-message-extended-roll.hbs'

  for (const [key, value] of Object.entries(context.messageData.rolls)) {
    let rollData
    if (value.rolled) {
      const roll = value
      rollData = await generateRollMessageData({
        title: roll.options.title,
        roll,
        system: roll.options.system,
        difficulty: roll.options.difficulty || 0,
        activeModifiers: roll.options.activeModifiers || {},
        isContentVisible: context.isContentVisible
      })
    }

    context.messageData.rolls[key] = { ...context.messageData.rolls[key], rollData }
  }
}
