// Grab the list of selected tokens and map them
const tokens = canvas.tokens.controlled
const actorsList = tokens.map((i) => i.actor)

// Build the options for the select dropdown
const content = new foundry.data.fields.NumberField({
  label: game.i18n.localize('WOD5E.Compendiums.Macros.AdjustRageBy'),
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
const rageModifier = await foundry.applications.api.DialogV2.prompt({
  window: {
    title: game.i18n.localize('WOD5E.Compendiums.Macros.AdjustRage')
  },
  classes: ['wod5e', 'macro', 'dialog', 'werewolf', 'dialog'],
  content,
  ok: {
    callback: (event, button) =>
      new foundry.applications.ux.FormDataExtended(button.form).object.mod
  },
  modal: true
})

if (rageModifier) {
  for (const actor of actorsList) {
    // If the actor isn't a werewolf or doesn't have rage, skip them
    if (actor.system.gamesystem !== 'werewolf' && actor.system?.rage) continue

    // Grab the actor's current rage
    const oldValue = Number(actor.system.rage.value)

    // Add the rage modifier to the actor's old vlaue
    let newValue = oldValue + rageModifier

    // Check to make sure the input doesn't go over or below max/min values
    if (newValue > 5) newValue = 5
    if (newValue < 0) newValue = 0

    actor.update({ 'system.rage.value': newValue })
  }
}
