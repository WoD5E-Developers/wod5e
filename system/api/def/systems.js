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
    label: 'TYPES.Actor.vampire'
  }

  static werewolf = {
    label: 'TYPES.Actor.werewolf'
  }

  static hunter = {
    label: 'TYPES.Actor.hunter'
  }

  static changeling = {
    label: 'TYPES.Actor.changeling'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Systems.onReady)
