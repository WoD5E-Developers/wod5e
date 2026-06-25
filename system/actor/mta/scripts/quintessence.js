/**
 * Absorb Quintessence, reducing Paradox by the same amount.
 *
 * Floor rules:
 *   - Normal sources  → Paradox cannot fall below max(1, permanentParadox)
 *   - Node or sentient being drain → Paradox can fall all the way to 0
 *
 * @param {Event} event
 */
export const _onAbsorbQuintessence = async function (event) {
  event.preventDefault()

  const actor = this.actor
  const actorData = actor.system

  // Ask how much Quintessence is being absorbed and from what source
  const sourceField = new foundry.data.fields.StringField({
    label: game.i18n.localize('WOD5E.MTA.AbsorbSourceLabel'),
    choices: {
      normal: game.i18n.localize('WOD5E.MTA.SourceNormal'),
      node: game.i18n.localize('WOD5E.MTA.SourceNode'),
      sentient: game.i18n.localize('WOD5E.MTA.SourceSentient')
    },
    initial: 'normal',
    required: true
  }).toFormGroup({}, { name: 'source' }).outerHTML

  const amountField = new foundry.data.fields.NumberField({
    label: game.i18n.localize('WOD5E.MTA.AbsorbAmountLabel'),
    min: 1,
    initial: 1,
    integer: true,
    required: true
  }).toFormGroup({}, { name: 'amount' }).outerHTML

  const formData = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize('WOD5E.MTA.AbsorbQuintessence') },
    classes: ['wod5e', 'dialog', 'mage'],
    content: amountField + sourceField,
    ok: {
      callback: (ev, button) =>
        new foundry.applications.ux.FormDataExtended(button.form).object
    },
    modal: true
  })

  if (!formData) return

  const amount = Number(formData.amount) || 1
  const source = formData.source || 'normal'

  await applyQuintessenceAbsorption(actor, amount, source)
}

/**
 * Core logic for applying Quintessence absorption.
 * Can also be called programmatically (e.g. from macros).
 *
 * @param {Actor}  actor
 * @param {number} amount      - Quintessence absorbed
 * @param {string} sourceType  - 'normal' | 'node' | 'sentient'
 */
export async function applyQuintessenceAbsorption(actor, amount, sourceType = 'normal') {
  const actorData = actor.system
  const currentParadox = actorData.paradox.value
  const permanentParadox = actorData.permanentParadox ?? 0

  // Determine the floor
  // Node or sentient source: can reach 0
  // All other sources: cannot go below max(1, permanentParadox)
  const floor =
    sourceType === 'node' || sourceType === 'sentient'
      ? 0
      : Math.max(1, permanentParadox)

  const newParadox = Math.max(floor, currentParadox - amount)
  const paradoxRemoved = currentParadox - newParadox

  await actor.update({ 'system.paradox.value': newParadox })

  // Post a summary to chat
  const sourceKey =
    sourceType === 'node'
      ? 'WOD5E.MTA.SourceNode'
      : sourceType === 'sentient'
        ? 'WOD5E.MTA.SourceSentient'
        : 'WOD5E.MTA.SourceNormal'

  foundry.documents.ChatMessage.implementation.create({
    flags: {
      wod5e: {
        name: game.i18n.localize('WOD5E.MTA.QuintessenceAbsorbed'),
        img: 'systems/wod5e/assets/icons/dice/mortal/normal-success.png',
        description: game.i18n.format('WOD5E.MTA.QuintessenceAbsorbedDescription', {
          actor: actor.name,
          amount,
          paradoxRemoved,
          newParadox,
          source: game.i18n.localize(sourceKey),
          floor
        })
      }
    }
  })
}
