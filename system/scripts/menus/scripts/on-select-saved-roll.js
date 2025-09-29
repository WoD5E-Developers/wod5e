/* global game, ui */

export const _onSelectSavedRoll = async function (event, target) {
  const newActiveRoll = target.getAttribute('data-id')

  await game.users.current.setFlag('vtm5e', 'rollMenuActiveRoll', newActiveRoll)

  // Re-render the application window once settings are updated
  const RollMenuApplication = Object.values(ui.windows).filter(w => (w.id === 'wod5e-roll-menu'))[0]
  if (RollMenuApplication) {
    RollMenuApplication.render()
  }
}
