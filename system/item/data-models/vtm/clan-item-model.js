import { WoDItemModel } from '../base-item-model.js'

export class ClanItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    schema.bane = new fields.HTMLField({ initial: '' })

    return schema
  }
}
