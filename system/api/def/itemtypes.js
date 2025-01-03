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
// Changeling system
import { LegacyItemSheet } from '../../item/ctd/legacy-item-sheet.js'
import { KithItemSheet } from '../../item/ctd/kith-legacy-sheet.js'
// Hunter system
import { DriveItemSheet } from '../../item/htr/drive-item-sheet.js'
import { CreedItemSheet } from '../../item/htr/creed-item-sheet.js'
import { PerkItemSheet } from '../../item/htr/perk-item-sheet.js'
import { EdgePoolItemSheet } from '../../item/htr/edge-pool-item-sheet.js'
// Werewolf system
import { GiftItemSheet } from '../../item/wta/gift-item-sheet.js'
import { AuspiceItemSheet } from '../../item/wta/auspice-sheet.js'
import { TalismanItemSheet } from '../../item/wta/talisman-item-sheet.js'
import { TribeItemSheet } from '../../item/wta/tribe-item-sheet.js'

export class ItemTypes extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady () {
    ItemTypes.setSortAlphabetically()
    ItemTypes.initializeLabels()
  }

  static feature = {
    label: 'TYPES.Item.feature',
    img: 'systems/vtm5ec/assets/icons/items/feature.svg',
    types: ['feature'],
    sheetClass: FeatureItemSheet,
    restrictedActorTypes: [],
    excludedActorTypes: []
  }

  static customRoll = {
    label: 'TYPES.Item.customRoll',
    img: 'systems/vtm5ec/assets/icons/items/custom-roll.png',
    types: ['customRoll'],
    sheetClass: CustomRollItemSheet,
    restrictedActorTypes: [],
    excludedActorTypes: ['group', 'spc']
  }

  static armor = {
    label: 'TYPES.Item.armor',
    img: '',
    types: ['armor'],
    sheetClass: ArmorItemSheet,
    restrictedActorTypes: [],
    excludedActorTypes: []
  }

  static weapon = {
    label: 'TYPES.Item.weapon',
    img: '',
    types: ['weapon'],
    sheetClass: WeaponItemSheet,
    restrictedActorTypes: [],
    excludedActorTypes: []
  }

  static gear = {
    label: 'TYPES.Item.gear',
    img: '',
    types: ['gear'],
    sheetClass: GearItemSheet,
    restrictedActorTypes: [],
    excludedActorTypes: []
  }

  static trait = {
    label: 'TYPES.Item.trait',
    img: '',
    types: ['trait'],
    sheetClass: TraitItemSheet,
    restrictedActorTypes: ['spc'],
    excludedActorTypes: []
  }

  static condition = {
    label: 'TYPES.Item.condition',
    img: '',
    types: ['condition'],
    sheetClass: ConditionItemSheet,
    restrictedActorTypes: [],
    excludedActorTypes: ['group']
  }

  // Vampire Items
  static clan = {
    label: 'TYPES.Item.clan',
    img: '',
    types: ['clan'],
    sheetClass: ClanItemSheet,
    restrictedActorTypes: ['vampire'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static predatorType = {
    label: 'TYPES.Item.predatorType',
    img: '',
    types: ['predatorType'],
    sheetClass: PredatorTypeItemSheet,
    restrictedActorTypes: ['vampire'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static resonance = {
    label: 'TYPES.Item.resonance',
    img: '',
    types: ['resonance'],
    sheetClass: ResonanceItemSheet,
    restrictedActorTypes: ['vampire'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static power = {
    label: 'TYPES.Item.power',
    img: 'systems/vtm5ec/assets/icons/items/discipline.png',
    types: ['power'],
    sheetClass: DisciplineItemSheet,
    restrictedActorTypes: ['vampire', 'ghoul'],
    excludedActorTypes: ['spc']
  }

  static boon = {
    label: 'TYPES.Item.boon',
    img: 'systems/vtm5ec/assets/icons/items/boon.svg',
    types: ['boon'],
    sheetClass: BoonItemSheet,
    restrictedActorTypes: ['vampire', 'ghoul'],
    excludedActorTypes: ['spc']
  }

  // Changeling Items
  static legacy = {
    label: 'TYPES.Item.legacy',
    img: '',
    types: ['legacy'],
    sheetClass: LegacyItemSheet,
    restrictedActorTypes: ['changeling'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static kith = {
    label: 'TYPES.Item.kith',
    img: '',
    types: ['kith'],
    sheetClass: KithItemSheet,
    restrictedActorTypes: ['changeling'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  // Hunter Items
  static creed = {
    label: 'TYPES.Item.creed',
    img: '',
    types: ['creed'],
    sheetClass: CreedItemSheet,
    restrictedActorTypes: ['hunter'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static drive = {
    label: 'TYPES.Item.drive',
    img: '',
    types: ['drive'],
    sheetClass: DriveItemSheet,
    restrictedActorTypes: ['hunter'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static perk = {
    label: 'TYPES.Item.perk',
    img: 'systems/vtm5ec/assets/icons/items/edge.png',
    types: ['perk'],
    sheetClass: PerkItemSheet,
    restrictedActorTypes: ['hunter'],
    excludedActorTypes: ['spc']
  }

  static edgepool = {
    label: 'TYPES.Item.edgepool',
    img: 'systems/vtm5ec/assets/icons/items/edgepool.png',
    types: ['edgepool'],
    sheetClass: EdgePoolItemSheet,
    restrictedActorTypes: ['hunter'],
    excludedActorTypes: ['spc']
  }

  // Werewolf Items
  static tribe = {
    label: 'TYPES.Item.tribe',
    img: '',
    types: ['tribe'],
    sheetClass: TribeItemSheet,
    restrictedActorTypes: ['werewolf'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static auspice = {
    label: 'TYPES.Item.auspice',
    img: '',
    types: ['auspice'],
    sheetClass: AuspiceItemSheet,
    restrictedActorTypes: ['werewolf'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true
  }

  static talisman = {
    label: 'TYPES.Item.talisman',
    img: '',
    types: ['talisman'],
    sheetClass: TalismanItemSheet,
    restrictedActorTypes: ['werewolf'],
    excludedActorTypes: ['spc']
  }

  static gift = {
    label: 'TYPES.Item.gift',
    img: 'systems/vtm5ec/assets/icons/items/gift.png',
    types: ['gift'],
    sheetClass: GiftItemSheet,
    restrictedActorTypes: ['werewolf'],
    excludedActorTypes: ['spc']
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', ItemTypes.onReady)
