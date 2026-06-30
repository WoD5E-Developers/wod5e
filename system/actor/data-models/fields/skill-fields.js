const fields = foundry.data.fields

// Main export, a TypedObjectField with the Skill Field's data model
export function skillFields() {
  return new fields.TypedObjectField(skillValueField())
}

function skillValueField() {
  return new fields.SchemaField({
    value: new fields.NumberField({ initial: 0 }),
    active: new fields.BooleanField({ initial: false }),
    description: new fields.HTMLField({ initial: '' }),
    macroid: new fields.StringField({ initial: '' }),
    bonuses: new fields.ArrayField(new fields.ObjectField())
  })
}

// Register all initial skill fields and values of them
export function createInitialSkills() {
  const skills = {}

  for (const key of Object.keys(WOD5E.Skills.getList({}))) {
    skills[key] = createInitialSkillValue()
  }

  return skills
}

export function createInitialSkillValue() {
  return {
    value: 0,
    active: false,
    description: '',
    macroid: '',
    bonuses: []
  }
}
