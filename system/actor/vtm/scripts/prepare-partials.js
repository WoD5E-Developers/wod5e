/* global TextEditor */

import { prepareDisciplinePowers } from './prepare-data.js'
import { getBloodPotencyText } from './blood-potency.js'

export const prepareDisciplinesContext = async function (context, actor) {
  const actorData = actor.system

  // Tab data
  context.tab = context.tabs.disciplines

  // Part-specific data
  context.disciplines = await prepareDisciplinePowers(actorData.disciplines)

  // Get discipline data if any discipline is currently selected
  if (actorData?.selectedDiscipline) {
    context.selectedDiscipline = actorData.disciplines[actorData.selectedDiscipline]
    context.enrichedSelectedDisciplineDescription = await TextEditor.enrichHTML(context.selectedDiscipline?.description || '')
  }

  // Get power data if any power is currently selected
  if (actorData?.selectedDisciplinePower) {
    context.selectedDisciplinePower = await actor.items.get(actorData.selectedDisciplinePower)

    context.selectedDisciplinePowerDescription = await TextEditor.enrichHTML(context.selectedDisciplinePower.system.description)
  }

  return context
}

export const prepareBloodContext = async function (context, actor) {
  const actorData = actor.system
  const actorHeaders = actorData.headers

  // Tab data
  context.tab = context.tabs.blood

  // Filters for item-specific data
  const predatorFilter = actor.items.filter(item => item.type === 'predatorType')
  const resonanceFilter = actor.items.filter(item => item.type === 'resonance')
  const clanFilter = context?.clan // Filtering already done in main dataprep

  // Part-specific data
  context.blood = actorData.blood
  context.bloodpotency = await getBloodPotencyText(actorData.blood.potency)
  context.sire = actorHeaders.sire
  context.generation = actorHeaders.generation
  context.predator = predatorFilter[0]
  context.resonance = resonanceFilter[0]
  context.bane = clanFilter?.system?.bane || ''
  context.enrichedBane = await TextEditor.enrichHTML(context.bane)

  return context
}
