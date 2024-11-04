/* global game, FormApplication, foundry, JSColor */

import { _updateCSSVariable, cssVariablesRecord } from '../update-css-variables.js'

export class SplatColorsMenu extends FormApplication {
  static get defaultOptions () {
    return foundry.utils.mergeObject(super.defaultOptions, {
      title: game.i18n.localize('WOD5E.Settings.SplatColorsMenu'),
      id: 'wod5e-splat-colors',
      classes: ['wod5e'],
      template: 'systems/vtm5e/display/ui/splat-colors-menu.hbs',
      width: 500,
      height: 450,
      resizable: true,
      closeOnSubmit: true
    })
  }

  /* -------------------------------------------- */

  /** @override */
  async getData () {
    const data = await super.getData()

    const cssVariables = cssVariablesRecord()

    data.cssVariablesRecord = cssVariables

    // Go through the available themes
    Object.keys(cssVariables).forEach(theme => {
      const settings = cssVariables[theme].settings

      // Iterate over each setting in the theme
      Object.keys(settings).forEach(settingKey => {
        const { settingId } = settings[settingKey]

        // Get the setting and assign it, making it available within the menu
        data[settingId] = game.settings.get('vtm5e', settingId)
      })
    })

    return data
  }

  /* -------------------------------------------- */

  /** @override */
  activateListeners (html) {
    // Initialize the JSColor library
    JSColor.install()

    // On input change, update colours
    html.find('.color-input').on('change', function (event) {
      event.preventDefault()

      const setting = event.target.dataset.settingId
      const cssVariable = event.target.dataset.cssVariable
      const value = event.target.value

      _updateCSSVariable(setting, cssVariable, value)
    })

    html.find('.reset-color').click(async event => {
      event.preventDefault()

      const inputId = event.currentTarget.dataset.inputId
      const settingId = event.currentTarget.dataset.settingId
      const cssVariable = event.currentTarget.dataset.cssVariable

      if (inputId && settingId) {
        const inputElement = html.find(`#${inputId}`)
        const defaultColor = game.settings.settings.get(`vtm5e.${settingId}`).default

        inputElement[0].jscolor.fromString(defaultColor)
        _updateCSSVariable(settingId, cssVariable, defaultColor)
      }
    })
  }
}
