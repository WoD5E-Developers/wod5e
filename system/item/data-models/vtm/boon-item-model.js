import { WoDItemModel } from '../base-item-model.js'

export class BoonItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    schema.boontype = new fields.StringField({ initial: '' })
    schema.points = new fields.NumberField({ initial: 0 })

    return schema
  }
}
