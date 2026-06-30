export class WoDItemModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields

    const schema = {}

    // Description
    schema.description = new fields.HTMLField({ initial: '' })

    // Macro ID
    schema.macroid = new fields.StringField({ initial: '' })

    // Bonuses
    schema.bonuses = new fields.ArrayField(new fields.ObjectField())

    // Data Item ID
    schema.dataItemId = new fields.StringField({ initial: '' })

    // Source information
    schema.source = new fields.SchemaField({
      book: new fields.StringField({ initial: '' }),
      page: new fields.StringField({ initial: '' })
    })

    return schema
  }
}
