const fields = foundry.data.fields

export const packFields = {
  territory: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 })
  }),
  community: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 })
  }),
  spirit: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 })
  })
}
