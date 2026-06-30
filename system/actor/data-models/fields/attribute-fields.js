const fields = foundry.data.fields

// Main export, a TypedObjectField with the Attribute Field's data model
export function attributeFields() {
  return new fields.TypedObjectField(attributeValueField())
}

function attributeValueField() {
  return new fields.SchemaField({
    value: new fields.NumberField({ initial: 1 }),
    active: new fields.BooleanField({ initial: false })
  })
}

// Register all initial attribute fields and values of them
export function createInitialAttributes() {
  const attributes = {}

  for (const key of Object.keys(WOD5E.Attributes.getList({}))) {
    attributes[key] = createInitialAttributeValue()
  }

  return attributes
}

export function createInitialAttributeValue() {
  return {
    value: 0,
    active: false,
    bonuses: []
  }
}

export function standardDiceFields() {
  return {
    physical: createAttributeSchema(),
    social: createAttributeSchema(),
    mental: createAttributeSchema()
  }
}

function createAttributeSchema() {
  return new fields.SchemaField({
    value: new fields.NumberField({ initial: 1 })
  })
}
