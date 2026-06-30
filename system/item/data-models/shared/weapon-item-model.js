import { WoDItemModel } from '../base-item-model.js'
import { dicepoolFields } from '../fields/dicepool-fields.js'
import { equipmentFields } from '../fields/equipment-fields.js'
import { itemUsesFields } from '../fields/item-uses-fields.js'

export class WeaponItemModel extends WoDItemModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    // Weapon type
    schema.weaponType = new fields.StringField({ initial: 'melee' })

    // Weapon value
    schema.weaponvalue = new fields.NumberField({ initial: 0 })

    // Item uses
    Object.assign(schema, itemUsesFields())

    // Equipment fields
    Object.assign(schema, equipmentFields())

    // Which dice are in the item
    Object.assign(schema, dicepoolFields())

    return schema
  }
}
