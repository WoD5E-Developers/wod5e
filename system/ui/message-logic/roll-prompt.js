import { generateRollMessageData } from '../../scripts/rolls/roll-message.js'

export async function processRollPrompt(context) {
  context.template = 'systems/vtm5e/display/ui/chat/chat-message-roll-prompt.hbs'

  const isOwnerFilter = game.actors.filter((a) => a.isOwner)
  const isVisibleFilter = game.actors.filter((a) => a.visible)

  for (const [key, value] of Object.entries(context.messageData.promptedRolls)) {
    let rollData
    if (value.rolled) {
      const roll = value.roll
      rollData = await generateRollMessageData({
        title: roll.options.title,
        roll,
        system: roll.options.system,
        difficulty: roll.options.difficulty || 0,
        activeModifiers: roll.options.activeModifiers || {},
        isContentVisible: context.isContentVisible
      })
    }

    context.messageData.promptedRolls[key] = {
      ...context.messageData.promptedRolls[key],
      canRoll: isOwnerFilter.some((a) => a.id === key),
      canRemove: isOwnerFilter.some((a) => a.id === key),
      isVisible: isVisibleFilter.some((a) => a.id === key),
      rollData
    }
  }
}
