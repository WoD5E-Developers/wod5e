const fields = foundry.data.fields

export function equipmentFields() {
  return {
    quantity: new fields.NumberField({ initial: 1 })
  }
}
