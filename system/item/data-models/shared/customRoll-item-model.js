import { WoDItemModel } from '../base-item-model.js'
import { dicepoolFields } from '../fields/dicepool-fields.js'

export class CustomRollItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    // Modifier to the custom roll
    schema.modifier = new fields.NumberField({ initial: 0 })

    // Which dice are in the item
    Object.assign(schema, dicepoolFields())

    return schema
  }
}
