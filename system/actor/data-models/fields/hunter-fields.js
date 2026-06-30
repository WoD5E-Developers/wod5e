const fields = foundry.data.fields

export function hunterFields() {
  return {
    despair: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0 })
    }),

    desperation: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0 })
    }),

    danger: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0 }),
      max: new fields.NumberField({ initial: 0 })
    }),

    selectedEdge: new fields.StringField({ initial: '' }),
    selectedEdgePerk: new fields.StringField({ initial: '' }),

    edges: new fields.ObjectField({
      initial: {},
      validate: false
    })
  }
}

/*
function createEdgeSchema() {
  return new fields.SchemaField({
    description: new fields.StringField({ initial: '' }),
    value: new fields.NumberField({ initial: 0 }),
    perks: new fields.ArrayField(new fields.ObjectField()),
    pools: new fields.ArrayField(new fields.ObjectField()),
    visible: new fields.BooleanField({ initial: false }),
    selected: new fields.BooleanField({ initial: false })
  })
}
*/
