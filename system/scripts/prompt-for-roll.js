import { RollMenuApplication } from './menus/roll-prompt-menu.js'

export const _onPromptForRoll = async function name(event) {
  event.preventDefault()

  new RollMenuApplication().render(true)
}
