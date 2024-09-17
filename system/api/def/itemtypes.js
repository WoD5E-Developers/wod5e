/* global Hooks */

// Base definition class
import { BaseDefinitionClass } from './base-definition-class.js'
// All systems
import { FeatureItemSheet } from '../../item/feature-item-sheet.js'
import { CustomRollItemSheet } from '../../item/customroll-item-sheet.js'
// Vampire system
import { DisciplineItemSheet } from '../../item/vtm/discipline-item-sheet.js'
import { BoonItemSheet } from '../../item/vtm/boon-item-sheet.js'
// Hunter system
import { PerkItemSheet } from '../../item/htr/perk-item-sheet.js'
import { EdgePoolItemSheet } from '../../item/htr/edge-pool-item-sheet.js'
// Werewolf system
import { GiftItemSheet } from '../../item/wta/gift-item-sheet.js'

export class ItemTypes extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    ItemTypes.setSortAlphabetically()
    ItemTypes.initializeLabels()
  }

  static feature = {
    label: 'WOD5E.ItemsList.Feature',
    img: 'systems/vtm5e/assets/icons/items/feature.svg',
    types: ['feature'],
    sheetClass: FeatureItemSheet
  }

  static power = {
    label: 'WOD5E.VTM.Discipline',
    img: 'systems/vtm5e/assets/icons/items/discipline.png',
    types: ['power'],
    sheetClass: DisciplineItemSheet
  }

  static boon = {
    label: 'WOD5E.ItemsList.Boon',
    img: 'systems/vtm5e/assets/icons/items/boon.svg',
    types: ['boon'],
    sheetClass: BoonItemSheet
  }

  static customRoll = {
    label: 'WOD5E.ItemsList.CustomRoll',
    img: 'systems/vtm5e/assets/icons/items/custom-roll.png',
    types: ['customRoll'],
    sheetClass: CustomRollItemSheet
  }

  static perk = {
    label: 'WOD5E.HTR.Edge',
    img: 'systems/vtm5e/assets/icons/items/edge.png',
    types: ['perk'],
    sheetClass: PerkItemSheet
  }

  static edgepool = {
    label: 'WOD5E.HTR.EdgePool',
    img: 'systems/vtm5e/assets/icons/items/edgepool.png',
    types: ['edgepool'],
    sheetClass: EdgePoolItemSheet
  }

  static gift = {
    label: 'WOD5E.WTA.Gift',
    img: 'systems/vtm5e/assets/icons/items/gift.png',
    types: ['gift'],
    sheetClass: GiftItemSheet
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', ItemTypes.onReady)
