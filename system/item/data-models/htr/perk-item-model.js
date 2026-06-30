import { WoDItemModel } from '../base-item-model.js'

export class PerkItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    schema.edge = new fields.StringField({ initial: 'arsenal' })
    schema.selected = new fields.BooleanField({ initial: false })

    return schema
  }
}
