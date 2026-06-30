import { WoDItemModel } from '../base-item-model.js'
import { dicepoolFields } from '../fields/dicepool-fields.js'

export class PredatorTypeItemModel extends WoDItemModel {
  static defineSchema() {
    const schema = super.defineSchema()

    // Which dice are in the item
    Object.assign(schema, dicepoolFields())

    return schema
  }
}
