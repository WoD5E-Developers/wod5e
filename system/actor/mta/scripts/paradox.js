import { WOD5eDice } from '../../../scripts/system-rolls.js'
import { getActiveModifiers } from '../../../scripts/rolls/situational-modifiers.js'

/**
 * Paradox Roll — works like a Vampire Rouse Check, but rolls Paradox dice.
 * Opens a dialog (mage-roll-dialog.hbs) to choose dice count, difficulty,
 * and roll mode — same flow as Rouse but with the selection window shown.
 *
 * On a failure (no success, i.e. result < 6), increases Paradox (superficial)
 * by 1 per failed die, capped at the track max minus current aggravated.
 */
export const _onParadoxRoll = async function (event) {
  event.preventDefault()

  const actor     = this.actor
  const actorData = actor.system
  const selectors = ['paradox']

  const activeModifiers = await getActiveModifiers({ actor, selectors })
  const diceCount = Math.max(1, 1 + activeModifiers.totalValue)

  await WOD5eDice.Roll({
    advancedDice: diceCount,
    actor,
    data: actorData,
    title: game.i18n.localize('WOD5E.MTA.ParadoxRollTitle'),
    selectors,
    system: 'mage',
    disableBasicDice: true,
    quickRoll: false,
    callback: async (err, rollData) => {
      if (err) {
        console.error('World of Darkness 5e | Paradox Roll error: ' + err)
        return
      }

      // rollData is a shallow spread of the WOD5eRoll instance, so getters
      // like .basicDice/.advancedDice are lost — read directly from .terms
      // instead, filtering by dieType (set on each die term).
      const advancedTerm = rollData.terms?.find((t) => t.dieType === 'advanced')
      const results = advancedTerm?.results ?? []
      const failures = results.filter(
        (r) => r.active && r.success === false && !r.discarded
      ).length

      if (failures > 0) {
        const max = actorData.paradox.max
        const currentSuperficial = actorData.paradox.superficial
        const currentAggravated  = actorData.paradox.aggravated
        const currentTotal = currentSuperficial + currentAggravated

        const newSuperficial = Math.min(
          currentSuperficial + failures,
          max - currentAggravated
        )

        await actor.update({ 'system.paradox.superficial': newSuperficial })

        if (currentTotal >= max) {
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
 * Paradox Backlash roll.
 *
 * Dice pool = current Paradox value (superficial + aggravated), capped at
 * a maximum of 5 dice. Plain pool roll — does NOT replace dice with
 * Paradox dice.
 *
 * Each success removes 1 superficial Paradox. Each success that isn't a 10
 * counts as 1 point of Backlash damage (a 10 is still a success and still
 * removes 1 superficial Paradox, but doesn't add to the Backlash total).
 *
 * Posts a chat message: "<name> has received N backlash damage."
 */
export const _onParadoxBacklashRoll = async function (event) {
  event.preventDefault()

  const actor     = this.actor
  const actorData = actor.system

  const currentParadox =
    (actorData.paradox.superficial ?? 0) + (actorData.paradox.aggravated ?? 0)

  if (currentParadox <= 0) {
    ui.notifications.info(game.i18n.localize('WOD5E.MTA.NoParadoxToRoll'))
    return
  }

  const pool = Math.min(currentParadox, 5)

  await WOD5eDice.Roll({
    basicDice: pool,
    actor,
    data: actorData,
    title: game.i18n.localize('WOD5E.MTA.ParadoxBacklashTitle'),
    selectors: ['paradox'],
    system: 'mortal',           // plain pool — no Paradox-die replacement
    disableAdvancedDice: true,
    quickRoll: true,
    callback: async (err, rollData) => {
      if (err) {
        console.error('World of Darkness 5e | Paradox Backlash error: ' + err)
        return
      }

      // rollData is a shallow spread of the WOD5eRoll instance, so getters
      // like .basicDice/.advancedDice are lost — read directly from .terms
      // instead, filtering by dieType (set on each die term).
      const basicTerm = rollData.terms?.find((t) => t.dieType === 'basic')
      const results = basicTerm?.results ?? []
      const activeResults = results.filter((r) => r.active)

      // A 10 counts as 1 success (no extra weight). Every success that
      // isn't a 10 contributes 1 point of Backlash damage.
      const successes = activeResults.filter((r) => r.result >= 6).length
      const tens       = activeResults.filter((r) => r.result === 10).length
      const backlash    = successes - tens

      // Remove superficial Paradox equal to the number of successes
      const newSuperficial = Math.max(0, actorData.paradox.superficial - successes)
      await actor.update({ 'system.paradox.superficial': newSuperficial })

      foundry.documents.ChatMessage.implementation.create({
        speaker: foundry.documents.ChatMessage.implementation.getSpeaker({ actor }),
        content: `<p>${game.i18n.format('WOD5E.MTA.BacklashDamageMessage', {
          actor: actor.name,
          amount: backlash
        })}</p>`
      })
    }
  })
}
