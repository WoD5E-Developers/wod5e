/* global Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Renown extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    Renown.setSortAlphabetically()
    Renown.initializeLabels()
    Renown.initializePaths()
  }

  static initializePaths () {
    // Cycle through each entry in the definition file to initialize the paths on each
    // Quickly filter out any non-object, non-null, non-array values
    const definitionEntries = Object.entries(this).filter(([, value]) => typeof value === 'object' && value !== null && !Array.isArray(value))
    for (const [key, value] of definitionEntries) {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // Set the path
        value.path = `system.renown.${key}.value`
      }
    }
  }

  static glory = {
    label: 'WOD5E.WTA.Glory'
  }

  static honor = {
    label: 'WOD5E.WTA.Honor'
  }

  static wisdom = {
    label: 'WOD5E.WTA.Wisdom'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Renown.onReady)
