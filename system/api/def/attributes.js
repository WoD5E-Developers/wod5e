/* global game, Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Attributes extends BaseDefinitionClass {
  static modsEnabled = true
  static defCategory = 'Attributes'

  // Run any necessary compilation on ready
  static onReady () {
    const customAttributes = game.settings.get('vtm5e', 'customAttributes')

    if (customAttributes) {
      Attributes.addCustom(customAttributes)
    }

    Attributes.initializeLabels()
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
