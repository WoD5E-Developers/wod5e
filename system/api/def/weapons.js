/* global Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class Weapons extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    Weapons.setSortAlphabetically()
    Weapons.initializeLabels()
  }

  static ranged = {
    label: 'WOD5E.EquipmentList.Ranged'
  }

  static melee = {
    label: 'WOD5E.EquipmentList.Melee'
  }

  static supernatural = {
    label: 'WOD5E.EquipmentList.Supernatural'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', Weapons.onReady)
