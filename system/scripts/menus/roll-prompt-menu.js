/* global foundry */

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api

export class RollMenuApplication extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor () {
    super()

    this.data = {
      savedRolls: {}
    }
  }

  static DEFAULT_OPTIONS = {
    tag: 'form',
    form: {
      submitOnChange: true,
      handler: RollMenuApplication.applicationHandler
    },
    window: {
      icon: 'fa-solid fa-dice-d10',
      title: 'Roll Menu',
      resizable: true
    },
    classes: ['wod5e', 'dialog-app', 'sheet', 'application', 'roll-menu'],
    position: {
      width: 480,
      height: 400
    },
    actions: {
      toggleExtended: RollMenuApplication._onToggleExtended,
      toggleContested: RollMenuApplication._onToggleContested
    }
  }

  static PARTS = {
    savedRolls: {
      template: 'systems/vtm5e/display/ui/parts/roll-menu/saved-rolls.hbs'
    },
    body: {
      template: 'systems/vtm5e/display/ui/parts/roll-menu/main.hbs'
    }
  }

  async _prepareContext () {
    // Top-level variables
    const data = this.data

    data.test = 'test'

    return data
  }

  async _preparePartContext (partId, context, options) {
    context = await super._preparePartContext(partId, context, options)

    switch (partId) {
      // Saved Rolls
      case 'savedRolls':
        context.savedRolls = [
          {
            name: 'Saved roll 1'
          },
          {
            name: 'Super Long Rollllllll name'
          }
        ]
        break
      // Body
      case 'body':
        // Part-specific data
        context.description = 'Test'

        context.activeRoll = {
          name: 'Saved roll 1',
          dice: [
            {
              type: 'skill',
              value: 'Athletics'
            }
          ]
        }

        break
    }

    return context
  }

  static async applicationHandler (event, form, formData) {
    console.log(formData)

    // Re-render the application
    this.render()
  }

  static async _onToggleContested (event, target) {
    console.log(target)
  }
}
