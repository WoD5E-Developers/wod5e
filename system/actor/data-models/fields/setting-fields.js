const fields = foundry.data.fields

export function settingFields() {
  return {
    settings: new fields.SchemaField({
      headerbg: new fields.StringField({ initial: '' }),
      background: new fields.StringField({ initial: '' }),

      limited: new fields.SchemaField({
        biography: new fields.BooleanField({ initial: true }),
        appearance: new fields.BooleanField({ initial: true }),
        touchstones: new fields.BooleanField({ initial: false }),
        tenets: new fields.BooleanField({ initial: false })
      }),

      skillAttributeInputs: new fields.BooleanField({ initial: false }),

      // SPC-specific settings
      enableGifts: new fields.BooleanField({ initial: false }),
      enableDisciplines: new fields.BooleanField({ initial: false }),
      enableEdges: new fields.BooleanField({ initial: false }),
      generalDifficultyEnabled: new fields.BooleanField({ initial: true })
    })
  }
}
