import { processExtendedRoll } from './extended-roll.js'
import { processRoll } from './roll.js'
import { processRollPrompt } from './roll-prompt.js'

export async function processMessage(context) {
  const { isRoll, isExtendedRoll, isRollPrompt } = context.messageData

  const isSystemRoll = context.rolls[0].systemRoll

  // Roll-adjacent message
  if (isRoll && isSystemRoll) {
    if (isExtendedRoll) {
      await processExtendedRoll(context)
    } else {
      await processRoll(context)
    }
  }

  // Roll prompts are handled differently from real 'roll' messages
  if (isRollPrompt) {
    await processRollPrompt(context)
  }
}
