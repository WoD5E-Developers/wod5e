import { WoDItemModel } from '../base-item-model.js'
import { itemUsesFields } from '../fields/item-uses-fields.js'

export class FeatureItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    // Item uses
    Object.assign(schema, itemUsesFields())

    // Points
    schema.points = new fields.NumberField({ initial: 0 })

    // Feature type
    schema.featuretype = new fields.StringField({ initial: 'background' })

    return schema
  }
}
