/* global Hooks */

import { BaseDefinitionClass } from './base-definition-class.js'

export class ItemTypes extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    ItemTypes.initializeLabels()
  }

  static feature = {
    label: 'WOD5E.ItemsList.Feature',
    img: 'systems/vtm5e/assets/icons/items/feature.svg'
  }

  static power = {
    label: 'WOD5E.VTM.Discipline',
    img: 'systems/vtm5e/assets/icons/items/discipline.png'
  }

  static boon = {
    label: 'WOD5E.ItemsList.Boon',
    img: 'systems/vtm5e/assets/icons/items/boon.svg'
  }

  static customRoll = {
    label: 'WOD5E.ItemsList.CustomRoll',
    img: 'systems/vtm5e/assets/icons/items/custom-roll.png'
  }

  static perk = {
    label: 'WOD5E.HTR.Edge',
    img: 'systems/vtm5e/assets/icons/items/edge.png'
  }

  static edgepool = {
    label: 'WOD5E.HTR.EdgePool',
    img: 'systems/vtm5e/assets/icons/items/edgepool.png'
  }

  static gift = {
    label: 'WOD5E.WTA.Gift',
    img: 'systems/vtm5e/assets/icons/items/gift.png'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', ItemTypes.onReady)
