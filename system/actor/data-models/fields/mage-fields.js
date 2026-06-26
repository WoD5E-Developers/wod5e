const fields = foundry.data.fields

export function mageFields() {
  return {
    // Paradox — replaces Hunger. 0–5 dot track.
    // Cannot go below permanentParadox via normal absorption.
    paradox: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    // Permanent Paradox — dot track (0–5), acts as floor for Paradox.
    permanentParadox: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    // Arete — power stat 1–10. Sets sphere rating ceiling and Quintessence dice.
    arete: new fields.NumberField({ initial: 1, min: 1, max: 10 }),

    // Quiet — square counter 0–5. Replaces part of Humanity.
    quiet: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    // Hubris — square counter 0–5. Replaces part of Humanity.
    hubris: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    // Tradition — plain text field shown in header
    tradition: new fields.StringField({ initial: '' }),

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
