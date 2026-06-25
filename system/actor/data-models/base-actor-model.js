import { attributeFields } from './fields/attribute-fields.js'
import { hunterFields } from './fields/hunter-fields.js'
import { mageFields } from './fields/mage-fields.js'
import { settingFields } from './fields/setting-fields.js'
import { skillFields } from './fields/skill-fields.js'
import { vampireFields } from './fields/vampire-fields.js'
import { werewolfFields } from './fields/werewolf-fields.js'

export class WoDActorModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = {}

    // Locked field, controls whether the sheet is locked or unlocked
    schema.locked = new fields.BooleanField({ initial: false })

    // Group field, controls which group the actor is assigned to
    schema.group = new fields.StringField({ initial: '' })

    // Determines whether an actor sheet has skill and attribute data for processing
    schema.hasSkillAttributeData = new fields.BooleanField({ initial: true })

    // Biograhy fields
    schema.bio = new fields.SchemaField({
      age: new fields.SchemaField({
        trueage: new fields.StringField({ initial: '' }),
        apparent: new fields.StringField({ initial: '' })
      }),
      dateof: new fields.SchemaField({
        birth: new fields.StringField({ initial: '' }),
        death: new fields.StringField({ initial: '' })
      }),
      history: new fields.HTMLField({ initial: '' })
    })

    // Header fields
    schema.headers = new fields.SchemaField({
      concept: new fields.StringField({ initial: '' }),
      chronicle: new fields.StringField({ initial: '' }),
      ambition: new fields.StringField({ initial: '' }),
      desire: new fields.StringField({ initial: '' }),
      touchstones: new fields.HTMLField({ initial: '' }),
      tenets: new fields.HTMLField({ initial: '' }),

      // Vampire
      sire: new fields.StringField({ initial: '' }),
      generation: new fields.StringField({ initial: '' }),
      domitor: new fields.StringField({ initial: '' }),
      creedfields: new fields.StringField({ initial: '' }),

      // Hunter
      cellname: new fields.StringField({ initial: '' })
    })

    // XP fields
    schema.experiences = new fields.ArrayField(new fields.ObjectField())
    schema.exp = new fields.SchemaField({
      value: new fields.NumberField({ initial: 0 }),
      max: new fields.NumberField({ initial: 0 })
    })
    schema.derivedXP = new fields.SchemaField({
      totalXP: new fields.NumberField({ initial: 0 }),
      remainingXP: new fields.NumberField({ initial: 0 })
    })

    // Health fields
    schema.health = new fields.SchemaField({
      aggravated: new fields.NumberField({ initial: 0 }),
      superficial: new fields.NumberField({ initial: 0 }),
      max: new fields.NumberField({ initial: 5 }),
      value: new fields.NumberField({ initial: 5 })
    })

    // Willpower fields
    schema.willpower = new fields.SchemaField({
      aggravated: new fields.NumberField({ initial: 0 }),
      superficial: new fields.NumberField({ initial: 0 }),
      max: new fields.NumberField({ initial: 5 }),
      value: new fields.NumberField({ initial: 5 })
    })

    // Attribute fields
    schema.attributes = attributeFields()

    // Skill fields
    schema.skills = skillFields()

    // Setting fields
    Object.assign(schema, settingFields())

    // Various other HTML fields
    schema.description = new fields.HTMLField({ initial: '' })
    schema.notes = new fields.HTMLField({ initial: '' })
    schema.privatenotes = new fields.HTMLField({ initial: '' })
    schema.biography = new fields.HTMLField({ initial: '' })
    schema.appearance = new fields.HTMLField({ initial: '' })
    schema.equipment = new fields.HTMLField({ initial: '' })

    // Place for splat-specific bonuses to be defined
    schema.bonuses = new fields.ObjectField()

    // Splat-specific fields
    Object.assign(schema, vampireFields())
    Object.assign(schema, werewolfFields())
    Object.assign(schema, hunterFields())
    Object.assign(schema, mageFields())

    return schema
  }
}
