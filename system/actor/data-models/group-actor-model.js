import { WoDActorModel } from './base-actor-model.js'
import { cellFields } from './fields/cell-fields.js'
import { coterieFields } from './fields/coterie-fields.js'
import { packFields } from './fields/pack-fields.js'

export class GroupActorModel extends WoDActorModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = {}

    // The type of group
    schema.groupType = new fields.StringField({ initial: 'coterie' })

    // Locked field, controls whether the sheet is locked or unlocked
    schema.locked = new fields.BooleanField({ initial: false })

    // Whether the sheet is currently collapsed or not
    schema.collapsed = new fields.BooleanField({ initial: true })

    // List of members
    schema.members = new fields.ArrayField(new fields.StringField())

    // Header fields
    schema.headers = new fields.SchemaField({
      concept: new fields.StringField({ initial: '' }),
      chronicle: new fields.StringField({ initial: '' }),
      tenets: new fields.HTMLField({ initial: '' })
    })

    // Setting fields
    schema.settings = new fields.SchemaField({
      headerbg: new fields.StringField({ initial: '' }),
      background: new fields.StringField({ initial: '' })
    })

    // Various other HTML fields
    schema.biography = new fields.HTMLField({ initial: '' })
    schema.notes = new fields.HTMLField({ initial: '' })
    schema.privatenotes = new fields.HTMLField({ initial: '' })
    schema.equipment = new fields.HTMLField({ initial: '' })

    // Splat-specific fields
    Object.assign(schema, coterieFields)
    Object.assign(schema, packFields)
    Object.assign(schema, cellFields)

    return schema
  }
}
