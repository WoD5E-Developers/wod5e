import { _onRenderCompendiumBrowser } from '../applications/compendium-browser/scripts/on-render-compendium-browser.js'

/**
 * Define all additional keybindings here
 */
export const loadControls = async function () {
  // Keybinding for opening the compendium browser
  game.keybindings.register('wod5e', 'compendium-browser-open', {
    name: 'WOD5E.CompendiumBrowser.Label',
    hint: 'WOD5E.CompendiumBrowser.ControlHint',
    editable: [
      {
        key: 'KeyB'
      }
    ],
    onDown: () => _onRenderCompendiumBrowser()
  })
}
