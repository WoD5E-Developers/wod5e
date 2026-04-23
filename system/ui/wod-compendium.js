import { _onRenderCompendiumBrowser } from '../applications/compendium-browser/scripts/on-render-compendium-browser.js'

export class WoDCompendiumDirectory extends foundry.applications.sidebar.tabs.CompendiumDirectory {
  static DEFAULT_OPTIONS = {
    actions: {
      wod5eCompendiumBrowser: _onRenderCompendiumBrowser
    }
  }

  async _onRender(context, options) {
    await super._onRender(context, options)

    const html = this.element

    // Additional system information resources
    const headerActionsRow = html.querySelectorAll(
      '.compendium-sidebar .directory-header .header-actions'
    )
    const wod5eCompendiumBrowserButton = `<button type="button" class="wod5e-compendium-search" data-action="wod5eCompendiumBrowser">
        <i class="fa-solid fa-book-atlas" inert=""></i>
        <span>WOD5E Compendium Browser</span>
    </button>`

    headerActionsRow.forEach((row) => {
      row.insertAdjacentHTML('afterend', wod5eCompendiumBrowserButton)
    })
  }
}
