const fields = foundry.data.fields

export function vampireFields() {
  return {
    hunger: new fields.SchemaField({
      value: new fields.NumberField({ initial: 1 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    humanity: new fields.SchemaField({
      value: new fields.NumberField({ initial: 7 }),
      stains: new fields.NumberField({ initial: 0 })
    }),

    blood: new fields.SchemaField({
      potency: new fields.NumberField({ initial: 0 }),
      generation: new fields.StringField({ initial: '' })
    }),

    selectedDiscipline: new fields.StringField({ initial: '' }),
    selectedDisciplinePower: new fields.StringField({ initial: '' }),

    disciplines: new fields.ObjectField({
      initial: {},
      validate: false
    })
  }
}

/*
function createDisciplineSchema() {
  return new fields.SchemaField({
    description: new fields.StringField({ initial: '' }),
    value: new fields.NumberField({ initial: 0 }),
    powers: new fields.ArrayField(new fields.ObjectField()),
    visible: new fields.BooleanField({ initial: false }),
    selected: new fields.BooleanField({ initial: false })
  })
}
*/
