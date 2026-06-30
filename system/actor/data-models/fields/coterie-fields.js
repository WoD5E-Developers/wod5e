const fields = foundry.data.fields

export const coterieFields = {
  chasse: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 })
  }),
  lien: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 })
  }),
  portillon: new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 })
  })
}
