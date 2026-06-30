const fields = foundry.data.fields

export function werewolfFields() {
  return {
    // Crinos health fields
    crinosHealth: new fields.SchemaField({
      aggravated: new fields.NumberField({ initial: 0 }),
      superficial: new fields.NumberField({ initial: 0 }),
      max: new fields.NumberField({ initial: 4 }),
      value: new fields.NumberField({ initial: 4 })
    }),

    balance: new fields.SchemaField({
      hauglosk: new fields.SchemaField({
        value: new fields.NumberField({ initial: 1 })
      }),
      harano: new fields.SchemaField({
        value: new fields.NumberField({ initial: 1 })
      })
    }),

    rage: new fields.SchemaField({
      value: new fields.NumberField({ initial: 1 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    talismans: new fields.ArrayField(new fields.ObjectField()),

    frenzyActive: new fields.BooleanField({ initial: false }),
    lostTheWolf: new fields.BooleanField({ initial: false }),
    activeForm: new fields.StringField({ initial: 'homid' }),

    renown: new fields.SchemaField({
      glory: new fields.SchemaField({
        value: new fields.NumberField({ initial: 1 })
      }),
      honor: new fields.SchemaField({
        value: new fields.NumberField({ initial: 1 })
      }),
      wisdom: new fields.SchemaField({
        value: new fields.NumberField({ initial: 1 })
      })
    }),

    forms: new fields.SchemaField({
      homid: createWereformSchema(),
      glabro: createWereformSchema(),
      crinos: createWereformSchema(),
      hispo: createWereformSchema(),
      lupus: createWereformSchema()
    }),

    selectedGift: new fields.StringField({ initial: '' }),
    selectedGiftPower: new fields.StringField({ initial: '' }),

    gifts: new fields.ObjectField({
      initial: {},
      validate: false
    })
  }
}

function createWereformSchema() {
  return new fields.SchemaField({
    description: new fields.HTMLField({ initial: '' }),
    token: new fields.SchemaField({
      img: new fields.StringField({ initial: '' })
    })
  })
}

/*
function createGiftSchema() {
  return new fields.SchemaField({
    description: new fields.StringField({ initial: '' }),
    value: new fields.NumberField({ initial: 0 }),
    powers: new fields.ArrayField(new fields.ObjectField()),
    visible: new fields.BooleanField({ initial: false }),
    selected: new fields.BooleanField({ initial: false })
  })
}
*/
