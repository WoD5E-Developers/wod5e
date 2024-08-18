/* global Hooks */

// Update the pause image
export const PauseChanges = async () => {
  Hooks.on('renderPause', (app, html) => {
    const updatedPauseImage = `
        <img class="fa-spin pause-border" src="/systems/vtm5e/assets/ui/Pause_Border.webp">
        <img class="pause-overlay" src="/systems/vtm5e/assets/ui/Pause_Overlay.webp">
        <figcaption>Game Paused</figcaption>
    `

    html.html(updatedPauseImage)
  })
}
