import { RollMenuApplication } from './menus/roll-prompt-menu.js'

export const _onRenderRollMenu = async function (event) {
  event.preventDefault()

  new RollMenuApplication().render(true)
}
