import { WoDActorModel } from './base-actor-model.js'
import { standardDiceFields } from './fields/attribute-fields.js'
import { skillFields } from './fields/skill-fields.js'

export class SPCActorModel extends WoDActorModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = super.defineSchema()

    // The type of group
    schema.spcType = new fields.StringField({ initial: 'mortal' })

    // Manifestation
    schema.manifestation = new fields.HTMLField({ initial: '' })

    // Power
    schema.power = new fields.SchemaField({
      value: new fields.NumberField({ initial: 0 })
    })

    // General Difficulty
    schema.generaldifficulty = new fields.SchemaField({
      normal: new fields.NumberField({ initial: 0 }),
      strongest: new fields.NumberField({ initial: 0 })
    })

    // Standard Dice fields
    schema.standarddicepools = new fields.SchemaField(standardDiceFields())

    // Exceptional Dice fields
    schema.exceptionaldicepools = skillFields()

    return schema
  }
}
