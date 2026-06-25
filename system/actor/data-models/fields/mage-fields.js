const fields = foundry.data.fields

export function mageFields() {
  return {
    // Paradox replaces Hunger. Tracks accumulated reality-backlash.
    // 0–5. On a Paradox Check (rolled whenever Quintessence is spent),
    // each die that rolls 8+ adds 1 Paradox.
    paradox: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    // Permanent Paradox — the floor to which Paradox can be reduced
    // by absorbing Quintessence from normal sources.
    // Only draining a Node or a sentient being can reduce Paradox to 0.
    permanentParadox: new fields.NumberField({ initial: 0, min: 0, max: 5 }),

    // Arete — the Mage's mastery of magic. Analogous to Blood Potency.
    // 1–10. Sets the ceiling for sphere ratings AND the number of
    // Quintessence dice available per roll (Arete + Prime sphere rating).
    arete: new fields.NumberField({ initial: 1, min: 1, max: 10 }),

    // Quiet — loss of touch with consensus reality. One of two tracks
    // replacing the single Humanity track.  0–5.
    quiet: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    // Hubris — overconfidence and pride. The second integrity track. 0–5.
    hubris: new fields.SchemaField({
      value: new fields.NumberField({ initial: 0, min: 0, max: 5 }),
      max: new fields.NumberField({ initial: 5 })
    }),

    // Sphere selection state (mirrors discipline selection pattern)
    selectedSphere: new fields.StringField({ initial: '' }),
    selectedSpherePower: new fields.StringField({ initial: '' }),

    // Spheres object — mirrors disciplines structure exactly
    spheres: new fields.ObjectField({
      initial: {},
      validate: false
    })
  }
}
