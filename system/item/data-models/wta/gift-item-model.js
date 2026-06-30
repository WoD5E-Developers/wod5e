import { WoDItemModel } from '../base-item-model.js'
import { dicepoolFields } from '../fields/dicepool-fields.js'

export class GiftItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    schema.level = new fields.NumberField({ initial: 0 })
    schema.cost = new fields.NumberField({ initial: 0 })
    schema.willpowercost = new fields.NumberField({ initial: 0 })

    // Which dice are in the item
    Object.assign(schema, dicepoolFields())

    schema.giftType = new fields.StringField({ initial: 'ahroun' })
    schema.renown = new fields.StringField({ initial: 'glory' })
    schema.selected = new fields.BooleanField({ initial: false })

    return schema
  }
}
