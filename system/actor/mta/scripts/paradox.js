import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'

/**
 * Roll Paradox Checks equal to the number of Quintessence points being spent.
 * Each die that rolls 8+ adds 1 Paradox to the actor.
 *
 * @param {Actor}  actor      - The Mage actor spending Quintessence
 * @param {number} diceCount  - Number of Paradox Check dice (= Quintessence spent)
 * @param {string} rollMode   - Optional roll mode override
 */
export const _onParadoxCheck = async function (actor, diceCount, rollMode) {
  // Default to the current game roll mode if none provided
  if (!rollMode) rollMode = game.settings.get('core', 'rollMode')

  const selectors = ['paradox']

  // Gather any active situational modifiers tagged for paradox
  const activeModifiers = await getActiveModifiers({ actor, selectors })
  const totalDice = Math.max(1, diceCount + activeModifiers.totalValue)

  // Fire the roll — basic dice only; paradox checks don't use the advanced die pool
  await WOD5eDice.Roll({
    basicDice: totalDice,
    title: game.i18n.format('WOD5E.MTA.ParadoxCheckTitle', { dice: totalDice }),
    selectors,
    actor,
    data: actor.system,
    disableAdvancedDice: true,
    quickRoll: true,
    rollMode,
    // After the roll resolves, count 8+ results and apply Paradox
    callback: async (err, rollData) => {
      if (err) {
        console.error('World of Darkness 5e | Paradox Check error: ' + err)
        return
      }

      // Count results of 8 or higher as paradox successes
      const results = rollData.terms[0]?.results ?? []
      const paradoxGained = results.filter((r) => r.active && r.result >= 8).length

      if (paradoxGained > 0) {
        const currentParadox = actor.system.paradox.value
        const paradoxMax = actor.system.paradox.max
        const newParadox = Math.min(currentParadox + paradoxGained, paradoxMax)

        await actor.update({ 'system.paradox.value': newParadox })

        // Warn if Paradox hits maximum
        if (newParadox >= paradoxMax) {
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
 * Spend Quintessence: calculate available dice (Arete + Prime sphere rating),
 * deduct the spent amount, then trigger Paradox Checks.
 *
 * Called from buttons/actions on the mage sheet.
 *
 * @param {Event}  event
 */
export const _onSpendQuintessence = async function (event) {
  event.preventDefault()

  const actor = this.actor
  const actorData = actor.system

  // Quintessence per roll = Arete + Prime sphere rating (floor 1)
  const arete = actorData.arete ?? 1
  const primeSphere = actorData.spheres?.prime?.value ?? 0
  const maxPerRoll = Math.max(1, arete + primeSphere)

  // Prompt for how many points to spend this roll
  const content = new foundry.data.fields.NumberField({
    label: game.i18n.format('WOD5E.MTA.QuintessenceSpendPrompt', { max: maxPerRoll }),
    min: 1,
    max: maxPerRoll,
    initial: 1,
    integer: true,
    required: true
  }).toFormGroup(
    {},
    { name: 'amount' }
  ).outerHTML

  const amountToSpend = await foundry.applications.api.DialogV2.prompt({
    window: { title: game.i18n.localize('WOD5E.MTA.SpendQuintessence') },
    classes: ['wod5e', 'dialog', 'mage'],
    content,
    ok: {
      callback: (ev, button) =>
        Number(new foundry.applications.ux.FormDataExtended(button.form).object.amount)
    },
    modal: true
  })

  if (!amountToSpend || amountToSpend < 1) return

  // Clamp to the per-roll maximum
  const spent = Math.min(amountToSpend, maxPerRoll)

  // Roll Paradox Checks equal to the number of points spent
  await _onParadoxCheck(actor, spent)
}
