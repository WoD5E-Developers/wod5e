/* global Hooks, game */

// Update the pause image
export const PauseChanges = async () => {
  Hooks.on('renderPause', (app, html) => {
    const updatedPauseImage = `
        <img class="fa-spin pause-border" src="/systems/vtm5e/assets/ui/Pause_Border.webp">
        <img class="pause-overlay" src="/systems/vtm5e/assets/ui/Pause_Overlay.webp">
        <figcaption>${game.i18n.localize('WOD5E.GamePaused')}</figcaption>
    `

    html.html(updatedPauseImage)
  })
}
