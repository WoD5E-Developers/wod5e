import { CompendiumBrowserApplication } from '../compendium-bowser.js'

export const _onRenderCompendiumBrowser = async function (event) {
  event.preventDefault()

  new CompendiumBrowserApplication().render(true)
}
