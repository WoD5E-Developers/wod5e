// Grab the list of selected tokens and map them
const tokens = canvas.tokens.controlled
const actorsList = tokens.map((i) => i.actor)

// Build the options for the select dropdown
const content = new foundry.data.fields.NumberField({
  label: game.i18n.localize('WOD5E.Compendiums.Macros.AdjustHungerBy'),
  required: true,
  nullable: false,
  initial: 0,
  min: -5,
  max: 5
}).toFormGroup(
  {},
  {
    name: 'mod'
  }
).outerHTML

// Prompt a dialog to determine which edge we're adding
const hungerModifier = await foundry.applications.api.DialogV2.prompt({
  window: {
    title: game.i18n.localize('WOD5E.Compendiums.Macros.AdjustHunger')
  },
  classes: ['wod5e', 'macro', 'dialog', 'vampire', 'dialog'],
  content,
  ok: {
    callback: (event, button) =>
      new foundry.applications.ux.FormDataExtended(button.form).object.mod
  },
  modal: true
})

if (hungerModifier) {
  for (const actor of actorsList) {
    // If the actor isn't a vampire or doesn't have hunger, skip them
    if (actor.system.gamesystem !== 'vampire' && actor.system?.hunger) continue

    // Grab the actor's current hunger
    const oldValue = Number(actor.system.hunger.value)

    // Add the hunger modifier to the actor's old vlaue
    let newValue = oldValue + hungerModifier

    // Check to make sure the input doesn't go over or below max/min values
    if (newValue > 5) newValue = 5
    if (newValue < 0) newValue = 0

    actor.update({ 'system.hunger.value': newValue })
  }
}
