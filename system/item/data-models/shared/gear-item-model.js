import { WoDItemModel } from '../base-item-model.js'
import { dicepoolFields } from '../fields/dicepool-fields.js'
import { equipmentFields } from '../fields/equipment-fields.js'
import { itemUsesFields } from '../fields/item-uses-fields.js'

export class GearItemModel extends WoDItemModel {
  static defineSchema() {
    const schema = super.defineSchema()

    // Item uses
    Object.assign(schema, itemUsesFields())

    // Equipment fields
    Object.assign(schema, equipmentFields())

    // Which dice are in the item
    Object.assign(schema, dicepoolFields())

    return schema
  }
}
