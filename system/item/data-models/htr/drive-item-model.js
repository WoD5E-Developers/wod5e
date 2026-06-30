import { WoDItemModel } from '../base-item-model.js'

export class DriveItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    schema.redemption = new fields.HTMLField({ initial: '' })

    return schema
  }
}
