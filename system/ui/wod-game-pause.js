export class WoDPause extends foundry.applications.ui.GamePause {
  async _onRender(context, options) {
    await super._onRender(context, options)

    const html = this.element

    const updatedPauseImage = `
        <img class="fa-spin pause-border" src="systems/wod5e/assets/ui/Pause_Border.webp">
        <img class="pause-overlay" src="systems/wod5e/assets/ui/Pause_Overlay.webp">
        <figcaption>${game.i18n.localize('WOD5E.GamePaused')}</figcaption>
    `

    html.innerHTML = updatedPauseImage
  }
}
