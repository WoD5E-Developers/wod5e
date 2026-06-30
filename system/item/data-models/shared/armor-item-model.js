import { WoDItemModel } from '../base-item-model.js'
import { equipmentFields } from '../fields/equipment-fields.js'

export class ArmorItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    // Armor value
    schema.armorvalue = new fields.NumberField({ initial: 0 })

    // Equipment fields
    Object.assign(schema, equipmentFields())

    return schema
  }
}
