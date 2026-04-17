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
import { AuspiceItemSheet } from '../../item/wta/auspice-sheet.js'
import { TalismanItemSheet } from '../../item/wta/talisman-item-sheet.js'
import { TribeItemSheet } from '../../item/wta/tribe-item-sheet.js'
// Data models
import { FeatureItemModel } from '../../item/data-models/shared/feature-item-model.js'
import { CustomRollItemModel } from '../../item/data-models/shared/customRoll-item-model.js'
import { ArmorItemModel } from '../../item/data-models/shared/armor-item-model.js'
import { WeaponItemModel } from '../../item/data-models/shared/weapon-item-model.js'
import { GearItemModel } from '../../item/data-models/shared/gear-item-model.js'
import { TraitItemModel } from '../../item/data-models/shared/trait-item-model.js'
import { ConditionItemModel } from '../../item/data-models/shared/condition-item-model.js'
import { ClanItemModel } from '../../item/data-models/vtm/clan-item-model.js'
import { PredatorTypeItemModel } from '../../item/data-models/vtm/predatorType-item-model.js'
import { ResonanceItemModel } from '../../item/data-models/vtm/resonance-item-model.js'
import { PowerItemModel } from '../../item/data-models/vtm/power-item-model.js'
import { BoonItemModel } from '../../item/data-models/vtm/boon-item-model.js'
import { CreedItemModel } from '../../item/data-models/htr/creed-item-model.js'
import { DriveItemModel } from '../../item/data-models/htr/drive-item-model.js'
import { PerkItemModel } from '../../item/data-models/htr/perk-item-model.js'
import { EdgePoolItemModel } from '../../item/data-models/htr/edgepool-item-model.js'
import { TribeItemModel } from '../../item/data-models/wta/tribe-item-model.js'
import { AuspiceItemModel } from '../../item/data-models/wta/auspice-item-model.js'
import { TalismanItemModel } from '../../item/data-models/wta/talisman-item-model.js'
import { GiftItemModel } from '../../item/data-models/wta/gift-item-model.js'

/*
 *   Each item type is defined through here; this includes the item's label,
 *   id ('types'), class, restricted actor types (a whitelist), and excluded
 *   actor types (a blacklist.)
 *
 *   As of 5.4.0, this also includes the 'splat' (core, vampire, werewolf, hunter)
 *   to assist with compendium browser filtering
 *
 *   The "limitOnePerActor" property also enforces if an actor isn't supposed
 *   to have more than one of that item, and it'll make the actor sheet delete
 *   the old version of an item from the actor upon being added.
 */

export class ItemTypes extends BaseDefinitionClass {
  // Run any necessary compilation on ready
  static onReady() {
    ItemTypes.setSortAlphabetically()
    ItemTypes.initializeLabels()
  }

  static feature = {
    label: 'TYPES.Item.feature',
    img: 'systems/wod5e/assets/icons/items/feature.svg',
    types: ['feature'],
    sheetClass: FeatureItemSheet,
    sheetModel: FeatureItemModel,
    splat: 'core'
  }

  static customRoll = {
    label: 'TYPES.Item.customRoll',
    img: 'systems/wod5e/assets/icons/items/custom-roll.png',
    types: ['customRoll'],
    sheetClass: CustomRollItemSheet,
    excludedActorTypes: ['group', 'spc'],
    sheetModel: CustomRollItemModel,
    splat: 'core'
  }

  static armor = {
    label: 'TYPES.Item.armor',
    img: '',
    types: ['armor'],
    sheetClass: ArmorItemSheet,
    sheetModel: ArmorItemModel,
    splat: 'core'
  }

  static weapon = {
    label: 'TYPES.Item.weapon',
    img: '',
    types: ['weapon'],
    sheetClass: WeaponItemSheet,
    sheetModel: WeaponItemModel,
    splat: 'core'
  }

  static gear = {
    label: 'TYPES.Item.gear',
    img: '',
    types: ['gear'],
    sheetClass: GearItemSheet,
    sheetModel: GearItemModel,
    splat: 'core'
  }

  static trait = {
    label: 'TYPES.Item.trait',
    img: '',
    types: ['trait'],
    sheetClass: TraitItemSheet,
    restrictedActorTypes: ['spc'],
    sheetModel: TraitItemModel,
    splat: 'core'
  }

  static condition = {
    label: 'TYPES.Item.condition',
    img: '',
    types: ['condition'],
    sheetClass: ConditionItemSheet,
    restrictedActorTypes: [],
    excludedActorTypes: ['group'],
    sheetModel: ConditionItemModel,
    splat: 'core'
  }

  // Vampire Items
  static clan = {
    label: 'TYPES.Item.clan',
    img: '',
    types: ['clan'],
    sheetClass: ClanItemSheet,
    restrictedActorTypes: ['vampire'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true,
    sheetModel: ClanItemModel,
    splat: 'vampire'
  }

  static predatorType = {
    label: 'TYPES.Item.predatorType',
    img: '',
    types: ['predatorType'],
    sheetClass: PredatorTypeItemSheet,
    restrictedActorTypes: ['vampire'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true,
    sheetModel: PredatorTypeItemModel,
    splat: 'vampire'
  }

  static resonance = {
    label: 'TYPES.Item.resonance',
    img: '',
    types: ['resonance'],
    sheetClass: ResonanceItemSheet,
    restrictedActorTypes: ['vampire'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true,
    sheetModel: ResonanceItemModel,
    splat: 'vampire'
  }

  static power = {
    label: 'TYPES.Item.power',
    img: 'systems/wod5e/assets/icons/items/discipline.png',
    types: ['power'],
    sheetClass: DisciplineItemSheet,
    restrictedActorTypes: ['vampire', 'ghoul'],
    sheetModel: PowerItemModel,
    splat: 'vampire'
  }

  static boon = {
    label: 'TYPES.Item.boon',
    img: 'systems/wod5e/assets/icons/items/boon.svg',
    types: ['boon'],
    sheetClass: BoonItemSheet,
    restrictedActorTypes: ['vampire', 'ghoul', 'coterie'],
    sheetModel: BoonItemModel,
    splat: 'vampire'
  }

  // Hunter Items
  static creed = {
    label: 'TYPES.Item.creed',
    img: '',
    types: ['creed'],
    sheetClass: CreedItemSheet,
    restrictedActorTypes: ['hunter'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true,
    sheetModel: CreedItemModel,
    splat: 'hunter'
  }

  static drive = {
    label: 'TYPES.Item.drive',
    img: '',
    types: ['drive'],
    sheetClass: DriveItemSheet,
    restrictedActorTypes: ['hunter'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true,
    sheetModel: DriveItemModel,
    splat: 'hunter'
  }

  static perk = {
    label: 'TYPES.Item.perk',
    img: 'systems/wod5e/assets/icons/items/edge.png',
    types: ['perk'],
    sheetClass: PerkItemSheet,
    restrictedActorTypes: ['hunter'],
    sheetModel: PerkItemModel,
    splat: 'hunter'
  }

  static edgepool = {
    label: 'TYPES.Item.edgepool',
    img: 'systems/wod5e/assets/icons/items/edgepool.png',
    types: ['edgepool'],
    sheetClass: EdgePoolItemSheet,
    restrictedActorTypes: ['hunter'],
    excludedActorTypes: ['spc'],
    sheetModel: EdgePoolItemModel,
    splat: 'hunter'
  }

  // Werewolf Items
  static tribe = {
    label: 'TYPES.Item.tribe',
    img: '',
    types: ['tribe'],
    sheetClass: TribeItemSheet,
    restrictedActorTypes: ['werewolf'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true,
    sheetModel: TribeItemModel,
    splat: 'werewolf'
  }

  static auspice = {
    label: 'TYPES.Item.auspice',
    img: '',
    types: ['auspice'],
    sheetClass: AuspiceItemSheet,
    restrictedActorTypes: ['werewolf'],
    excludedActorTypes: ['spc'],
    limitOnePerActor: true,
    sheetModel: AuspiceItemModel,
    splat: 'werewolf'
  }

  static talisman = {
    label: 'TYPES.Item.talisman',
    img: '',
    types: ['talisman'],
    sheetClass: TalismanItemSheet,
    restrictedActorTypes: ['werewolf', 'pack'],
    sheetModel: TalismanItemModel,
    splat: 'werewolf'
  }

  static gift = {
    label: 'TYPES.Item.gift',
    img: 'systems/wod5e/assets/icons/items/gift.png',
    types: ['gift'],
    sheetClass: GiftItemSheet,
    restrictedActorTypes: ['werewolf', 'spirit'],
    sheetModel: GiftItemModel,
    splat: 'werewolf'
  }
}

// Hook to call onReady when the game is ready
Hooks.once('ready', ItemTypes.onReady)
