/* global game, FormApplication, foundry */

export class AutomationMenu extends FormApplication {
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize('WOD5E.Settings.AutomationSettings'),
      id: 'wod5e-automation',
      classes: ['wod5e'],
      template: 'systems/vtm5ec/display/ui/automation-menu.hbs',
      width: 500,
      height: 'auto',
      resizable: true,
      closeOnSubmit: false
    })
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    const data = await super.getData()

    // Encrich editor content
    data.disableAutomation = game.settings.get('vtm5ec', 'disableAutomation')
    data.automatedWillpower = game.settings.get('vtm5ec', 'automatedWillpower')
    data.automatedHunger = game.settings.get('vtm5ec', 'automatedHunger')
    data.automatedOblivion = game.settings.get('vtm5ec', 'automatedOblivion')
    data.automatedRage = game.settings.get('vtm5ec', 'automatedRage')

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    html.find('input').on('change', function (event) {
      event.preventDefault()
      const data = event.target.dataset

      if (data?.id) {
        const settingId = data.id
        const value = event.target.checked

        game.settings.set('vtm5ec', settingId, value)
      }
    })
  }
}
