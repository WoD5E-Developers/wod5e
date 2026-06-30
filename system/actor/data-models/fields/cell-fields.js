const fields = foundry.data.fields

export const cellFields = {
  desperation: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 })
  }),
  danger: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 }),
    max: new fields.NumberField({ initial: 5 })
  })
}
