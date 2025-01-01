/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Attributes extends BaseDefinitionClass {
  static modsEnabled = true
  static type = 'attributes'
  static defCategory = 'Attributes'

  // Run any necessary compilation on ready
  static onReady () {
    // Handle adding custom disciplines from the game settings
    let customAttributes = game.settings.get('vtm5ec', 'customAttributes') || {}

    // Handle adding custom disciplines from any active modules
    const activeModules = game.modules.filter(module => module.active === true && module.flags.wod5e)
    activeModules.forEach((module) => {
      if (module.flags.wod5e.customAttributes) {
        customAttributes = customAttributes.concat(module.flags.wod5e.customAttributes)
      }
    })

    if (customAttributes) {
      Attributes.addCustom(customAttributes)
    }

    Attributes.setSortAlphabetically()
    Attributes.initializeLabels()
    Attributes.initializePaths()
  }

  static initializePaths () {
    // Cycle through each entry in the definition file to initialize the paths on each
    // Quickly filter out any non-object, non-null, non-array values
    const definitionEntries = Object.entries(this).filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
    for (const [key, value] of definitionEntries) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Set the path
        value.path = `system.attributes.${key}.value`
      }
    }
  }

  static strength = {
    label: 'WOD5E.AttributesList.Strength',
    type: 'physical'
  }

  static charisma = {
    label: 'WOD5E.AttributesList.Charisma',
    type: 'social'
  }

  static intelligence = {
    label: 'WOD5E.AttributesList.Intelligence',
    type: 'mental'
  }

  static dexterity = {
    label: 'WOD5E.AttributesList.Dexterity',
    type: 'physical'
  }

  static manipulation = {
    label: 'WOD5E.AttributesList.Manipulation',
    type: 'social'
  }

  static wits = {
    label: 'WOD5E.AttributesList.Wits',
    type: 'mental'
  }

  static stamina = {
    label: 'WOD5E.AttributesList.Stamina',
    type: 'physical'
  }

  static composure = {
    label: 'WOD5E.AttributesList.Composure',
    type: 'social'
  }

  static resolve = {
    label: 'WOD5E.AttributesList.Resolve',
    type: 'mental'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Attributes.onReady)
