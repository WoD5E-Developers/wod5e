const fields = foundry.data.fields

export function dicepoolFields() {
  return {
    dicepool: new fields.ObjectField()
  }
}
