import { WoDItemModel } from '../base-item-model.js'

export class TribeItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    schema.patronSpirit = new fields.SchemaField({
      name: new fields.StringField({ initial: '' }),
      description: new fields.HTMLField({ initial: '' }),
      favor: new fields.HTMLField({ initial: '' }),
      ban: new fields.HTMLField({ initial: '' })
    })

    return schema
  }
}
