import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'

/**
 * Roll Paradox Checks — a pool of basic dice where each 8+ adds 1 Paradox.
 * Called directly from the Paradox roll button on the header.
 *
 * @param {Event} event
 */
export const _onParadoxRoll = async function (event) {
  event.preventDefault()

  const actor = this.actor
  const actorData = actor.system

  const selectors = ['paradox']
  const activeModifiers = await getActiveModifiers({ actor, selectors })

  // Default pool is 1; the ST or player adjusts via the roll dialog
  const baseDice = 1 + activeModifiers.totalValue

  await WOD5eDice.Roll({
    basicDice: Math.max(1, baseDice),
    title: game.i18n.localize('WOD5E.MTA.ParadoxRollTitle'),
    selectors,
    actor,
    data: actorData,
    disableAdvancedDice: true,
    quickRoll: false,   // false = opens roll dialog so pool can be adjusted
    callback: async (err, rollData) => {
      if (err) {
        console.error('World of Darkness 5e | Paradox Roll error: ' + err)
        return
      }

      // Each die showing 8+ increases Paradox by 1
      const results = rollData.terms[0]?.results ?? []
      const paradoxGained = results.filter((r) => r.active && r.result >= 8).length

      if (paradoxGained > 0) {
        const current = actorData.paradox.value
        const max = actorData.paradox.max
        const newValue = Math.min(current + paradoxGained, max)
        await actor.update({ 'system.paradox.value': newValue })

        if (newValue >= max) {
          foundry.documents.ChatMessage.implementation.create({
            flags: {
              wod5e: {
                name: game.i18n.localize('WOD5E.MTA.ParadoxMaxTitle'),
                img: 'systems/wod5e/assets/icons/dice/vampire/bestial-failure.png',
                description: game.i18n.format('WOD5E.MTA.ParadoxMaxDescription', {
                  actor: actor.name
                })
              }
            }
          })
        }
      }
    }
  })
}

/**
 * Absorb Quintessence — reduces Paradox, respecting the permanentParadox floor.
 * Paradox cannot go below permanentParadox from normal sources.
 * Only a Node or sentient-being drain can reach 0.
 *
 * @param {Event} event
 */
export const _onAbsorbQuintessence = async function (event) {
  event.preventDefault()

  const actor = this.actor
  const actorData = actor.system

  const amountField = new foundry.data.fields.NumberField({
    label: game.i18n.localize('WOD5E.MTA.AbsorbAmountLabel'),
    min: 1,
    initial: 1,
    integer: true,
    required: true
  }).toFormGroup({}, { name: 'amount' }).outerHTML

  const sourceField = new foundry.data.fields.StringField({
    label: game.i18n.localize('WOD5E.MTA.AbsorbSourceLabel'),
    choices: {
      normal:   game.i18n.localize('WOD5E.MTA.SourceNormal'),
      node:     game.i18n.localize('WOD5E.MTA.SourceNode'),
      sentient: game.i18n.localize('WOD5E.MTA.SourceSentient')
    },
    initial: 'normal',
    required: true
  }).toFormGroup({}, { name: 'source' }).outerHTML

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

  const amount     = Number(formData.amount) || 1
  const sourceType = formData.source || 'normal'

  const currentParadox    = actorData.paradox.value
  const permanentParadox  = actorData.permanentParadox.value ?? 0

  // Normal sources: floor is permanentParadox (minimum 1 if perm > 0, otherwise 0)
  // Node / sentient: can drain to 0
  const floor =
    sourceType === 'node' || sourceType === 'sentient'
      ? 0
      : permanentParadox

  const newParadox    = Math.max(floor, currentParadox - amount)
  const paradoxRemoved = currentParadox - newParadox

  await actor.update({ 'system.paradox.value': newParadox })

  const sourceKey =
    sourceType === 'node'     ? 'WOD5E.MTA.SourceNode' :
    sourceType === 'sentient' ? 'WOD5E.MTA.SourceSentient' :
                                'WOD5E.MTA.SourceNormal'

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
