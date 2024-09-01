/* global Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Systems extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    Systems.setSortAlphabetically()
    Systems.initializeLabels()
  }

  static mortal = {
    label: 'WOD5E.Mortal'
  }

  static vampire = {
    label: 'WOD5E.VTM.Label'
  }

  static werewolf = {
    label: 'WOD5E.WTA.Label'
  }

  static hunter = {
    label: 'WOD5E.HTR.Label'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Systems.onReady)
