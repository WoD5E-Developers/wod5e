/* global Hooks */

// Base definition class
import { BaseDefinitionClass } from './base-definition-class.js'
// All systems
import { FeatureItemSheet } from '../../item/core/feature-item-sheet.js'
import { CustomRollItemSheet } from '../../item/core/customroll-item-sheet.js'
import { ConditionItemSheet } from '../../item/core/condition-item-sheet.js'
import { TraitItemSheet } from '../../item/core/trait-item-sheet.js'
import { GearItemSheet } from '../../item/core/gear-item-sheet.js'
import { WeaponItemSheet } from '../../item/core/weapon-item-sheet.js'
import { ArmorItemSheet } from '../../item/core/armor-item-sheet.js'
// Vampire system
import { ResonanceItemSheet } from '../../item/vtm/resonance-item-sheet.js'
import { PredatorTypeItemSheet } from '../../item/vtm/predator-type-item-sheet.js'
import { ClanItemSheet } from '../../item/vtm/clan-item-sheet.js'
import { DisciplineItemSheet } from '../../item/vtm/discipline-item-sheet.js'
import { BoonItemSheet } from '../../item/vtm/boon-item-sheet.js'
// Hunter system
import { DriveItemSheet } from '../../item/htr/drive-item-sheet.js'
import { CreedItemSheet } from '../../item/htr/creed-item-sheet.js'
import { PerkItemSheet } from '../../item/htr/perk-item-sheet.js'
import { EdgePoolItemSheet } from '../../item/htr/edge-pool-item-sheet.js'
// Werewolf system
import { GiftItemSheet } from '../../item/wta/gift-item-sheet.js'
import { TalismanItemSheet } from '../../item/wta/talisman-item-sheet.js'
import { TribeItemSheet } from '../../item/wta/tribe-item-sheet.js'

export class ItemTypes extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    ItemTypes.setSortAlphabetically()
    ItemTypes.initializeLabels()
  }

  static feature = {
    label: 'Types.Item.feature',
    img: 'systems/vtm5e/assets/icons/items/feature.svg',
    types: ['feature'],
    sheetClass: FeatureItemSheet
  }

  static customRoll = {
    label: 'Types.Item.customRoll',
    img: 'systems/vtm5e/assets/icons/items/custom-roll.png',
    types: ['customRoll'],
    sheetClass: CustomRollItemSheet
  }

  static armor = {
    label: 'Types.Item.armor',
    img: '',
    types: ['armor'],
    sheetClass: ArmorItemSheet
  }

  static weapon = {
    label: 'Types.Item.weapon',
    img: '',
    types: ['weapon'],
    sheetClass: WeaponItemSheet
  }

  static gear = {
    label: 'Types.Item.gear',
    img: '',
    types: ['gear'],
    sheetClass: GearItemSheet
  }

  static trait = {
    label: 'Types.Item.trait',
    img: '',
    types: ['trait'],
    sheetClass: TraitItemSheet
  }

  static condition = {
    label: 'Types.Item.condition',
    img: '',
    types: ['condition'],
    sheetClass: ConditionItemSheet
  }

  // Vampire Items
  static clan = {
    label: 'Types.Item.clan',
    img: '',
    types: ['clan'],
    sheetClass: ClanItemSheet
  }

  static predatorType = {
    label: 'Types.Item.predatorType',
    img: '',
    types: ['predatorType'],
    sheetClass: PredatorTypeItemSheet
  }

  static resonance = {
    label: 'Types.Item.resonance',
    img: '',
    types: ['resonance'],
    sheetClass: ResonanceItemSheet
  }

  static power = {
    label: 'Types.Item.power',
    img: 'systems/vtm5e/assets/icons/items/discipline.png',
    types: ['power'],
    sheetClass: DisciplineItemSheet
  }

  static boon = {
    label: 'Types.Item.boon',
    img: 'systems/vtm5e/assets/icons/items/boon.svg',
    types: ['boon'],
    sheetClass: BoonItemSheet
  }

  // Hunter Items
  static creed = {
    label: 'Types.Item.creed',
    img: '',
    types: ['creed'],
    sheetClass: CreedItemSheet
  }

  static drive = {
    label: 'Types.Item.drive',
    img: '',
    types: ['drive'],
    sheetClass: DriveItemSheet
  }

  static perk = {
    label: 'Types.Item.perk',
    img: 'systems/vtm5e/assets/icons/items/edge.png',
    types: ['perk'],
    sheetClass: PerkItemSheet
  }

  static edgepool = {
    label: 'Types.Item.edgepool',
    img: 'systems/vtm5e/assets/icons/items/edgepool.png',
    types: ['edgepool'],
    sheetClass: EdgePoolItemSheet
  }

  // Werewolf Items
  static tribe = {
    label: 'Types.Item.tribe',
    img: '',
    types: ['tribe'],
    sheetClass: TribeItemSheet
  }

  static talisman = {
    label: 'Types.Item.talisman',
    img: '',
    types: ['talisman'],
    sheetClass: TalismanItemSheet
  }

  static gift = {
    label: 'Types.Item.gift',
    img: 'systems/vtm5e/assets/icons/items/gift.png',
    types: ['gift'],
    sheetClass: GiftItemSheet
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', ItemTypes.onReady)
