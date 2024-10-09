/* global Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Renown extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    Renown.setSortAlphabetically()
    Renown.initializeLabels()
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
