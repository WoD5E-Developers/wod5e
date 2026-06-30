const fields = foundry.data.fields

export function mageFields() {
  return {
    // Paradox — square track of 5, just like Health and Willpower but smaller.
    // Superficial = normal Paradox (cleared via Backlash rolls).
    // Aggravated  = Permanent Paradox (cannot be cleared except by draining
    // a Node or a sentient being).
    paradox: new fields.SchemaField({
      aggravated:  new fields.NumberField({ initial: 0, min: 0 }),
      superficial: new fields.NumberField({ initial: 1, min: 0 }),
      max:         new fields.NumberField({ initial: 10 }),
      value:       new fields.NumberField({ initial: 10 })
    }),

    // Arete — power stat, 0–5 dot track. Sets sphere rating ceiling.
    arete: new fields.NumberField({ initial: 1, min: 0, max: 5 }),

    // Quintessence — dot track (no fixed cap specified; defaults to 10 dots).
    quintessence: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 10 }),
      max:   new fields.NumberField({ initial: 10 })
    }),

    // Quiet — 0–5 dot track.
    quiet: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max:   new fields.NumberField({ initial: 5 })
    }),

    // Hubris — 0–5 dot track.
    hubris: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max:   new fields.NumberField({ initial: 5 })
    }),

    // Identity / concept text fields
    affiliation: new fields.StringField({ initial: '' }),
    tradition:   new fields.StringField({ initial: '' }),
    essence:     new fields.StringField({ initial: '' }),
    paradigm:    new fields.StringField({ initial: '' }),
    practice:    new fields.StringField({ initial: '' }),
    tools:       new fields.StringField({ initial: '' }),

    // Sphere values — flat numeric fields, one per sphere
    spheres: new fields.SchemaField({
      correspondence: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      entropy:        new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      forces:         new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      life:           new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      matter:         new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      mind:           new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      prime:          new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      spirit:         new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      time:           new fields.NumberField({ initial: 0, min: 0, max: 5 })
    })
  }
}
