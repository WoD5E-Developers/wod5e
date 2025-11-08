/* global Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Features extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady() {
    Features.setSortAlphabetically()
    Features.initializeLabels()
  }

  static background = {
    label: 'WOD5E.ItemsList.Background'
  }

  static merit = {
    label: 'WOD5E.ItemsList.Merit'
  }

  static flaw = {
    label: 'WOD5E.ItemsList.Flaw'
  }

  static boon = {
    label: 'WOD5E.ItemsList.Boon'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Features.onReady)
