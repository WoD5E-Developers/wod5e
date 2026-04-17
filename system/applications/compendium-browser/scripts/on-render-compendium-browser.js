import { CompendiumBrowserApplication } from '../compendium-bowser.js'

export const _onRenderCompendiumBrowser = async function () {
  new CompendiumBrowserApplication().render(true)
}
