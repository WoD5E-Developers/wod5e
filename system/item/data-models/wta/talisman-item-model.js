import { WoDItemModel } from '../base-item-model.js'
import { dicepoolFields } from '../fields/dicepool-fields.js'
import { equipmentFields } from '../fields/equipment-fields.js'

export class TalismanItemModel extends WoDItemModel {
  static defineSchema() {
    const schema = super.defineSchema()

    // Equipment fields
    Object.assign(schema, equipmentFields())

    // Which dice are in the item
    Object.assign(schema, dicepoolFields())

    return schema
  }
}
